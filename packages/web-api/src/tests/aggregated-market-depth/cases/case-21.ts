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
    true,
  ],
  out: {
    marketDepth: [
      {
        aggregatedVolume: '0.000000005998',
        isTop: true,
        rate: '1',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000003998',
        isTop: true,
        rate: '0.5',
        volume: '0.000000002',
      },
      {
        aggregatedVolume: '0.000000001998',
        isTop: true,
        rate: '0.3333333333',
        volume: '0.000000001998',
      },

      {
        aggregatedVolume: '0.2',
        isTop: false,
        rate: '0.1',
        volume: '0.2',
      },
      {
        aggregatedVolume: '0.3',
        isTop: false,
        rate: '0.05',
        volume: '0.1',
      },
      {
        aggregatedVolume: '0.3666666666',
        isTop: false,
        rate: '0.0333333333',
        volume: '0.0666666666',
      },
    ],
    maxBuyRate: '0.1',
    minSellRate: '0.3333333333',
    maxRatePrecision: 10,
  },
};

export default testCase;
