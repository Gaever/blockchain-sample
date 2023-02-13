import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [
    [createOrder('3', '3', new Date(1), 'ach', 'xch'), createOrder('1', '1', new Date(2), 'ach', 'xch')],
    'xch',
    new BigNumber(1e12),
    new BigNumber(1e9),
    true,
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000001999',
        isTop: true,
        rate: '1',
        volume: '0.000000001',
      },
      {
        aggregatedVolume: '0.000000000999',
        isTop: true,
        rate: '0.3333333333',
        volume: '0.000000000999',
      },
    ],
    maxBuyRate: undefined,
    minSellRate: '0.3333333333',
    maxRatePrecision: 10,
  },
};

export default testCase;
