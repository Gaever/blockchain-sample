import BigNumber from 'bignumber.js';
import config from '../exchange-config';
import { createDeal, createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const newOrder = createOrder('100', '1', new Date(1), 'ach', 'xch');
const sellIn = [createOrder('100000', '1', new Date(1), 'xch', 'ach')];
const buyIn = [];

const testCase: TestCase = {
  in: {
    sell: sellIn,
    buy: buyIn,
    exchangeConfig: config,
    newOrder,
  },
  out: {
    newDeals: [createDeal('100000', '100', '2000', '1', '1', 'xch', 'ach')],
    affectedOrders: [
      { ...sellIn[0], status: 'done', amount: new BigNumber(0) },
      { ...newOrder, status: 'done', amount: new BigNumber(0) },
    ],
    sell: [],
    buy: [],
  },
};

export default testCase;
