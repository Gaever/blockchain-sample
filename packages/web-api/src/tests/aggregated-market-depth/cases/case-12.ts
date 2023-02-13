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

      createOrder('3', '3', new Date(1), 'ach', 'xch'),
      createOrder('3', '3', new Date(2), 'ach', 'xch'),
      createOrder('2', '2', new Date(1), 'ach', 'xch'),
      createOrder('2', '2', new Date(2), 'ach', 'xch'),
      createOrder('1', '1', new Date(1), 'ach', 'xch'),
      createOrder('1', '1', new Date(2), 'ach', 'xch'),
    ],
    'xch',
    new BigNumber(1e9),
    new BigNumber(1e12),
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000154',
        isTop: true,
        rate: '6',
        volume: '0.000000072',
      },
      {
        aggregatedVolume: '0.000000082',
        isTop: true,
        rate: '5',
        volume: '0.00000005',
      },
      {
        aggregatedVolume: '0.000000032',
        isTop: true,
        rate: '4',
        volume: '0.000000032',
      },

      {
        aggregatedVolume: '0.000000000006',
        isTop: false,
        rate: '3',
        volume: '0.000000000006',
      },
      {
        aggregatedVolume: '0.00000000001',
        isTop: false,
        rate: '2',
        volume: '0.000000000004',
      },
      {
        aggregatedVolume: '0.000000000012',
        isTop: false,
        rate: '1',
        volume: '0.000000000002',
      },
    ],
    maxBuyRate: '3',
    minSellRate: '4',
    maxRatePrecision: 1,
  },
};

export default testCase;
