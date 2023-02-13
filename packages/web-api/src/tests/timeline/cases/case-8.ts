import BigNumber from 'bignumber.js';
import { emptyCandles, emptyVolumes } from '../helpers';
import { TestCase } from '../timeline.test';

const now = new Date('2021-12-25T00:30:10.000Z');
const flooredNow = new Date('2021-12-20T03:00:00.000Z');
const startDate = new Date('2016-12-26T03:00:00.000Z');

const testCase: TestCase = {
  in: {
    flip: false,
    intervalRecords: [],
    timeBucket: '1w',
    timezoneOffset: -180,
    mojosInRootCurCoin: new BigNumber(1e12),
    mojosInMinorCurCoin: new BigNumber(1e9),
    lastDealRate: undefined,
    now,
    lastRecordBeforeInterval: undefined,
  },
  out: {
    candles: emptyCandles(startDate.getTime(), flooredNow.getTime(), 1000 * 60 * 60 * 24 * 7, 1),
    volume: emptyVolumes(startDate.getTime(), flooredNow.getTime(), 1000 * 60 * 60 * 24 * 7),
  },
};

export default testCase;
