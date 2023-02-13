import { log } from '@ctocker/lib/build/main/src/log';
import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { flipRate } from '@ctocker/lib/build/main/src/services/lookup/matcher';
import { currency, CurSeriesRecord, Order, StockChartData, TimeBucket } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import { ordersToAggregatedMarketDepth } from './aggregated-market-depth';
import { chooseDisplayingLastDealRate } from './choose-displaying-last-deal-rate';
import { createTimeline } from './timeline';

export function mapChartData({
  intervalRecords,
  timeBucket,
  orders,
  timezoneOffset = 0,
  flip = false,
  rootCur,
  mojosInRootCurCoin,
  mojosInMinorCurCoin,
  now,
  lastRecordBeforeInterval,
  lastDealRate,
}: {
  intervalRecords: CurSeriesRecord[];
  lastRecordBeforeInterval: CurSeriesRecord;
  timeBucket: TimeBucket;
  orders: Order[];
  timezoneOffset: number;
  flip: boolean;
  rootCur: currency;
  mojosInRootCurCoin: BigNumber;
  mojosInMinorCurCoin: BigNumber;
  now: Date;
  lastDealRate: string | undefined | null;
}): StockChartData {
  log.debug('mapChartData start');
  log.debug(
    'flip: %s; timeBucket %s; timezoneOffset %s; rootCur %s; now %s; prevIntervalLastRecord %s; lastDealRate %s; orders length %s',
    flip,
    timeBucket,
    timezoneOffset,
    rootCur,
    now,
    lastRecordBeforeInterval,
    lastDealRate,
    orders.length,
  );

  const {
    marketDepth,
    minSellRate,
    maxBuyRate,
    maxRatePrecision: marketDepthPricePrecision,
  } = ordersToAggregatedMarketDepth(orders, rootCur, mojosInRootCurCoin, mojosInMinorCurCoin, flip);

  // Цена сделки последней, отображаемая в стакане (в том числе если сделок не было)
  let displayingLastDealRate = chooseDisplayingLastDealRate(marketDepth.length, minSellRate, maxBuyRate, lastDealRate);
  if (flip) displayingLastDealRate = flipRate(new BigNumber(displayingLastDealRate)).toString();
  log.debug('displayingLastDealRate %s', displayingLastDealRate);
  log.debug('pricePrecision %s', marketDepthPricePrecision);

  // На временном ряду цена последней сделки всегда будет 1 если сделок не было.
  // Если сделок не было, цена, отображаемая в стакане, может отличаться от последней цены на временном ряду.
  const { candles, volume, candlesPricePrecision } = createTimeline({
    intervalRecords,
    lastRecordBeforeInterval,
    timeBucket,
    timezoneOffset,
    mojosInRootCurCoin,
    mojosInMinorCurCoin,
    lastDealRate,
    now,
    flip,
  });
  log.debug('candlesPricePrecision %s', candlesPricePrecision);

  const pricePrecision = Math.max(marketDepthPricePrecision, candlesPricePrecision);

  const chartData: StockChartData = {
    candles,
    volume,
    marketDepth,
    lastDealRate: displayingLastDealRate,
    pricePrecision,
  };

  log.debug('chartData.pricePrecision %s; chartData.lastDealRate %s', chartData.pricePrecision, chartData.lastDealRate);
  log.debug('mapChartData end');
  return chartData;
}

export default async function fetchChartData(
  stockId: string,
  timeBucket: TimeBucket,
  timezoneOffset: number = 0,
  flip: boolean = false,
): Promise<StockChartData> {
  const exchangeConfig = (await stockConfigModel.getConfig(+stockId))?.config_json?.exchangeConfig;
  const [intervalRecords, orders, lastDealRate] = await Promise.all([
    curSeriesModel.getSeries(stockId, timeBucket),
    ordersModel.getMarketDepth(+stockId),
    curSeriesModel.getLastDealPrice(stockId),
  ]);

  const lastRecordBeforeInterval = await curSeriesModel.getLastRecordLaterDate(stockId, intervalRecords?.[0]?.time, timeBucket);

  const cur1 = exchangeConfig.cur1;
  const cur2 = exchangeConfig.cur2;

  const mojosInRootCurCoin = new BigNumber(fullnodeEnviroment[cur1].MOJO_IN_COIN);
  const mojosInMinorCurCoin = new BigNumber(fullnodeEnviroment[cur2].MOJO_IN_COIN);

  return mapChartData({
    intervalRecords,
    timeBucket,
    orders,
    timezoneOffset,
    flip,
    rootCur: cur1,
    mojosInRootCurCoin,
    mojosInMinorCurCoin,
    now: new Date(),
    lastRecordBeforeInterval,
    lastDealRate,
  });
}
