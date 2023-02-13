import { currency, TimeBucket } from "@ctocker/lib/build/main/src/types/stock";

export interface Layout {
  width: number;
  height: number;
}

export interface PersistedStateItem {
  timeBucket?: TimeBucket;
  flipped?: boolean;
  pricePrecision?: number;
  volumePrecision?: number;
  groupStep?: number;
}

export interface PersistedState {
  [stockId: string]: PersistedStateItem;
}

export interface ExchangeCalcResult {
  minSendAmountInSendCurCoins: string;

  payoutBlockchainFeeInTargetCurCoins: string;

  payoutAmountInTargetCurMojos: string;
  payoutAmountInTargetCurCoins: string;

  makerStockFeeInPercent: number;
  makerStockFeeInTargetCurCoins: string;
  makerPayoutInTargetCurCoins: string;

  takerStockFeeInPercent: number;
  takerStockFeeInTargetCurCoins: string;
  takerPayoutInTargetCurCoins: string;

  refundBlockchainFeeInSendCurCoins: string;
  refundStockFeeInInPercent: number;
  refundStockFeeInSendCurCoins: string;
  refundAmountInSendCurInCoins: string;

  expiresIn: string;

  sendCur: currency;
  targetCur: currency;
  mojosInSendCurCoin: string;
}
