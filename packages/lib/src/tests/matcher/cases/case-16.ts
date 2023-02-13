import BigNumber from 'bignumber.js';
import config from '../exchange-config';
import { createDeal, createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

// 1 000 000 000.000 000 000 ACH
// 1 000 000.000 000 000 000 XCH
const newOrder = createOrder('1000000000000000000', '1000', new Date(1), 'ach', 'xch');
const sellIn = [createOrder('1000000000000000000', '1000', new Date(1), 'xch', 'ach')];
const buyIn = [];

const testCase: TestCase = {
  in: {
    sell: sellIn,
    buy: buyIn,
    exchangeConfig: config,
    newOrder,
  },
  out: {
    newDeals: [createDeal('1000000000000000000', '1000000000000000000', '20000000000000000', '10000000000000000', '1000', 'xch', 'ach')],
    affectedOrders: [
      { ...sellIn[0], status: 'done', amount: new BigNumber(0) },
      { ...newOrder, status: 'done', amount: new BigNumber(0) },
    ],
    sell: [],
    buy: [],
  },
};

export default testCase;
