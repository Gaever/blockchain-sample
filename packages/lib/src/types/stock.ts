import BigNumber from 'bignumber.js';
import { BarData, HistogramData, LineData } from 'lightweight-charts';
import { KeyStorage } from './blockchain';

export const currencies = ['xch', 'ach', 'hdd'] as const;
export type currency = typeof currencies[number];

export type currencyPair = [currency, currency];

export type CurrencyMap<T> = {
  [Cur in currency]?: T;
};

export interface Fee {
  percent?: string;
  fixed?: string;
}

export interface FeeConfig {
  takerFee: Fee;
  makerFee: Fee;
  paybackFee: Fee;
  transactionFee: string;
}

type ExchangeConfigRoot = {
  id?: number;
  cur1: currency;
  cur2: currency;
};
export type ExchangeConfigByCur = {
  addresses: {
    [addressToRate: string]: string;
  };
  fees: FeeConfig;
  orderLifetimeMs: string;
  minInAmountFixed: string;
};

export type ExchangeConfig = {
  [P in currency | keyof ExchangeConfigRoot]?: P extends currency ? ExchangeConfigByCur : P extends keyof ExchangeConfigRoot ? ExchangeConfigRoot[P] : never;
};

export interface AddressConfig extends Pick<ExchangeConfigRoot, 'cur1' | 'cur2'> {
  stockId: ExchangeConfigRoot['id'];
  stockConfig: CurrencyMap<Omit<ExchangeConfigByCur, 'addresses'>>;
  address: string;
  rate: string;
}

export interface Income {
  id?: number;
  tx_id?: string;
  height?: number;
  header_hash?: string;
  created_at?: Date;
  client_puzzle_hash?: string;
  rate_puzzle_hash?: string;
  cur?: currency;
  amount?: string;
  status?: 'new' | 'proceded';
  stock_id?: number;
  rate?: string;
}

export interface Outcome {
  id?: number;
  tx_id?: string;
  height?: number;
  header_hash?: string;
  created_at?: Date;
  amount?: BigNumber;
  transaction_fee?: BigNumber;
  client_puzzle_hash?: string;
  stock_holder_puzzle_hash?: string;
  cur?: currency;
  status?: 'created' | 'payment-pending' | 'payment-before-process' | 'payment-process' | 'done' | 'error';
  deal_id?: number;
  order_id?: number;
  stock_id?: number;
  payback_fee?: BigNumber;
}

export interface Order {
  id?: number;
  stock_id?: number;
  created_at?: Date;
  expires_at?: Date;
  amount?: BigNumber;
  start_amount?: BigNumber;
  rate?: BigNumber;
  is_sell?: boolean;
  cur1?: currency;
  cur2?: currency;
  client_puzzle_hash?: string;
  rate_puzzle_hash?: string;
  status?: 'created' | 'queued' | 'part' | 'expired' | 'expired-done' | 'min-amount-done' | 'done';
  income_id?: number;
}

export interface Deal {
  id?: number;
  created_at: Date;
  seller_puzzle_hash: string;
  buyer_puzzle_hash: string;
  // Puzzle hash соответствующий курсу в корневой валюте
  rate1_puzzle_hash: string;
  // Puzzle hash соответствующий курсу во второстепенной валюте
  rate2_puzzle_hash: string;
  cur1: currency;
  cur2: currency;
  seller_amount_in_cur2: BigNumber;
  buyer_amount_in_cur1: BigNumber;
  rate: BigNumber;
  seller_fee_in_cur2: BigNumber;
  buyer_fee_in_cur1: BigNumber;
  seller_order_id: number;
  buyer_order_id: number;
  taker_order_id?: number;
  status?: 'new' | 'paid-out' | 'error';
  stock_id?: number;
  is_sell?: boolean;
}

export type OrderMap = Map<Order, Order>;
export type Match = {
  affectedOrders: Order[];
  newDeals: Deal[];
};

export interface StockConfig {
  exchangeConfig: ExchangeConfig;
  name: string;
  fromHeight: string;
}
export interface StockConfigRecord {
  id?: number;
  config_tx_id: string;
  transaction_json?: string;
  name?: string;
  cur1?: currency;
  cur2?: currency;
  config_json?: StockConfig;
  status: 'new' | 'moderation' | 'confirmed' | 'error';
}

export const timeBuckets = ['1min', '1h', '1d', '1w'] as const;
export type TimeBucket = typeof timeBuckets[number];

export interface CurSeriesRecord {
  time: Date;
  opening_price: string;
  highest_price: string;
  lowest_price: string;
  closing_price: string;
  volume_1: string;
  volume_2: string;
  diff?: string;
  diff_percent?: string;
}

export interface KeyStorageRecord {
  puzzle_hash: string;
  pk: string;
  sk: string;
  spk: string;
}

export interface MarketDepthItemRow {
  rate: string;
  volume: string;
  aggregatedVolume: string;
  isTop: boolean;
}

export interface MarketDepth {
  items: MarketDepthItemRow[];
  lastDealRate: string;
}

export interface StartupConfig {
  glassConfigs: ExchangeConfig[];
  keyStorages: CurrencyMap<KeyStorage>;
}

export interface IncomesAndOrdersByStocks {
  [stockId: number]: [Order[], Income[]];
}
export interface PlayHookData {
  newIncomes?: Income[];
  newDeals?: Deal[];
  incomesAndOrdersByStocks?: IncomesAndOrdersByStocks;
  affectedOrdersAndDeals?: Match;
}

export interface TransactionJson {
  url: string;
}

export type service = 'collect' | 'match' | 'payout' | 'mock-collect';

export type websocketEvent = 'subscribe-stock' | 'app-data' | 'subscribe-stock-list' | 'stock-list';

export const eventsDict: { [P in websocketEvent]: websocketEvent } = {
  'subscribe-stock': 'subscribe-stock',
  'subscribe-stock-list': 'subscribe-stock-list',
  'stock-list': 'stock-list',
  'app-data': 'app-data',
};

export interface StockListItem {
  id: number;
  title: string;
  cur1: currency;
  cur2: currency;
  volume1?: string;
  volume2?: string;
  diff?: string;
  diffPercent?: string;
  rate?: string;
  chartData?: LineData[];
  mojosInCur1Coin?: string;
  mojosInCur2Coin?: string;
}

export interface ListenStockReq {
  stockId: string;
  timeBucket: TimeBucket;
  timezoneOffset: number;
  flip?: boolean;
}

export interface StockChartData {
  candles: BarData[];
  volume: HistogramData[];
  marketDepth: MarketDepthItemRow[];
  lastDealRate: string;
  pricePrecision: number;
}

export interface CurSeriesElements {
  minutes?: CurSeriesRecord[] | null;
  hours?: CurSeriesRecord[] | null;
  days?: CurSeriesRecord[] | null;
  weeks?: CurSeriesRecord[] | null;
}

export type TimeArray = Deal[][] | Order[][];
