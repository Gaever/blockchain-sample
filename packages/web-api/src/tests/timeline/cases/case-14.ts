import { colorUp } from '@/websocket/chart-data/timeline';
import BigNumber from 'bignumber.js';
import { BarData, HistogramData } from 'lightweight-charts';
import { emptyCandles, emptyVolumes } from '../helpers';
import { TestCase } from '../timeline.test';

const testCase: TestCase = {
  in: {
    flip: true,
    lastRecordBeforeInterval: {
      closing_price: '10',
      highest_price: '10',
      lowest_price: '10',
      opening_price: '10',
      time: new Date('2021-12-21T00:20:00.000Z'),
      volume_1: '1000',
      volume_2: '1',
    },
    intervalRecords: [
      {
        closing_price: '15',
        highest_price: '30',
        lowest_price: '10',
        opening_price: '20',
        time: new Date('2021-12-27T00:25:00.000Z'),
        volume_1: '15000',
        volume_2: '555',
      },
      {
        closing_price: '30',
        highest_price: '50',
        lowest_price: '7',
        opening_price: '50',
        time: new Date('2021-12-27T00:28:00.000Z'),
        volume_1: '25000',
        volume_2: '35',
      },
    ],
    timeBucket: '1min',
    timezoneOffset: 0,
    mojosInRootCurCoin: new BigNumber(1e12),
    mojosInMinorCurCoin: new BigNumber(1e9),
    lastDealRate: '15',
    now: new Date('2021-12-27T00:30:10.000Z'),
  },

  out: {
    candles: [
      ...emptyCandles(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60, 0.1),
      {
        close: 0.0666666667,
        high: 0.0333333333,
        low: 0.1,
        open: 0.05,
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
      } as BarData,
      ...emptyCandles(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:27:00.000Z').getTime(), 1000 * 60, 0.0666666667),
      {
        close: 0.0333333333,
        high: 0.02,
        low: 0.1428571429,
        open: 0.02,
        time: Math.floor(new Date('2021-12-27T00:28:00.000Z').getTime() / 1000),
      } as BarData,
      ...emptyCandles(new Date('2021-12-27T00:29:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60, 0.0333333333),
    ],
    volume: [
      ...emptyVolumes(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60),
      {
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
        value: 0.000000555,
        color: colorUp,
      } as HistogramData,
      ...emptyVolumes(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:27:00.000Z').getTime(), 1000 * 60),
      {
        time: Math.floor(new Date('2021-12-27T00:28:00.000Z').getTime() / 1000),
        value: 3.5e-8,
        color: colorUp,
      } as HistogramData,
      ...emptyVolumes(new Date('2021-12-27T00:29:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60),
    ],
  },
};

export default testCase;
