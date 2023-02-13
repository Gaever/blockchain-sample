import BigNumber from 'bignumber.js';
import config from '../exchange-config';
import { createDeal, createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const newOrder = createOrder('427', '3', new Date(4), 'ach', 'xch');
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
    exchangeConfig: config,
    newOrder,
  },
  out: {
    newDeals: [createDeal('100000', '160', '2000', '2', '1.6', 'xch', 'ach'), createDeal('100000', '266', '2000', '3', '2.666', 'xch', 'ach')],
    affectedOrders: [
      { ...sellIn[2], status: 'done', amount: new BigNumber(0) },
      { ...sellIn[1], status: 'done', amount: new BigNumber(0) },
      { ...newOrder, status: 'part', amount: new BigNumber(1) },
    ],
    sell: [sellIn[0]],
    buy: [
      {
        ...newOrder,
        amount: new BigNumber(1),
        status: 'part',
      },
      ...buyIn,
    ],
  },
};

export default testCase;
