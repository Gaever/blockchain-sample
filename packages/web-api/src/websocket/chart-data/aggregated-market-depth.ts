import { flipRate, mojo1ToMojo2, mojosToCoins, precisionLimit } from '@ctocker/lib/build/main/src/services/lookup/matcher';
import { currency, MarketDepthItemRow, Order } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import _first from 'lodash/first';
import _last from 'lodash/last';
import _partition from 'lodash/partition';

function sellOrderToAggregatedItem(
  order: Order,
  volume: BigNumber,
  aggregatedVolume: BigNumber,
  mojosInRootCur: BigNumber,
  mojosInMinorCur: BigNumber,
  flip: boolean,
): MarketDepthItemRow {
  let rate: BigNumber;
  let orderAmountInCoins: BigNumber;

  if (flip) {
    rate = flipRate(order.rate);
    const orderAmountInMinorCurMojo = order.amount;
    const amountInRootCurCoins = mojosToCoins(
      mojo1ToMojo2(orderAmountInMinorCurMojo, mojosInMinorCur, mojosInRootCur).multipliedBy(rate).integerValue(BigNumber.ROUND_FLOOR),
      mojosInRootCur,
    );
    orderAmountInCoins = amountInRootCurCoins;
  } else {
    rate = order.rate;
    const orderAmountInRootCurMojo = order.amount;
    const amountInMinorCurCoins = mojosToCoins(
      mojo1ToMojo2(orderAmountInRootCurMojo, mojosInRootCur, mojosInMinorCur).multipliedBy(rate).integerValue(BigNumber.ROUND_FLOOR),
      mojosInMinorCur,
    );
    orderAmountInCoins = amountInMinorCurCoins;
  }

  return {
    isTop: true,
    volume: volume.plus(orderAmountInCoins).toString(),
    aggregatedVolume: aggregatedVolume.plus(orderAmountInCoins).toString(),
    rate: rate.toString(),
  };
}

function buyOrderToAggregatedItem(
  order: Order,
  volume: BigNumber,
  aggregatedVolume: BigNumber,
  mojosInRootCur: BigNumber,
  mojosInMinorCur: BigNumber,
  flip: boolean,
): MarketDepthItemRow {
  let rate: BigNumber;
  let orderAmountInCoins: BigNumber;

  if (flip) {
    const orderAmountInRootCurMojo = order.amount;
    rate = flipRate(order.rate);
    const amountInRootCurCoins = mojosToCoins(orderAmountInRootCurMojo.multipliedBy(rate).integerValue(BigNumber.ROUND_FLOOR), mojosInRootCur);
    orderAmountInCoins = amountInRootCurCoins;
  } else {
    const orderAmountInMinorCurMojo = order.amount;
    rate = order.rate;
    const amountInMinorCurCoins = mojosToCoins(orderAmountInMinorCurMojo, mojosInMinorCur);
    orderAmountInCoins = amountInMinorCurCoins;
  }

  return {
    isTop: false,
    volume: volume.plus(orderAmountInCoins).toString(),
    aggregatedVolume: aggregatedVolume.plus(orderAmountInCoins).toString(),
    rate: rate.toString(),
  };
}

export function getMaxRatePresicion(prevMaxRatePrecision: number, ...rates: (string | undefined)[]) {
  return Math.max(prevMaxRatePrecision, ...rates.map(rate => (rate || '0').split('.')?.[1]?.length || 0));
}

export function ordersToAggregatedMarketDepth(
  orders: Order[],
  rootCur: currency,
  mojosInRootCur: BigNumber,
  mojosInMinorCur: BigNumber,
  flip: boolean = false,
): {
  marketDepth: MarketDepthItemRow[];
  maxRatePrecision: number;
  minSellRate: string | undefined;
  maxBuyRate: string | undefined;
} {
  let sellOrders: Order[];
  let buyOrders: Order[];
  let maxRatePrecision = 1;

  if (flip) {
    const [sell, buy] = _partition(orders, order => order.cur1 === rootCur);
    sellOrders = buy;
    buyOrders = sell;
    buyOrders.reverse();
    sellOrders.reverse();
  } else {
    const [sell, buy] = _partition(orders, order => order.cur1 === rootCur);
    sellOrders = sell;
    buyOrders = buy;
  }

  const sell: MarketDepthItemRow[] = [];
  const buy: MarketDepthItemRow[] = [];

  if (sellOrders.length > 0) {
    sell.push(sellOrderToAggregatedItem(_last(sellOrders), new BigNumber(0), new BigNumber(0), mojosInRootCur, mojosInMinorCur, flip));
  }

  if (buyOrders.length > 0) {
    buy.push(buyOrderToAggregatedItem(_first(buyOrders), new BigNumber(0), new BigNumber(0), mojosInRootCur, mojosInMinorCur, flip));
  }

  maxRatePrecision = getMaxRatePresicion(maxRatePrecision, _last(sell)?.rate, _last(buy)?.rate);

  for (let i = sellOrders.length - 2; i >= 0; i--) {
    const order = sellOrders[i];
    const lastSell = _last(sell);

    if (sellOrders[i + 1].rate.eq(order.rate)) {
      const aggregatedItem = sellOrderToAggregatedItem(
        order,
        new BigNumber(lastSell.volume),
        new BigNumber(lastSell.aggregatedVolume),
        mojosInRootCur,
        mojosInMinorCur,
        flip,
      );

      lastSell.volume = aggregatedItem.volume;
      lastSell.aggregatedVolume = aggregatedItem.aggregatedVolume;
    } else {
      const aggregatedItem = sellOrderToAggregatedItem(
        order,
        new BigNumber(0),
        new BigNumber(lastSell.aggregatedVolume),
        mojosInRootCur,
        mojosInMinorCur,
        flip,
      );

      sell.push(aggregatedItem);
    }
    maxRatePrecision = getMaxRatePresicion(maxRatePrecision, _last(sell)?.rate);
  }

  for (let i = 1; i < buyOrders.length; i++) {
    const order = buyOrders[i];
    const lastBuy = _last(buy);

    if (buyOrders[i - 1].rate.eq(order.rate)) {
      const aggregatedItem = buyOrderToAggregatedItem(
        order,
        new BigNumber(lastBuy.volume),
        new BigNumber(lastBuy.aggregatedVolume),
        mojosInRootCur,
        mojosInMinorCur,
        flip,
      );

      lastBuy.volume = aggregatedItem.volume;
      lastBuy.aggregatedVolume = aggregatedItem.aggregatedVolume;
    } else {
      const aggregatedItem = buyOrderToAggregatedItem(
        order,
        new BigNumber(0),
        new BigNumber(lastBuy.aggregatedVolume),
        mojosInRootCur,
        mojosInMinorCur,
        flip,
      );

      buy.push(aggregatedItem);
    }
    maxRatePrecision = getMaxRatePresicion(maxRatePrecision, _last(buy)?.rate);
  }

  sell.reverse();

  if (maxRatePrecision > precisionLimit) maxRatePrecision = precisionLimit;

  return {
    marketDepth: [...sell, ...buy],
    minSellRate: _last(sell)?.rate,
    maxBuyRate: _first(buy)?.rate,
    maxRatePrecision,
  };
}
