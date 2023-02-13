import BigNumber from 'bignumber.js';
import { emptyCandles, emptyVolumes } from '../helpers';
import { TestCase } from '../timeline.test';

const now = new Date('2021-12-27T00:30:10.000Z');
const flooredNow = new Date(now);
flooredNow.setUTCSeconds(0);
flooredNow.setUTCMinutes(0);
flooredNow.setUTCHours(3);

const testCase: TestCase = {
  in: {
    flip: false,
    intervalRecords: [],
    timeBucket: '1d',
    timezoneOffset: -180,
    mojosInRootCurCoin: new BigNumber(1e12),
    mojosInMinorCurCoin: new BigNumber(1e9),
    lastDealRate: undefined,
    now,
    lastRecordBeforeInterval: undefined,
  },
  out: {
    candles: emptyCandles(flooredNow.getTime() - 1000 * 60 * 60 * 24 * 365 * 5, flooredNow.getTime(), 1000 * 60 * 60 * 24, 1),
    volume: emptyVolumes(flooredNow.getTime() - 1000 * 60 * 60 * 24 * 365 * 5, flooredNow.getTime(), 1000 * 60 * 60 * 24),
  },
};

export default testCase;
