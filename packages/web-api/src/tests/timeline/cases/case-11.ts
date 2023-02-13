import { colorDown } from '@/websocket/chart-data/timeline';
import BigNumber from 'bignumber.js';
import { BarData, HistogramData } from 'lightweight-charts';
import { emptyCandles, emptyVolumes } from '../helpers';
import { TestCase } from '../timeline.test';

const testCase: TestCase = {
  in: {
    flip: false,
    lastRecordBeforeInterval: {
      closing_price: '10',
      highest_price: '10',
      lowest_price: '10',
      opening_price: '10',
      time: new Date('2021-12-21T00:20:00.000Z'),
      volume_1: '1000',
      volume_2: '200',
    },
    intervalRecords: [
      {
        closing_price: '15',
        highest_price: '30',
        lowest_price: '10',
        opening_price: '20',
        time: new Date('2021-12-27T00:25:00.000Z'),
        volume_1: '15000',
        volume_2: '250',
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
      ...emptyCandles(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60, 10),
      {
        close: 15,
        high: 30,
        low: 10,
        open: 20,
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
      } as BarData,
      ...emptyCandles(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60, 15),
    ],
    volume: [
      ...emptyVolumes(new Date('2021-12-26T00:30:00.000Z').getTime(), new Date('2021-12-27T00:24:00.000Z').getTime(), 1000 * 60),
      {
        time: Math.floor(new Date('2021-12-27T00:25:00.000Z').getTime() / 1000),
        value: 1.5e-8,
        color: colorDown,
      } as HistogramData,
      ...emptyVolumes(new Date('2021-12-27T00:26:00.000Z').getTime(), new Date('2021-12-27T00:30:00.000Z').getTime(), 1000 * 60),
    ],
  },
};

export default testCase;
