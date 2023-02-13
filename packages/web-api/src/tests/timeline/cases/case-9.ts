import { colorUp } from '@/websocket/chart-data/timeline';
import BigNumber from 'bignumber.js';
import { BarData, HistogramData } from 'lightweight-charts';
import { emptyCandles, emptyVolumes } from '../helpers';
import { TestCase } from '../timeline.test';

const testCase: TestCase = {
  in: {
    flip: false,
    intervalRecords: [
      {
        closing_price: '10',
        highest_price: '10',
        lowest_price: '10',
        opening_price: '10',
        time: new Date('2021-12-27T00:25:00.000Z'),
        volume_1: '1000',
        volume_2: '200',
      },
    ],
    timeBucket: '1min',
    timezoneOffset: 0,
    mojosInRootCurCoin: new BigNumber(1e12),
    mojosInMinorCurCoin: new BigNumber(1e9),
    lastDealRate: '10',
    now: new Date('2021-12-27T00:30:10.000Z'),
    lastRecordBeforeInterval: undefined,
  },

  out: {
    candles: [
      ...emptyCandles(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60, 1),
      {
        close: 10,
        high: 10,
        low: 10,
        open: 10,
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
      } as BarData,
      ...emptyCandles(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60, 10),
    ],
    volume: [
      ...emptyVolumes(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60),
      {
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
        value: 1e-9,
        color: colorUp,
      } as HistogramData,
      ...emptyVolumes(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60),
    ],
  },
};

export default testCase;
