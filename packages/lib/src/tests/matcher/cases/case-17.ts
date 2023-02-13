import { ExchangeConfig } from '@/types/stock';
import BigNumber from 'bignumber.js';
import config from '../exchange-config';
import { createDeal, createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const configWithFixedComission: ExchangeConfig = {
  ...config,
  xch: {
    ...config.xch,
    fees: {
      ...config.xch.fees,
      takerFee: { fixed: '20000' },
      makerFee: { fixed: '10000' },
    },
  },
  ach: {
    ...config.ach,
    fees: {
      ...config.ach.fees,
      takerFee: { fixed: '20' },
      makerFee: { fixed: '10' },
    },
  },
};

const newOrder = createOrder('426', '4', new Date(4), 'ach', 'xch');
const sellIn = [
  createOrder('100000', '3.6', new Date(1), 'xch', 'ach'),
  createOrder('100000', '2.666', new Date(2), 'xch', 'ach'),
  createOrder('100000', '1.6', new Date(3), 'xch', 'ach'),
];
const buyIn = [createOrder('100', '0.9', new Date(1), 'ach', 'xch'), createOrder('100', '0.8', new Date(2), 'ach', 'xch'), createOrder('100', '0.7', new Date(3), 'ach', 'xch')];

const testCase: TestCase = {
  in: {
    sell: sellIn,
    buy: buyIn,
    exchangeConfig: configWithFixedComission,
    newOrder,
  },
  out: {
    newDeals: [createDeal('100000', '160', '20000', '10', '1.6', 'xch', 'ach'), createDeal('99774', '266', '20000', '10', '2.666', 'xch', 'ach')],
    affectedOrders: [
      { ...sellIn[2], status: 'done', amount: new BigNumber(0) },
      { ...sellIn[1], status: 'part', amount: new BigNumber(226) },
      { ...newOrder, status: 'done', amount: new BigNumber(0) },
    ],
    sell: [
      sellIn[0],
      {
        ...sellIn[1],
        amount: new BigNumber(226),
        status: 'part',
      },
    ],
    buy: buyIn,
  },
};

export default testCase;
