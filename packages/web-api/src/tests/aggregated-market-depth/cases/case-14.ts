import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [[createOrder('1', '1', new Date(1), 'ach', 'xch')], 'xch', new BigNumber(1e12), new BigNumber(1e9), true],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000001',
        isTop: true,
        rate: '1',
        volume: '0.000000001',
      },
    ],
    maxBuyRate: undefined,
    minSellRate: '1',
    maxRatePrecision: 1,
  },
};

export default testCase;
