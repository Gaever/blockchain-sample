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
    true,
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000002',
        isTop: false,
        rate: '1',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000003',
        isTop: false,
        rate: '0.5',
        volume: '0.000000001',
      },
      {
        aggregatedVolume: '0.000000003666',
        isTop: false,
        rate: '0.3333333333',
        volume: '0.000000000666',
      },
    ],
    maxBuyRate: '1',
    minSellRate: undefined,
    maxRatePrecision: 10,
  },
};

export default testCase;
