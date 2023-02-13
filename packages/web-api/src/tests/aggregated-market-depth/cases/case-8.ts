import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [
    [
      createOrder('1000', '3', new Date(1), 'xch', 'ach'),
      createOrder('1000', '3', new Date(2), 'xch', 'ach'),
      createOrder('1000', '2', new Date(1), 'xch', 'ach'),
      createOrder('1000', '2', new Date(2), 'xch', 'ach'),
      createOrder('1000', '1', new Date(1), 'xch', 'ach'),
      createOrder('1000', '1', new Date(2), 'xch', 'ach'),
    ],
    'xch',
    new BigNumber(1e12),
    new BigNumber(1e9),
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000012',
        isTop: true,
        rate: '3',
        volume: '0.000000006',
      },
      {
        aggregatedVolume: '0.000000006',
        isTop: true,
        rate: '2',
        volume: '0.000000004',
      },
      {
        aggregatedVolume: '0.000000002',
        isTop: true,
        rate: '1',
        volume: '0.000000002',
      },
    ],
    maxBuyRate: undefined,
    minSellRate: '1',
    maxRatePrecision: 1,
  },
};

export default testCase;
