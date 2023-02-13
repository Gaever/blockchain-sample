import { Coin, ConditionWithArgs } from '@/types/blockchain';
import { BLS, moduloWithNeg } from '@/utils';
import { G1Element, PrivateKey } from '@chiamine/bls-signatures';
import { bigint_from_bytes, bigint_to_bytes, Bytes, int_from_bytes, OPERATOR_LOOKUP, run_program, SExp } from 'clvm';
import * as clvmTools from 'clvm_tools';
import { sha256 } from 'js-sha256';
import { ConditionOpcode } from './puzzle-utils';

export const DEFAULT_HIDDEN_PUZZLE_HASH = Bytes.from('711d6c4e32c92e53179b199484cf8c897542bc57f2b22582799f9d657eec4699', 'hex').raw();
const SYNTHETIC_MOD = clvmTools.assemble('(point_add 2 (pubkey_for_exp (sha256 2 5)))');
const PUZZLE_FOR_SYNTHETIC_PK_MOD = clvmTools.assemble(
  '(a (q 2 (i 11 (q 2 (i (= 5 (point_add 11 (pubkey_for_exp (sha256 11 (a 6 (c 2 (c 23 ()))))))) (q 2 23 47) (q 8)) 1) (q 4 (c 4 (c 5 (c (a 6 (c 2 (c 23 ()))) ()))) (a 23 47))) 1) (c (q 50 2 (i (l 5) (q 11 (q . 2) (a 6 (c 2 (c 9 ()))) (a 6 (c 2 (c 13 ())))) (q 11 (q . 1) 5)) 1) 1))'
);
const PUZZLE_FOR_CONDITIONS_MOD_STR = '(c (q . 1) 2)';

const Err = {
  SEXP_ERROR: 17,
  INVALID_CONDITION: 10,
};

class TransactionSigner {
  public async secretKeyForPublicKey(publicKey: G1Element, pkToSkFn: (pk: string) => Promise<string>, groupOrder: string): Promise<Uint8Array> {
    const bls = await BLS();
    const pk = Bytes.from(publicKey.serialize()).hex();
    const sk = await pkToSkFn(pk);
    if (!sk) throw new Error(`no spk for sk ${pk}`);
    const secretKey = bls.PrivateKey.from_bytes(Buffer.from(sk, 'hex'), false);
    return this.calculateSyntheticSecretKey(secretKey, DEFAULT_HIDDEN_PUZZLE_HASH, groupOrder);
  }

  public async calculateSyntheticPublicKey(public_key: G1Element, hidden_puzzle_hash: Uint8Array): Promise<G1Element> {
    const r = run_program(SYNTHETIC_MOD, SExp.to([Bytes.from(public_key.serialize()), Bytes.from(hidden_puzzle_hash)]), OPERATOR_LOOKUP);
    return (await BLS()).G1Element.from_bytes(r[1]?.atom?.raw?.());
  }

  private async calculateSyntheticSecretKey(secretKey: PrivateKey, hiddenPuzzleHash: Uint8Array, groupOrder: string) {
    const secretExponent: bigint = bigint_from_bytes(Bytes.from(secretKey.serialize()));
    const publicKey = secretKey.get_g1();
    const bnGroupOrder: bigint = bigint_from_bytes(Bytes.from(groupOrder, 'hex'), { signed: true });
    const syntheticOffset = this.calculateSyntheticOffset(publicKey, hiddenPuzzleHash, bnGroupOrder);
    const syntheticSecretExponent: bigint = (secretExponent + syntheticOffset) % bnGroupOrder;
    let blob = bigint_to_bytes(syntheticSecretExponent);
    if (blob.length < 32) {
      const zeros = Array.from(Array(32 - blob.length).keys()).map(() => 0);
      blob = Bytes.from(new Uint8Array([...zeros, ...blob.raw()]));
    }
    return blob.raw();
  }

  private calculateSyntheticOffset(publicKey: G1Element, hiddenPuzzleHash: Uint8Array, groupOrder: bigint): bigint {
    const blob = sha256([...Array.from(publicKey.serialize()), ...Array.from(hiddenPuzzleHash)]);
    const blobBigint: bigint = bigint_from_bytes(Bytes.from(blob, 'hex'), { signed: true });
    const offset = moduloWithNeg(blobBigint, groupOrder);
    return offset;
  }

  public puzzleForPk(public_key: G1Element) {
    return this.puzzleForPublicKeyAndHiddenPuzzleHash(public_key, DEFAULT_HIDDEN_PUZZLE_HASH);
  }

  private async puzzleForPublicKeyAndHiddenPuzzleHash(publicKey: G1Element, hiddenPuzzleHash: Uint8Array): Promise<SExp> {
    const syntheticPublicKey = await this.calculateSyntheticPublicKey(publicKey, hiddenPuzzleHash);
    return this.puzzleForSyntheticPublicKey(syntheticPublicKey);
  }

  private puzzleForSyntheticPublicKey(synthetic_public_key: G1Element): SExp {
    const arg = SExp.to([synthetic_public_key]);
    const r = clvmTools.curry(PUZZLE_FOR_SYNTHETIC_PK_MOD, arg);
    return r?.[1];
  }

  private asAtomList(sexp: SExp) {
    const items = [];
    let obj = sexp;
    while (true) {
      const pair = obj.pair;
      if (!pair) break;
      const atom = pair[0].atom;
      if (!atom) break;
      items.push(atom);
      obj = pair[1];
    }
    return items;
  }

  private parseSexpToCondition(sexp: SExp): [any, ConditionWithArgs] {
    const asAtoms = this.asAtomList(sexp);
    if (asAtoms?.length < 1) {
      return [Err.INVALID_CONDITION, undefined];
    }

    const opcode = int_from_bytes(Bytes.from(asAtoms[0]));
    return [undefined, { opcode, vars: asAtoms.slice(1) }];
  }

  public conditionsDictForSolution(puzzleReveal: SExp, solution: SExp, maxCost: number) {
    const [error, result, cost] = this.conditionsForSolution(puzzleReveal, solution, maxCost);
    if (error || !result) return [error, undefined, 0];
    return [undefined, this.conditionsByOpcode(result), cost];
  }

  private conditionsForSolution(puzzleReveal: SExp, solution: SExp, maxCost: number) {
    try {
      const [cost, r] = run_program(puzzleReveal, solution, OPERATOR_LOOKUP, maxCost);
      const [error, result] = this.parseSexpToConditions(r);
      return [error, result, cost];
    } catch {
      return [Err.SEXP_ERROR, undefined, 0];
    }
  }

  private parseSexpToConditions(sexp: SExp) {
    const results: ConditionWithArgs[] = [];
    try {
      const items = sexp.as_iter();

      let res = items.next();
      while (!res.done) {
        if (res.value) {
          const [error, cvp] = this.parseSexpToCondition(res.value as SExp);
          if (error) return [error, undefined];
          results.push(cvp);
        }

        res = items.next();
      }
    } catch {
      return [Err.INVALID_CONDITION, undefined];
    }

    return [undefined, results];
  }

  public createdOutputsForConditionsDict(conditionsDict: { [key: number]: ConditionWithArgs[] }, inputCoinName: string): Coin[] {
    const outputCoins = [];
    (conditionsDict?.[ConditionOpcode.CREATE_COIN] || []).forEach((cvp) => {
      const puzzleHash = cvp.vars[0];
      const amountBin = cvp.vars[1];
      const amount = bigint_from_bytes(amountBin).toString();
      const coin: Coin = {
        parent_coin_info: `0x${inputCoinName}`,
        puzzle_hash: `0x${puzzleHash.hex()}`,
        amount,
      };
      outputCoins.push(coin);
    });

    return outputCoins;
  }

  private conditionsByOpcode(conditions: ConditionWithArgs[]): { [key: number]: ConditionWithArgs[] } {
    const d = {};
    conditions.forEach((cvp) => {
      if (!d?.[cvp?.opcode]) {
        d[cvp.opcode] = [];
      }
      d[cvp.opcode].push(cvp);
    });
    return d;
  }

  public async pkmPairsForConditionsDict(conditionsDict: { [key: number]: ConditionWithArgs[] }, coinName: Uint8Array, additionalData: Uint8Array) {
    if (!coinName) throw new Error('!coinName');
    const ret: [Uint8Array, Uint8Array][] = [];

    (conditionsDict[ConditionOpcode.AGG_SIG_UNSAFE] || []).forEach((cwa) => {
      if (cwa?.vars?.length !== 2) throw new Error();
      if (!(cwa?.vars?.[0]?.length === 48 && cwa?.vars?.[1]?.length <= 1024)) throw new Error();
      if (!(cwa?.vars?.[0] !== undefined && cwa?.vars?.[1] !== undefined)) throw new Error();
      ret.push([cwa.vars[0].raw(), cwa.vars[1].raw()]);
    });

    (conditionsDict[ConditionOpcode.AGG_SIG_ME] || []).forEach((cwa) => {
      if (cwa?.vars?.length !== 2) throw new Error();
      if (!(cwa?.vars?.[0]?.length === 48 && cwa?.vars?.[1]?.length <= 1024)) throw new Error();
      if (!(cwa?.vars?.[0] !== undefined && cwa?.vars?.[1] !== undefined)) throw new Error();
      ret.push([cwa.vars[0].raw(), new Uint8Array([...cwa.vars[1].raw(), ...coinName, ...additionalData])]);
    });

    return ret;
  }

  public puzzleForConditions(conditions: any): SExp {
    const argsSexp = SExp.to([conditions]);
    const argsStrWithoutQuotes = clvmTools.disassemble(argsSexp).replace(/"/gim, '');
    const out = [];
    clvmTools.setPrintFunction((...messages: any[]) => {
      out.push(...messages);
    });
    clvmTools.go('brun', PUZZLE_FOR_CONDITIONS_MOD_STR, argsStrWithoutQuotes);
    const sexp = clvmTools.assemble(out[0]);

    return sexp;
  }
}

export default new TransactionSigner();
