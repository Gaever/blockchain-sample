import BigNumber from 'bignumber.js';
import { createOrder } from '../helpers';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [
    [
      createOrder('6', '6', new Date(1), 'xch', 'ach'),
      createOrder('6', '6', new Date(2), 'xch', 'ach'),
      createOrder('5', '5', new Date(1), 'xch', 'ach'),
      createOrder('5', '5', new Date(2), 'xch', 'ach'),
      createOrder('4', '4', new Date(1), 'xch', 'ach'),
      createOrder('4', '4', new Date(2), 'xch', 'ach'),

      createOrder('4000', '3', new Date(1), 'ach', 'xch'),
      createOrder('4000', '3', new Date(2), 'ach', 'xch'),
      createOrder('2000', '2', new Date(1), 'ach', 'xch'),
      createOrder('2000', '2', new Date(2), 'ach', 'xch'),
      createOrder('1000', '1', new Date(1), 'ach', 'xch'),
      createOrder('1000', '1', new Date(2), 'ach', 'xch'),
    ],
    'xch',
    new BigNumber(1e9),
    new BigNumber(1e12),
    true,
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000006',
        isTop: true,
        rate: '1',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000004',
        isTop: true,
        rate: '0.5',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000002',
        isTop: true,
        rate: '0.3333333333',
        volume: '0.000000002',
      },

      {
        aggregatedVolume: '0.000000002',
        isTop: false,
        rate: '0.25',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000004',
        isTop: false,
        rate: '0.2',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000006',
        isTop: false,
        rate: '0.1666666667',
        volume: '0.000000002',
      },
    ],
    maxBuyRate: '0.25',
    minSellRate: '0.3333333333',
    maxRatePrecision: 10,
  },
};

export default testCase;
