import config from '../exchange-config';
import { createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const newOrder = createOrder('100', '1', new Date(1), 'xch', 'ach');

const testCase: TestCase = {
  in: {
    sell: [],
    buy: [],
    exchangeConfig: config,
    newOrder,
  },
  out: {
    newDeals: [],
    affectedOrders: [{ ...newOrder, status: 'queued' }],
    sell: [newOrder],
    buy: [],
  },
};

export default testCase;
