import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [
    [createOrder('3', '3', new Date(1), 'ach', 'xch'), createOrder('1', '1', new Date(2), 'ach', 'xch')],
    'xch',
    new BigNumber(1e12),
    new BigNumber(1e9),
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000003',
        isTop: false,
        rate: '3',
        volume: '0.000000003',
      },
      {
        aggregatedVolume: '0.000000004',
        isTop: false,
        rate: '1',
        volume: '0.000000001',
      },
    ],
    maxBuyRate: '3',
    minSellRate: undefined,
    maxRatePrecision: 1,
  },
};

export default testCase;
