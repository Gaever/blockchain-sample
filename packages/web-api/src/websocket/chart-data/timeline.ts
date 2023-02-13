import { floorDate, timeBucketToNumber, timeBucketToPeriod } from '@ctocker/lib/build/main/src/models/cur-series.model';
import { flipRate, mojo1ToMojo2, mojosToCoins, significantDigitsLimit } from '@ctocker/lib/build/main/src/services/lookup/matcher';
import { CurSeriesRecord, TimeBucket } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import { BarData, HistogramData, LineData, Time } from 'lightweight-charts';
import { getMaxRatePresicion } from './aggregated-market-depth';

export function getLocalTimestamp(ts: number, timezoneOffset: number): Time {
  return Math.floor((ts - timezoneOffset * 60 * 1000) / 1000) as Time;
}

function getStartTime({ now, timeBucket, period }: { now: Date; timeBucket: TimeBucket; period: number }) {
  return floorDate(new Date(new Date(now.getTime() - period)), timeBucket).getTime();
}

function getEndTime({ now, timeBucket }: { now: Date; timeBucket: TimeBucket }) {
  return floorDate(now, timeBucket).getTime();
}

export const colorDown = 'rgba(255, 102, 56, 0.5)';
export const colorUp = 'rgba(88, 189, 125, 0.5)';

export function createTick(
  recordTimestamp: number,
  timezoneOffset: number,
  flip: boolean,
  record: CurSeriesRecord,
  mojosInRootCurCoin: BigNumber,
  mojosInMinorCurCoin: BigNumber,
) {
  let candle: BarData;
  let volume: HistogramData;

  // Отрисовываем точку с непустыми данными
  const localRecordTimestamp = getLocalTimestamp(recordTimestamp, timezoneOffset);
  if (flip) {
    // Перевернули корневую валюту
    const flippedOpenPrice = flipRate(new BigNumber(record.opening_price));
    const flippedClosePrice = flipRate(new BigNumber(record.closing_price));

    candle = {
      time: localRecordTimestamp,
      open: flippedOpenPrice.toNumber(),
      high: flipRate(new BigNumber(record.highest_price)).toNumber(),
      low: flipRate(new BigNumber(record.lowest_price)).toNumber(),
      close: flippedClosePrice.toNumber(),
    };

    const volumeInMinorCurMojos = new BigNumber(record.volume_2);
    const volumeInRootCurCoins = mojosToCoins(mojo1ToMojo2(volumeInMinorCurMojos, mojosInMinorCurCoin, mojosInRootCurCoin), mojosInRootCurCoin)
      .sd(significantDigitsLimit)
      .toNumber();
    const priceIsDown = flippedOpenPrice.gt(flippedClosePrice);

    volume = {
      time: localRecordTimestamp,
      value: volumeInRootCurCoins,
      color: priceIsDown ? colorDown : colorUp,
    };
  } else {
    candle = {
      time: localRecordTimestamp,
      open: Number(record.opening_price),
      high: Number(record.highest_price),
      low: Number(record.lowest_price),
      close: Number(record.closing_price),
    };
    const volumeInRootCurMojos = new BigNumber(record.volume_1);
    const volumeInMinorCurCoins = mojosToCoins(mojo1ToMojo2(volumeInRootCurMojos, mojosInRootCurCoin, mojosInMinorCurCoin), mojosInMinorCurCoin)
      .sd(significantDigitsLimit)
      .toNumber();

    const priceIsDown = new BigNumber(record.opening_price).gt(new BigNumber(record.closing_price));

    volume = {
      time: localRecordTimestamp,
      value: volumeInMinorCurCoins,
      color: priceIsDown ? colorDown : colorUp,
    };
  }

  return { candle, volume };
}

export function createEmptyTick(
  tickTimestamp: number,
  timezoneOffset: number,
  intervalRecords: CurSeriesRecord[],
  nextRecordIndex: number,
  lastRecordBeforeInterval: CurSeriesRecord | undefined,
  lastDealRate: string | undefined,
  flip: boolean,
) {
  let candle: BarData;
  let volume: HistogramData;
  // Отрисовываем пустую точку
  const localTimestamp = getLocalTimestamp(tickTimestamp, timezoneOffset);

  // Цена закрытия между двумя записями временного ряда (цена_сделки_nextRecordIndex-1) в выбранном интервале (например 1 день на минутном графике).
  // ...---[цена_сделки_nextRecordIndex-1]--[текущий пустой tick, i]--[цена_сделки_nextRecordIndex]----...
  // Записи может не быть, если за временной промежуток не было сделок
  // (например за последний сутки не было сделок и выборка из минутного ряда вернет пустоту).
  const closingPriceOfCurrentRecordInInterval = intervalRecords?.[nextRecordIndex - 1]?.closing_price;

  // Цена закрытия за пределами выбранного интервала.
  // Если записи нет, значит сделок не было.
  const closingPriceOfLastRecordBeforeInterval = lastRecordBeforeInterval?.closing_price;

  const hasRecordAfterCurrentTick = intervalRecords?.[nextRecordIndex]?.time?.getTime?.() > tickTimestamp;

  let lastRate = Number(closingPriceOfCurrentRecordInInterval || closingPriceOfLastRecordBeforeInterval || lastDealRate || 1);

  if (!lastRecordBeforeInterval && !closingPriceOfCurrentRecordInInterval && hasRecordAfterCurrentTick) {
    // На бирже совершилась первая сделка, но курсор еще не дошел до этой отметки.
    // Все цены до первый сделки должны быть равны 1.
    lastRate = 1;
  }

  if (flip) {
    // Перевернули валюту
    lastRate = flipRate(new BigNumber(lastRate)).toNumber();
  }

  candle = {
    time: localTimestamp,
    open: lastRate,
    high: lastRate,
    low: lastRate,
    close: lastRate,
  };
  volume = {
    time: localTimestamp,
    value: 0,
    color: colorUp,
  };

  return { candle, volume };
}

export function createTimeline({
  flip,
  intervalRecords,
  timeBucket,
  timezoneOffset,
  mojosInRootCurCoin,
  mojosInMinorCurCoin,
  lastDealRate,
  now,
  lastRecordBeforeInterval,
}: {
  flip: boolean;
  intervalRecords: CurSeriesRecord[];
  lastRecordBeforeInterval: CurSeriesRecord;
  timeBucket: TimeBucket;
  timezoneOffset: number;
  mojosInRootCurCoin: BigNumber;
  mojosInMinorCurCoin: BigNumber;
  lastDealRate: string;
  now: Date;
}) {
  const candlesArr: BarData[] = [];
  const volumeArr: HistogramData[] = [];

  const period = timeBucketToPeriod[timeBucket];
  const interval = timeBucketToNumber[timeBucket];
  const startTime = getStartTime({
    now,
    timeBucket,
    period,
  });
  const endTime = getEndTime({ now, timeBucket });
  let candlesPricePrecision = 1;

  let nextRecordIndex = 0;
  for (let tickIndex = 0; tickIndex <= Math.floor((endTime - startTime) / interval); tickIndex++) {
    const tickTimestamp = new Date(startTime + interval * tickIndex).getTime();
    const record = intervalRecords?.[nextRecordIndex];
    const recordTimestamp = record?.time?.getTime();
    if (tickTimestamp === recordTimestamp) {
      // Отрисовываем точку с непустыми данными
      const { candle, volume } = createTick(recordTimestamp, timezoneOffset, flip, record, mojosInRootCurCoin, mojosInMinorCurCoin);
      candlesPricePrecision = getMaxRatePresicion(candlesPricePrecision, String(candle.close));

      candlesArr.push(candle);
      volumeArr.push(volume);
      nextRecordIndex++;
    } else {
      // Отрисовываем пустую точку
      const { candle, volume } = createEmptyTick(
        tickTimestamp,
        timezoneOffset,
        intervalRecords,
        nextRecordIndex,
        lastRecordBeforeInterval,
        lastDealRate,
        flip,
      );
      candlesPricePrecision = getMaxRatePresicion(candlesPricePrecision, String(candle.close));
      candlesArr.push(candle);
      volumeArr.push(volume);
    }
  }

  return { candles: candlesArr, volume: volumeArr, candlesPricePrecision };
}

export function createMinichartTimeline({
  intervalRecords,
  timezoneOffset,
  lastRecordBeforeInterval,
  lastDealRate,
  mojosInRootCurCoin,
  mojosInMinorCurCoin,
}: {
  intervalRecords: CurSeriesRecord[];
  timezoneOffset: number;
  lastRecordBeforeInterval: CurSeriesRecord;
  mojosInRootCurCoin: BigNumber;
  mojosInMinorCurCoin: BigNumber;
  lastDealRate: string;
}) {
  const now = new Date();
  const items: LineData[] = [];

  const period = timeBucketToNumber['1d'];
  const interval = timeBucketToNumber['1min'];
  const startTime = getStartTime({ now, timeBucket: '1min', period });
  const endTime = getEndTime({ now, timeBucket: '1min' });

  let nextRecordIndex = 0;
  for (let tickIndex = 0; tickIndex <= Math.floor((endTime - startTime) / interval); tickIndex++) {
    const tickTimestamp = new Date(startTime + interval * tickIndex).getTime();
    const record = intervalRecords?.[nextRecordIndex];
    const recordTimestamp = record?.time?.getTime();
    if (tickTimestamp === recordTimestamp) {
      // Отрисовываем точку с непустыми данными
      const localRecordTime = getLocalTimestamp(recordTimestamp, timezoneOffset);

      const volumeInRootCurMojos = new BigNumber(record.volume_1);
      const volumeInMinorCurCoins = mojosToCoins(mojo1ToMojo2(volumeInRootCurMojos, mojosInRootCurCoin, mojosInMinorCurCoin), mojosInMinorCurCoin)
        .sd(significantDigitsLimit)
        .toNumber();

      items.push({
        time: localRecordTime,
        value: volumeInMinorCurCoins,
      });
      nextRecordIndex++;
    } else {
      // Отрисовываем пустую точку
      const localRecordTime = getLocalTimestamp(tickTimestamp, timezoneOffset);

      const closingPriceOfCurrentRecordInInterval = intervalRecords?.[nextRecordIndex - 1]?.closing_price;
      const closingPriceOfLastRecordBeforeInterval = lastRecordBeforeInterval?.closing_price;
      const hasRecordAfterCurrentTick = intervalRecords?.[nextRecordIndex]?.time?.getTime?.() > tickTimestamp;

      let lastRate = Number(closingPriceOfCurrentRecordInInterval || closingPriceOfLastRecordBeforeInterval || lastDealRate || 1);

      if (!lastRecordBeforeInterval && !closingPriceOfCurrentRecordInInterval && hasRecordAfterCurrentTick) {
        lastRate = 1;
      }

      items.push({
        time: localRecordTime,
        value: lastRate,
      });
    }
  }

  return items;
}
