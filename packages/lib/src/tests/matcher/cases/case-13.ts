import BigNumber from 'bignumber.js';
import config from '../exchange-config';
import { createDeal, createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const newOrder = createOrder('236111', '0.6', new Date(4), 'xch', 'ach');
const sellIn = [
  createOrder('100000', '3.6', new Date(1), 'xch', 'ach'),
  createOrder('100000', '2.6', new Date(2), 'xch', 'ach'),
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
    newDeals: [createDeal('111111', '100', '1112', '2', '0.9', 'xch', 'ach'), createDeal('125000', '100', '1250', '2', '0.8', 'xch', 'ach')],
    affectedOrders: [
      { ...buyIn[0], status: 'done', amount: new BigNumber(0) },
      { ...buyIn[1], status: 'done', amount: new BigNumber(0) },
      { ...newOrder, status: 'done', amount: new BigNumber(0) },
    ],
    sell: sellIn,
    buy: [buyIn[2]],
  },
};

export default testCase;
