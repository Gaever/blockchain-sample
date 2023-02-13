import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { mojosToCoins, significantDigitsLimit } from '@ctocker/lib/build/main/src/services/lookup/matcher';
import { StockListItem } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import { createMinichartTimeline } from './chart-data/timeline';

export default async function fetchStockList(): Promise<StockListItem[]> {
  const stocks = await stockConfigModel.getStockList();

  const items: StockListItem[] = [];
  for (const stock of stocks) {
    const stockId = String(stock.id);
    const [lastDay, lastDayChart] = await Promise.all([curSeriesModel.getLastDayRow(stockId), curSeriesModel.getLastDayChart(stockId)]);

    const lastRecordBeforeInterval = await curSeriesModel.getLastRecordLaterDate(stockId, lastDay?.[0]?.time, '1d');

    const mojosInRootCurCoin = new BigNumber(fullnodeEnviroment[stock.cur1].MOJO_IN_COIN);
    const mojosInMinorCurCoin = new BigNumber(fullnodeEnviroment[stock.cur2].MOJO_IN_COIN);

    const lastPrice = lastDay?.closing_price;
    const lastDayTimeline = createMinichartTimeline({
      lastDealRate: lastPrice,
      lastRecordBeforeInterval,
      intervalRecords: lastDayChart,
      timezoneOffset: 0,
      mojosInRootCurCoin,
      mojosInMinorCurCoin,
    });

    const volume1InRootCurCoins = mojosToCoins(new BigNumber(lastDay?.volume_1 || 0), mojosInRootCurCoin)
      .sd(significantDigitsLimit)
      .toFormat();
    const volume2InMinorCurCoins = mojosToCoins(new BigNumber(lastDay?.volume_2 || 0), mojosInMinorCurCoin)
      .sd(significantDigitsLimit)
      .toFormat();

    items.push({
      id: +stock.id!,
      title: stock.name || '',
      cur1: stock.cur1!,
      cur2: stock.cur2!,
      rate: lastPrice,
      volume1: volume1InRootCurCoins,
      volume2: volume2InMinorCurCoins,
      diff: lastDay?.diff,
      diffPercent: +lastDay?.diff < 0 ? `-${lastDay?.diff_percent}` : lastDay?.diff_percent,
      chartData: lastDayTimeline,
    });
  }

  return items.sort((a, b) => a.id - b.id);
}
