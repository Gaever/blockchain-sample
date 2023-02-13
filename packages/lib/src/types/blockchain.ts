import { Bytes, SExp } from 'clvm';
import { RpcResponse } from './chia-client/RpcResponse';
import { CoinRecord } from './fullnode';
import { currency } from './stock';

export { Block, BlockchainState, BlockRecord } from './fullnode';
export { CoinRecord };

export interface PuzzleAndSolutionResponse extends RpcResponse {
  coin_solution: {
    coin: Coin;
  };
  puzzle_reveal: string;
  solution: string;
}

export interface BlockchainConfig {
  cur: currency;
  last_known_height: number;
  service_start_height: number;
}

export interface BcWalk {
  inTxs: TxRecord[];
  outTxs: TxRecord[];
  changeTxs: TxRecord[];
  configTxs: StockConfigTxRecord[];
  testCoinInTx?: TxRecord;
  confirmedRemovals: TxRecord[];
  lastHeight: number;
}

export interface SpendBundle {
  coin_spends: CoinSpend[];
  aggregated_signature: string;
}

export interface SpendBundlePlain {
  coin_spends: CoinSpendPlain[];
  aggregated_signature: string;
}

export interface Coin {
  amount: string;
  parent_coin_info: string;
  puzzle_hash: string;
}

export interface Transaction {
  additions: Coin[];
  amount: number;
  confirmed: boolean;
  confirmed_at_height: number;
  created_at_time: number;
  fee_amount: number;
  name: string;
  removals: Coin[];
  sent: number;
  sent_to: Coin[];
  spend_bundle?: SpendBundle;
  to_address: string;
  to_puzzle_hash: string;
  from_address?: string;
  trade_id?: string | number;
  type: number;
  wallet_id: number;
  cur: currency;
  confirmed_at_block?: string;
}

export interface TxRecord {
  txId: string;
  headerHash: string;
  coinRecord: CoinRecord;
  fromPuzzleHash: string;
  toPuzzleHash: string;
  height: number;
  createdAtTime: number;
  cur: currency;
  stock_id?: number;
  rate?: string;
}

export interface StockConfigTxRecord extends TxRecord {
  json: string;
}

export interface FullnodeEnv {
  currency: currency;
  FULLNODE_URI: string;
  SSL_CERT_PATH: string;
  STOCK_HOLDER_ADDRESS?: string;
  SSL_CA_CERT_PATH?: string;
  SSL_KEY_PATH: string;
  AGG_SIG_ME_ADDITIONAL_DATA: string;
  GROUP_ORDER: string;
  MAX_BLOCK_COST_CLVM: number;
  STOCK_CONFIG_ADDRESS?: string;
  KEY_STORAGE_PATH?: string;
  MOJO_IN_COIN?: number;
  SKIP_COIN_PATTERN?: string[];
  GENESIS_CHALLENGE: string;
  TEST_ADDRESS_TO?: string;
  TEST_ADDRESS_FROM?: string;
  TEST_ADDRESS_FROM_PK?: string;
  TEST_ADDRESS_FROM_SK?: string;
  TEST_ADDRESS_TO_PK?: string;
  TEST_ADDRESS_TO_SK?: string;
}

export interface TransactionRecord {
  confirmed_at_height: number;
  created_at_time: number;
  to_puzzle_hash: string;
  amount: string;
  fee_amount: string;
  confirmed: boolean;
  sent: number;
  spend_bundle: SpendBundlePlain;
  additions: Coin[];
  removals: Coin[];
  wallet_id: number;
  sent_to?: any;
  trade_id?: number;
  type: number;
  name: string;
  change_tx_id?: string;
  payout_tx_id: string;
}

export interface CoinSpend {
  coin: Coin;
  puzzle_reveal: SExp;
  solution: SExp;
}

export interface CoinSpendPlain {
  coin: Coin;
  puzzle_reveal: string;
  solution: string;
}

export interface ConditionWithArgs {
  opcode: number;
  vars: Bytes[];
}

export interface KeyStorage {
  [puzzleHash: string]: {
    sk: string;
    pk: string;
  };
}

export interface HeightToUpdate {
  cur: currency;
  height: number;
}

export interface SpendBundlePlainAch extends Omit<SpendBundlePlain, 'coin_spends'> {
  coin_solutions: CoinSpendPlain[];
}

export interface FrozenCoinRecord {
  expires_at: Date;
  coin_name: string;
}

export type coinName = string;

export type puzzleHash = string;

export type FrozenCoins = { [coinName: string]: FrozenCoinRecord };

export type CoinMap = Map<puzzleHash, Coin[]>;

export type NetworkInfoResponse = { network_name: string; network_prefix: string; success: boolean };
