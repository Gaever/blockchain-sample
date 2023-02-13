import { Coin, CoinSpend, SpendBundlePlain } from '@/types/blockchain';
import { Bytes, SExp, to_hexstr } from 'clvm';
import { sha256 } from 'js-sha256';
import { getCoinName } from './puzzle-utils';
import transactionSigner from './transaction-signer';

const INFINITE_COST = 0x7fffffffffffffff;

class SpendBundle {
  public coin_spends: CoinSpend[];
  public aggregated_signature: string;

  constructor(coin_spends: CoinSpend[], aggregated_signature: string) {
    this.coin_spends = coin_spends;
    this.aggregated_signature = aggregated_signature;
  }

  public additions(): Coin[] {
    const items: Coin[] = [];
    this.coin_spends.forEach((coinSpend) => {
      items.push(...this.additionsForSolution(to_hexstr(getCoinName(coinSpend.coin)), coinSpend.puzzle_reveal, coinSpend.solution, INFINITE_COST));
    });
    return items;
  }

  public removals(): Coin[] {
    return this.coin_spends.map((item) => item.coin);
  }

  public name() {
    const byteArray = [];
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setInt32(0, this.coin_spends.length, false);

    byteArray.push(...Array.from(new Uint8Array(buffer)));
    this.coin_spends.forEach((coinSpend) => {
      const amountBuffer = new ArrayBuffer(8);
      new DataView(amountBuffer).setBigInt64(0, BigInt(coinSpend.coin.amount), false);

      byteArray.push(
        ...Array.from(Bytes.from(coinSpend.coin.parent_coin_info, 'hex').raw()),
        ...Array.from(Bytes.from(coinSpend.coin.puzzle_hash, 'hex').raw()),
        ...Array.from(new Uint8Array(amountBuffer)),
        ...Array.from(Bytes.from(coinSpend.puzzle_reveal.as_bin()).raw()),
        ...Array.from(Bytes.from(coinSpend.solution.as_bin()).raw())
      );
    });
    byteArray.push(...Array.from(Bytes.from(this.aggregated_signature, 'hex').raw()));
    return `0x${sha256(Uint8Array.from(byteArray))}`;
  }

  private additionsForSolution(coinName: string, puzzleReveal: SExp, solution: SExp, maxCost: number): Coin[] {
    const [err, dic] = transactionSigner.conditionsDictForSolution(puzzleReveal, solution, maxCost);
    if (err || !dic) return [];
    return transactionSigner.createdOutputsForConditionsDict(dic, coinName);
  }

  public raw(): SpendBundlePlain {
    return {
      aggregated_signature: `0x${this.aggregated_signature}`,
      coin_spends: this.coin_spends.map((spend) => ({
        ...spend,
        puzzle_reveal: `0x${spend.puzzle_reveal.toString()}`,
        solution: `0x${spend.solution.toString()}`,
      })),
    };
  }
}

export default SpendBundle;
