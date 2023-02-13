import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [[createOrder('1000', '0.000000001', new Date(1), 'xch', 'ach')], 'xch', new BigNumber(1e12), new BigNumber(1e9), true],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '1',
        isTop: false,
        rate: '1000000000',
        volume: '1',
      },
    ],
    maxBuyRate: '1000000000',
    minSellRate: undefined,
    maxRatePrecision: 1,
  },
};

export default testCase;
