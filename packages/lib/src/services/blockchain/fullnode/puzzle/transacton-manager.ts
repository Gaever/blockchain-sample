import { Coin, CoinSpend, FullnodeEnv, KeyStorage, TransactionRecord } from '@/types/blockchain';
import { addressToPuzzleHash, BLS } from '@/utils';
import { G1Element, G2Element } from '@chiamine/bls-signatures';
import autoBind from 'auto-bind';
import BigNumber from 'bignumber.js';
import { Bytes, initializeBLS, SExp, to_hexstr } from 'clvm';
import * as clvmTools from 'clvm_tools';
import Debug from 'debug';
import { getCoinName, makeAssertCoinAnnouncement, makeCreateCoinAnnouncement, makeCreateCoinCondition, makeReserveFeeCondition } from './puzzle-utils';
import SpendBundle from './spend-bundle';
import transactionSigner, { DEFAULT_HIDDEN_PUZZLE_HASH } from './transaction-signer';

// @ts-ignore
const debug = Debug('ctocker:broker');
debug.log = console.log.bind(console);

interface Primary {
  puzzleHash: string;
  amount: string;
}

let isBlsInitialized = false;

class TransactionManager {
  private fullnodeEnv: FullnodeEnv;
  public keyStorage: KeyStorage = {};
  private spkToSkMap: { [spk: string]: string } = {};

  constructor() {
    autoBind(this);
  }

  public async init(fullnodeEnv: FullnodeEnv, keyStorage: KeyStorage = {}) {
    this.fullnodeEnv = fullnodeEnv;
    if (!isBlsInitialized) {
      await initializeBLS();
      isBlsInitialized = true;
    }
    await clvmTools.initialize();
    this.mapKeyStorage(keyStorage);
  }

  private mapKeyStorage(keyStorage: KeyStorage) {
    for (const address of Object.keys(keyStorage || {})) {
      const puzzleHash = addressToPuzzleHash(address);
      this.keyStorage[puzzleHash] = keyStorage[address];
    }
  }

  private async phToPk(ph: string) {
    return this.keyStorage[ph].pk;
  }

  private async spkToSk(spk: string) {
    return this.spkToSkMap[spk];
  }

  public async creatStockConfigTransaction(json: any, amount: string, fromPuzzleHash: string, toPuzzleHash: string, coins: Coin[], fee: string): Promise<TransactionRecord> {
    const newPh = toPuzzleHash;
    const changePh = fromPuzzleHash;
    if (!json) throw new Error('no json specified for stock config transaction');

    await this.storeSpk(fromPuzzleHash);

    const unsignedCoinSpends = await this.generateUnsignedTransaction({ amount, newPh, changePh, fee, coins });
    const unsignedTransactionWithUrlCoin = unsignedCoinSpends.map((coinSpend, index) => {
      if (index === unsignedCoinSpends.length - 1) {
        return this.injectUrlToSolution(coinSpend, json);
      }
      return coinSpend;
    });

    const spendBundle = await this.generateSignedTransaction(unsignedTransactionWithUrlCoin);
    const transactionRecord = this.createTransactionRecord({ spendBundle, amount, newPh: toPuzzleHash, changePh: fromPuzzleHash, fee });

    return transactionRecord;
  }

  private injectUrlToSolution(coinSpend: CoinSpend, json: any): CoinSpend {
    const solutionHex = coinSpend.solution.toString();
    let solutionClvm;
    clvmTools.setPrintFunction((...messages: any[]) => {
      solutionClvm = messages[0];
    });
    clvmTools.opd(['path_or_code', solutionHex]);
    const injectedClvm = `${solutionClvm.slice(0, solutionClvm.length - 1)} (${JSON.stringify(json)}))`;
    const sexp = clvmTools.assemble(injectedClvm);
    const injectedCoinSpend: CoinSpend = {
      ...coinSpend,
      solution: sexp,
    };
    return injectedCoinSpend;
  }

  public async createTransaction(amount: string, fromPuzzleHash: string, toPuzzleHash: string, coins: Coin[], fee: string): Promise<TransactionRecord> {
    const newPh = toPuzzleHash;
    const changePh = fromPuzzleHash;

    await this.storeSpk(fromPuzzleHash);

    const unsignedCoinSpends = await this.generateUnsignedTransaction({ amount, newPh, changePh, fee, coins });
    const spendBundle = await this.generateSignedTransaction(unsignedCoinSpends);
    const transactionRecord = this.createTransactionRecord({ spendBundle, amount, newPh: toPuzzleHash, changePh: fromPuzzleHash, fee });
    return transactionRecord;
  }

  private async storeSpk(puzzleHash: string) {
    const bls = await BLS();
    const g1elementPk = bls.G1Element.from_bytes(Bytes.from(this.keyStorage[puzzleHash].pk, 'hex').raw());
    const g1elementSpk = await transactionSigner.calculateSyntheticPublicKey(g1elementPk, DEFAULT_HIDDEN_PUZZLE_HASH);
    const spkHex = bls.Util.hex_str(g1elementSpk.serialize());
    this.spkToSkMap[spkHex] = this.keyStorage[puzzleHash].sk;
  }

  private createTransactionRecord({
    spendBundle,
    amount,
    newPh,
    changePh,
    fee,
  }: {
    spendBundle: SpendBundle;
    amount: string;
    newPh: string;
    changePh: string;
    fee: string;
  }): TransactionRecord {
    const now = Math.round(new Date().getTime() / 1000);
    const additions: Coin[] = spendBundle.additions();
    const removals: Coin[] = spendBundle.removals();
    const additionsSumm = additions.reduce((sum, coin) => sum.plus(coin.amount), new BigNumber(0));
    const removalsSumm = removals.reduce((sum, coin) => sum.plus(coin.amount), new BigNumber(0));

    if (!additionsSumm.plus(fee).eq(removalsSumm)) throw new Error('Additions and removals summ not equal');

    const changeCoin = additions.find((coin) => coin.puzzle_hash === changePh);
    const payoutCoin = additions.find((coin) => coin.puzzle_hash === newPh);

    return {
      confirmed_at_height: 0,
      created_at_time: now,
      to_puzzle_hash: newPh,
      amount,
      fee_amount: fee,
      confirmed: false,
      sent: 0,
      spend_bundle: spendBundle.raw(),
      additions,
      removals,
      wallet_id: 1,
      sent_to: [],
      trade_id: undefined,
      type: 1,
      name: spendBundle.name(),
      change_tx_id: changeCoin && to_hexstr(getCoinName(changeCoin)),
      payout_tx_id: payoutCoin && to_hexstr(getCoinName(payoutCoin)),
    };
  }

  private async generateSignedTransaction(unsignedTransaction: CoinSpend[]): Promise<SpendBundle> {
    if (unsignedTransaction.length < 1) throw new Error('GENERATE_TRANSACTION');
    const spendBundle = await this.signCoinSpends({
      coinSpends: unsignedTransaction,
      additionalData: this.fullnodeEnv.AGG_SIG_ME_ADDITIONAL_DATA,
      maxCost: this.fullnodeEnv.MAX_BLOCK_COST_CLVM,
    });

    return spendBundle;
  }

  private async signCoinSpends({ coinSpends, additionalData, maxCost }: { coinSpends: CoinSpend[]; additionalData: string; maxCost: any }): Promise<SpendBundle> {
    const bls = await BLS();
    const signatures: G2Element[] = [];
    const spkList: G1Element[] = [];
    const msgList: Uint8Array[] = [];

    for (const coinSpend of coinSpends) {
      const [err, conditionsDict] = transactionSigner.conditionsDictForSolution(coinSpend.puzzle_reveal, coinSpend.solution, maxCost);
      if (err || !conditionsDict) throw new Error(`Sign transaction failed, con:${conditionsDict}, error: ${err}`);

      const pairs = await transactionSigner.pkmPairsForConditionsDict(conditionsDict, getCoinName(coinSpend.coin), Bytes.from(additionalData, 'hex').raw());
      for (const entry of pairs) {
        const [rawSpk, msg] = entry;
        const spk = bls.G1Element.from_bytes(rawSpk);
        spkList.push(spk);
        msgList.push(msg);

        const rawSyntheticSecretKey = await transactionSigner.secretKeyForPublicKey(spk, this.spkToSk, this.fullnodeEnv.GROUP_ORDER);
        const syntheticSecretKey = bls.PrivateKey.from_bytes(rawSyntheticSecretKey, true);

        if (!syntheticSecretKey) throw new Error(`no secret key for ${spk}`);
        if (!syntheticSecretKey.get_g1().equal_to(spk)) throw new Error('sk incorrect');

        const signature = bls.AugSchemeMPL.sign(syntheticSecretKey, msg);
        if (!bls.AugSchemeMPL.verify(spk, msg, signature)) throw new Error('pk verification failed');

        signatures.push(signature);
      }
    }
    const aggsig = bls.AugSchemeMPL.aggregate(signatures);
    if (!bls.AugSchemeMPL.aggregate_verify(spkList, msgList, aggsig)) throw new Error('Aggregate verification failed');

    return new SpendBundle(coinSpends, to_hexstr(aggsig.serialize()));
  }

  private async generateUnsignedTransaction({
    amount,
    newPh,
    changePh,
    fee,
    coins,
  }: {
    amount: string;
    newPh: string;
    changePh: string;
    fee: string;
    coins: Coin[];
  }): Promise<CoinSpend[]> {
    const totalAmount = new BigNumber(amount).plus(fee);
    const spendAmount = coins.reduce((sum, coin) => sum.plus(coin.amount), new BigNumber(0));
    const change = spendAmount.minus(totalAmount);
    const primaries: Primary[] = [];
    const spends: CoinSpend[] = [];

    let solution: SExp;
    let primaryAnnouncementHash;

    if (change.lt(0)) throw new Error('CHANGE_LESS_ZERO');

    for (const coin of coins) {
      const puzzle: SExp = await this.puzzleForPuzzleHash(coin.puzzle_hash);
      if (!primaryAnnouncementHash) {
        primaries.push({ puzzleHash: newPh, amount: amount.toString() });
        if (change.gt(0)) {
          primaries.push({ puzzleHash: changePh, amount: change.toString() });
        }
        const messagesList = coins.map((coin) => to_hexstr(getCoinName(coin)));
        primaries.forEach((primary) => {
          const newCoin: Coin = { parent_coin_info: to_hexstr(getCoinName(coin)), puzzle_hash: primary.puzzleHash, amount: primary.amount };
          messagesList.push(to_hexstr(getCoinName(newCoin)));
        });
        const message = this.hashMessage(messagesList);
        solution = this.makeSolution({
          primaries,
          fee,
          coinAnnouncements: { message },
        });
        primaryAnnouncementHash = this.hashAnnouncement(to_hexstr(getCoinName(coin)), message);
      } else {
        solution = this.makeSolution({ coinAnnouncementsToAssert: { primaryAnnouncementHash } });
      }

      spends.push({
        coin,
        puzzle_reveal: puzzle,
        solution,
      });
    }

    return spends;
  }

  private async puzzleForPuzzleHash(puzzleHash: string) {
    const publicKey = (await BLS()).G1Element.from_bytes(Buffer.from(await this.phToPk(puzzleHash), 'hex'));
    return transactionSigner.puzzleForPk(publicKey);
  }

  private makeSolution(props: { primaries?: Primary[]; fee?: string; coinAnnouncements?: { [key: string]: string }; coinAnnouncementsToAssert?: { [key: string]: string } }) {
    const conditionList = [];
    if (props.primaries) {
      props.primaries.forEach((primary) => {
        conditionList.push(makeCreateCoinCondition(primary.puzzleHash, BigInt(primary.amount)));
      });
    }

    if (props.fee && BigInt(props.fee) !== 0n) {
      conditionList.push(makeReserveFeeCondition(BigInt(props.fee)));
    }

    if (props.coinAnnouncements) {
      Object.keys(props.coinAnnouncements || {}).forEach((key) => {
        conditionList.push(makeCreateCoinAnnouncement(props.coinAnnouncements[key]));
      });
    }

    if (props.coinAnnouncementsToAssert) {
      Object.keys(props.coinAnnouncementsToAssert || {}).forEach((key) => {
        conditionList.push(makeAssertCoinAnnouncement(props.coinAnnouncementsToAssert[key]));
      });
    }

    return this.solutionForConditions(conditionList);
  }

  private solutionForConditions(conditions) {
    const delegatedPuzzle = transactionSigner.puzzleForConditions(conditions);
    return this.solutionForDelegatedPuzzle(delegatedPuzzle, SExp.to(0));
  }

  private solutionForDelegatedPuzzle(delegatedPuzzle: SExp, solution: SExp): SExp {
    const a = SExp.to([[], delegatedPuzzle, solution]);
    return a;
  }

  private hashMessage(messageList: string[]): string {
    const byteArray = [];
    messageList.forEach((item) => {
      byteArray.push(...Array.from(Bytes.from(item, 'hex').raw()));
    });
    return Bytes.SHA256(new Uint8Array(byteArray)).hex();
  }

  private hashAnnouncement(originInfo: string, message: string): string {
    try {
      return Bytes.SHA256(new Uint8Array([...Bytes.from(originInfo, 'hex').raw(), ...Bytes.from(message, 'hex').raw()])).hex();
    } catch {
      return '';
    }
  }
}

export default TransactionManager;
