import { BlockRecord, Coin, CoinRecord, NetworkInfoResponse, SpendBundlePlain } from '@/types/blockchain';
import { AdditionsAndRemovalsResponse, BlockchainStateResponse, BlockRecordResponse } from '@/types/chia-client/FullNode/RpcResponse';
import FullNodeRequest from './fullnode-request';

declare abstract class FullNodeAbstract {
  public request: FullNodeRequest;
  public prefix: string;

  constructor(request: FullNodeRequest);

  abstract getBlockchainState(): Promise<BlockchainStateResponse>;
  abstract getNetworkInfo(): Promise<NetworkInfoResponse>;
  abstract getAdditionsAndRemovals(hash: string): Promise<AdditionsAndRemovalsResponse>;
  abstract getPuzzleAndSolution(coin_id: string, height: number): Promise<{ coin_solution: { coin: Coin; puzzle_reveal: string; solution: string } }>;
  abstract getBlockRecordByHeight(height: number): Promise<BlockRecordResponse>;
  abstract getBlockRecord(hash: string): Promise<BlockRecordResponse>;
  abstract getBlockRecords(start: number, end: number): Promise<BlockRecord[]>;
  abstract getParentCoinAddressByCoinName(name: string): Promise<string>;
  abstract getCoinRecordByName(name: string): Promise<CoinRecord>;
  abstract getCoinRecordsByNames(names: string[], start?: number, end?: number): Promise<CoinRecord[] | null>;
  abstract getUnspentCoinRecordsByPuzzleHash(puzzle_hash: string): Promise<CoinRecord[]>;
  abstract getUnspentCoinRecordsByPuzzleHashes(puzzle_hashes: string[]): Promise<CoinRecord[]>;
  abstract getSpendableAmountForPuzzleHash(puzzle_hash: string): Promise<string>;
  abstract getSpendableAmountForAddress(address: string): Promise<string>;
  abstract puzzleHashToAddress(puzzle_hash: string): string;
  abstract addressToPuzzleHash(address: string): string;

  abstract remapSpendBundle(spendBundle: SpendBundlePlain): any;
}

export default FullNodeAbstract;
