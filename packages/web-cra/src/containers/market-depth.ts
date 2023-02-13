import { MarketDepthItemRow } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import _last from 'lodash/last';
import _partition from 'lodash/partition';

function createEmptyRows(rates: string[], fringeIndex: number, isTop: boolean, aggregatedVolume: string, limit: number) {
  const items: MarketDepthItemRow[] = [];

  if (limit <= 0) return items;

  if (isTop) {
    for (let i = fringeIndex - 1; i >= 0; i--) {
      items.push({
        rate: rates[i],
        volume: '0',
        aggregatedVolume,
        isTop: true,
      });
      if (items.length >= limit) break;
    }
    items.reverse();
  } else {
    for (let i = fringeIndex; i < rates.length; i++) {
      items.push({
        rate: rates[i],
        volume: '0',
        aggregatedVolume,
        isTop: false,
      });
      if (items.length >= limit) break;
    }
  }

  return items;
}

function findFringeIndex(rates: string[], price: BigNumber): number {
  let fringeIndex = rates.findIndex((rate) => new BigNumber(rate).lte(price));
  fringeIndex = fringeIndex < 0 ? rates.length : fringeIndex;

  return fringeIndex;
}

function nextFringeIndex(fringeIndex): number {
  return fringeIndex + 1;
}

export function findRangeUp(fromIndex: number, rates: string[], rate: string) {
  let topRate;
  let bottomRate;
  let lastIndex;

  const rateBn = new BigNumber(rate);

  // rates.length always >= 2
  if (rates[0] === rate) {
    return [new BigNumber(rates[0]), new BigNumber(rates[1]), 0];
  }

  for (let i = fromIndex; i >= 0; i--) {
    const current = new BigNumber(rates[i]);
    lastIndex = i;

    if (rateBn.gte(current)) {
      bottomRate = current;
    }
    if (rateBn.lt(current)) {
      topRate = current;
      break;
    }
  }

  if (!topRate) topRate = new BigNumber(rates[0]);

  return [topRate, bottomRate, lastIndex];
}

export function findRangeDown(fromIndex: number, rates: string[], rate: string) {
  let topRate;
  let bottomRate;
  let lastIndex;
  const rateBn = new BigNumber(rate);

  // rates.length always >= 2
  if (_last(rates) === rate) {
    return [new BigNumber(rates[rates.length - 2]), new BigNumber(rates[rates.length - 1]), rates.length - 1];
  }

  for (let i = fromIndex; i < rates.length; i++) {
    const current = new BigNumber(rates[i]);
    lastIndex = i;

    if (rateBn.lte(current)) {
      topRate = current;
    }
    if (rateBn.gt(current)) {
      bottomRate = current;
      break;
    }
  }

  // @ts-ignore
  if (!bottomRate) bottomRate = new BigNumber(_last(rates));

  return [topRate, bottomRate, lastIndex];
}

function aggregateTopOrders(orders: MarketDepthItemRow[], rates: string[]): MarketDepthItemRow[] {
  const out: MarketDepthItemRow[] = [];

  let fromIndex = 0;
  let topRate = new BigNumber(Infinity);
  let bottomRate = new BigNumber(Infinity);
  let current: MarketDepthItemRow;

  for (let i = 0; i < orders.length; i++) {
    const currentOrder = orders[i];
    const orderRate = new BigNumber(currentOrder.rate);

    if (orderRate.lte(topRate) && orderRate.gt(bottomRate)) {
      // @ts-ignore
      current.volume = new BigNumber(current.volume).plus(new BigNumber(currentOrder.volume)).toString();
    } else {
      // @ts-ignore
      if (current) out.push(current);
      current = _cloneDeep(currentOrder);

      const [newTopRate, newBottomRate, newFromIndex] = findRangeDown(fromIndex, rates, current.rate);

      topRate = newTopRate;
      bottomRate = newBottomRate;
      fromIndex = newFromIndex;
    }
  }
  // @ts-ignore
  if (current) out.push(current);

  return out;
}

function aggregateBottomOrders(orders: MarketDepthItemRow[], rates: string[]): MarketDepthItemRow[] {
  const out: MarketDepthItemRow[] = [];

  let fromIndex = rates.length - 1;
  let topRate = new BigNumber(0);
  let bottomRate = new BigNumber(0);
  let current: MarketDepthItemRow;

  for (let i = orders.length - 1; i >= 0; i--) {
    const currentOrder = orders[i];
    const orderRate = new BigNumber(currentOrder.rate);

    if (orderRate.gte(bottomRate) && orderRate.lt(topRate)) {
      // @ts-ignore
      current.volume = new BigNumber(current.volume).plus(new BigNumber(currentOrder.volume)).toString();
    } else {
      // @ts-ignore
      if (current) out.push(current);
      current = _cloneDeep(currentOrder);

      const [newTopRate, newBottomRate, newFromIndex] = findRangeUp(fromIndex, rates, current.rate);

      topRate = newTopRate;
      bottomRate = newBottomRate;
      fromIndex = newFromIndex;
    }
  }

  // @ts-ignore
  if (current) out.push(current);

  return out.reverse();
}

export function getVisibleMarketDepthRows(
  orders: MarketDepthItemRow[],
  rates: string[],
  lastPrice: string,
  zoomFactor: number,
  visibleRowsPerHalf: number,
  scrollOffsetTop: number = 0,
  scrollOffsetBottom: number = 0
): [MarketDepthItemRow[], MarketDepthItemRow[], number, number] {
  const lastPriceBn = new BigNumber(lastPrice || '1');

  let top: MarketDepthItemRow[] = [];
  let bottom: MarketDepthItemRow[] = [];

  const zoomedRates = rates.filter((_item, index) => index % zoomFactor === 0 || index === rates.length - 1);

  // В стакане есть ордера
  const [topOrders, bottomOrders] = _partition(orders, (order) => order.isTop);

  const aggregatedTopOrders = aggregateTopOrders(topOrders, zoomedRates);
  const aggregatedBottomOrders = aggregateBottomOrders(bottomOrders, zoomedRates);

  let targetScrollOffsetTop = scrollOffsetTop;
  if (targetScrollOffsetTop > aggregatedTopOrders.length - 1) targetScrollOffsetTop = aggregatedTopOrders.length - 1;
  let targetScrollOffsetBottom = scrollOffsetBottom;
  if (targetScrollOffsetBottom > aggregatedBottomOrders.length - 1) targetScrollOffsetBottom = aggregatedBottomOrders.length - 1;

  const slicedTopOrders = aggregatedTopOrders.slice(-(targetScrollOffsetTop + visibleRowsPerHalf), aggregatedTopOrders.length - targetScrollOffsetTop);
  const slicedBottomOrders = aggregatedBottomOrders.slice(targetScrollOffsetBottom, visibleRowsPerHalf + targetScrollOffsetBottom);

  let emptyTopRows: MarketDepthItemRow[] = [];
  let emptyBottomRows: MarketDepthItemRow[] = [];

  if (slicedTopOrders.length > 0) {
    // Есть ордера на продажу

    const fringeIndex1 = findFringeIndex(zoomedRates, new BigNumber(slicedTopOrders[0].rate));
    // @ts-ignore
    let fringeIndex2 = findFringeIndex(zoomedRates, new BigNumber(_last(slicedTopOrders).rate));

    if (slicedBottomOrders.length > 0) {
      // Есть ордера на покупку

      // @ts-ignore
      fringeIndex2 = findFringeIndex(zoomedRates, new BigNumber(_last(slicedBottomOrders).rate));
    }

    // @ts-ignore
    if (slicedBottomOrders.length <= 0 || new BigNumber(_last(slicedBottomOrders).rate).lte(zoomedRates[fringeIndex2])) {
      // Заполним нижний стакан пустыми строками, начиная со следующего адреса после самого нижнего ордера

      fringeIndex2 = nextFringeIndex(fringeIndex2);
    }

    emptyTopRows = createEmptyRows(zoomedRates, fringeIndex1, true, slicedTopOrders[0].aggregatedVolume, visibleRowsPerHalf - slicedTopOrders.length);
    emptyBottomRows = createEmptyRows(zoomedRates, fringeIndex2, false, _last(slicedBottomOrders)?.aggregatedVolume || '0', visibleRowsPerHalf - slicedBottomOrders.length);
  } else if (slicedBottomOrders.length > 0) {
    const fringeIndex1 = findFringeIndex(zoomedRates, new BigNumber(slicedBottomOrders[0].rate));
    // @ts-ignore
    const fringeIndex2 = findFringeIndex(zoomedRates, new BigNumber(_last(slicedBottomOrders).rate));

    emptyTopRows = createEmptyRows(zoomedRates, fringeIndex1, true, '0', visibleRowsPerHalf - slicedTopOrders.length);
    emptyBottomRows = createEmptyRows(
      zoomedRates,
      nextFringeIndex(fringeIndex2),
      false,
      // @ts-ignore
      _last(slicedBottomOrders)?.aggregatedVolume,
      visibleRowsPerHalf - slicedBottomOrders.length
    );
  } else {
    // Ордеров нет, все заполняем пустыми строками
    const fringeIndex = findFringeIndex(zoomedRates, lastPriceBn);

    emptyTopRows = createEmptyRows(zoomedRates, fringeIndex, true, '0', visibleRowsPerHalf - slicedTopOrders.length);
    emptyBottomRows = createEmptyRows(zoomedRates, fringeIndex, false, '0', visibleRowsPerHalf - slicedBottomOrders.length);
  }

  top = [...emptyTopRows, ...slicedTopOrders];
  bottom = [...slicedBottomOrders, ...emptyBottomRows];

  return [top, bottom, targetScrollOffsetTop, targetScrollOffsetBottom];
}
