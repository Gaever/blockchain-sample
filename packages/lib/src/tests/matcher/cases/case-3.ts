import config from '../exchange-config';
import { createOrder } from '../helpers';
import { TestCase } from '../matcher.test';

const newOrder = createOrder('100', '3', new Date(1), 'xch', 'ach');
const sellIn = [createOrder('101', '2', new Date(1), 'xch', 'ach'), createOrder('102', '2', new Date(2), 'xch', 'ach'), createOrder('103', '1', new Date(1), 'xch', 'ach')];
const buyIn = [createOrder('201', '0.5', new Date(1), 'ach', 'xch'), createOrder('202', '0.5', new Date(2), 'ach', 'xch'), createOrder('203', '0.4', new Date(1), 'ach', 'xch')];

const testCase: TestCase = {
  in: {
    sell: sellIn,
    buy: buyIn,
    exchangeConfig: config,
    newOrder,
  },
  out: {
    newDeals: [],
    affectedOrders: [{ ...newOrder, status: 'queued' }],
    sell: [newOrder, ...sellIn],
    buy: buyIn,
  },
};

export default testCase;
