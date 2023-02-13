import { Coin, NetworkInfoResponse, SpendBundlePlain } from '@/types/blockchain';
import { AdditionsAndRemovalsResponse, BlockchainStateResponse, BlockRecordResponse } from '@/types/chia-client/FullNode/RpcResponse';
import { BlockRecord, CoinRecord } from '@/types/fullnode';
import { addressToPuzzleHash, puzzleHashToAddress } from '@/utils';
import FullNodeAbstract from './fullnode-abstract';
import FullNodeRequest from './fullnode-request';

class FullNodeChiaLike implements FullNodeAbstract {
  public request: FullNodeRequest;
  public prefix: string;

  constructor(request: FullNodeRequest, prefix: string) {
    this.request = request;
    this.prefix = prefix;
  }

  puzzleHashToAddress(puzzle_hash: string): string {
    return puzzleHashToAddress(puzzle_hash, this.prefix);
  }

  addressToPuzzleHash(address: string): string {
    return addressToPuzzleHash(address);
  }

  async getNetworkInfo(): Promise<NetworkInfoResponse> {
    return this.request.http('get_network_info', {});
  }

  async getBlockchainState(): Promise<BlockchainStateResponse> {
    return this.request.http('get_blockchain_state', {});
  }

  async getAdditionsAndRemovals(hash: string): Promise<AdditionsAndRemovalsResponse> {
    return this.request.http('get_additions_and_removals', {
      header_hash: hash,
    });
  }

  async getPuzzleAndSolution(coin_id: string, height: number): Promise<{ coin_solution: { coin: Coin; puzzle_reveal: string; solution: string } }> {
    return this.request.http('get_puzzle_and_solution', {
      coin_id,
      height,
    });
  }

  async getBlockRecordByHeight(height: number): Promise<BlockRecordResponse> {
    return this.request.http('get_block_record_by_height', {
      height,
    });
  }

  async getBlockRecords(start: number, end: number): Promise<BlockRecord[]> {
    return (
      await this.request.http('get_block_records', {
        start,
        end,
      })
    )?.block_records;
  }

  async getBlockRecord(hash: string): Promise<BlockRecordResponse> {
    return this.request.http('get_block_record', {
      header_hash: hash,
    });
  }

  async getParentCoinAddressByCoinName(name: string): Promise<string> {
    const parentCoin = await this.getCoinRecordByName(name);
    if (!parentCoin?.coin?.puzzle_hash) return '';
    return puzzleHashToAddress(parentCoin.coin.puzzle_hash, this.prefix);
  }

  async getCoinRecordByName(name: string): Promise<CoinRecord | null> {
    if (!name) return null;

    const response = await this.request.http('get_coin_record_by_name', {
      name,
    });

    return response.coin_record;
  }

  async getCoinRecordsByNames(names: string[], start: number = null, end: number = null): Promise<CoinRecord[] | null> {
    if (!names || !names.length) return null;

    const response = await this.request.http('get_coin_records_by_names', {
      names,
      start_height: start,
      end_height: end,
      include_spent_coins: true,
    });

    return response.coin_record;
  }

  async getUnspentCoinRecordsByPuzzleHash(puzzle_hash: string): Promise<CoinRecord[]> {
    const response = (await this.request.http('get_coin_records_by_puzzle_hash', { puzzle_hash, include_spent_coins: true }))?.coin_records as CoinRecord[];
    return response?.filter((item) => !item.spent);
  }

  async getUnspentCoinRecordsByPuzzleHashes(puzzle_hashes: string[]): Promise<CoinRecord[]> {
    const response = (await this.request.http('get_coin_records_by_puzzle_hashes', { puzzle_hashes, include_spent_coins: true }))?.coin_records as CoinRecord[];
    return response?.filter((item) => !item.spent);
  }

  async getSpendableAmountForPuzzleHash(puzzle_hash: string): Promise<string> {
    const coinRecords = await this.getUnspentCoinRecordsByPuzzleHash(puzzle_hash);
    return String(coinRecords?.reduce?.((sum, v) => sum + BigInt(v.coin.amount), 0n)) || '';
  }

  async getSpendableAmountForAddress(address: string): Promise<string> {
    const ph = this.addressToPuzzleHash(address);
    return this.getSpendableAmountForPuzzleHash(ph);
  }

  remapSpendBundle(spendBundle: SpendBundlePlain): any {
    return spendBundle;
  }
}

export default FullNodeChiaLike;
