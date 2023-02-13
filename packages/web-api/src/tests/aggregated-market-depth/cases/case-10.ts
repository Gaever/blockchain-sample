import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [
    [
      createOrder('1000000000000', '30', new Date(1), 'xch', 'ach'),
      createOrder('1000000000000', '30', new Date(2), 'xch', 'ach'),
      createOrder('1000000000000', '20', new Date(1), 'xch', 'ach'),
      createOrder('1000000000000', '20', new Date(2), 'xch', 'ach'),
      createOrder('1000000000000', '10', new Date(1), 'xch', 'ach'),
      createOrder('1000000000000', '10', new Date(2), 'xch', 'ach'),

      createOrder('3', '3', new Date(1), 'ach', 'xch'),
      createOrder('3', '3', new Date(2), 'ach', 'xch'),
      createOrder('2', '2', new Date(1), 'ach', 'xch'),
      createOrder('2', '2', new Date(2), 'ach', 'xch'),
      createOrder('1', '1', new Date(1), 'ach', 'xch'),
      createOrder('1', '1', new Date(2), 'ach', 'xch'),
    ],
    'xch',
    new BigNumber(1e12),
    new BigNumber(1e9),
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '120',
        isTop: true,
        rate: '30',
        volume: '60',
      },
      {
        aggregatedVolume: '60',
        isTop: true,
        rate: '20',
        volume: '40',
      },
      {
        aggregatedVolume: '20',
        isTop: true,
        rate: '10',
        volume: '20',
      },

      {
        aggregatedVolume: '0.000000006',
        isTop: false,
        rate: '3',
        volume: '0.000000006',
      },
      {
        aggregatedVolume: '0.00000001',
        isTop: false,
        rate: '2',
        volume: '0.000000004',
      },
      {
        aggregatedVolume: '0.000000012',
        isTop: false,
        rate: '1',
        volume: '0.000000002',
      },
    ],
    maxBuyRate: '3',
    minSellRate: '10',
    maxRatePrecision: 1,
  },
};

export default testCase;
