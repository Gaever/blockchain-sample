import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [[createOrder('100', '1000', new Date(1), 'xch', 'ach')], 'xch', new BigNumber(1e12), new BigNumber(1e9), true],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0',
        isTop: false,
        rate: '0.001',
        volume: '0',
      },
    ],
    maxBuyRate: '0.001',
    minSellRate: undefined,
    maxRatePrecision: 3,
  },
};

export default testCase;
