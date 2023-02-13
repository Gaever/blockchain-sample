import Stock from '@/services/stock';
import { Income, Order } from '@/types/stock';
import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import exchangeConfig from './exchange-config';
import { createOrder } from './helpers';

describe('Stock', function () {
  it('income to order', function () {
    const stock = new Stock(exchangeConfig);

    const income: Income = {
      id: 1,
      tx_id: '0000000000000000000000000000000000000000000000000000000000000111',
      height: 1,
      created_at: new Date(0),
      client_puzzle_hash: '0x1000000000000000000000000000000000000000000000000000000000000000',
      rate_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      amount: '100',
      cur: 'xch',
      status: 'new',
      stock_id: 1,
      rate: '1',
    };
    const order = stock.incomeToOrder(income);
    assert.deepEqual(order, {
      created_at: new Date(0),
      expires_at: new Date(0 + 6000000),
      client_puzzle_hash: '0x1000000000000000000000000000000000000000000000000000000000000000',
      rate_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      rate: new BigNumber(1),
      is_sell: true,
      cur1: 'xch',
      cur2: 'ach',
      amount: new BigNumber(100),
      start_amount: new BigNumber(100),
      income_id: 1,
      status: 'created',
      stock_id: 1,
    });
  });

  it('income to order having amount is less than config min amount', function () {
    const stock = new Stock(exchangeConfig);

    const income: Income = {
      id: 1,
      tx_id: '0000000000000000000000000000000000000000000000000000000000000111',
      height: 1,
      created_at: new Date(0),
      client_puzzle_hash: '0x1000000000000000000000000000000000000000000000000000000000000000',
      rate_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      amount: '90',
      cur: 'xch',
      status: 'new',
      stock_id: 1,
      rate: '1',
    };
    const order = stock.incomeToOrder(income);
    assert.deepEqual(order, {
      created_at: new Date(0),
      expires_at: new Date(0 + 6000000),
      client_puzzle_hash: '0x1000000000000000000000000000000000000000000000000000000000000000',
      rate_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      rate: new BigNumber(1),
      is_sell: true,
      cur1: 'xch',
      cur2: 'ach',
      amount: new BigNumber(90),
      start_amount: new BigNumber(90),
      income_id: 1,
      status: 'min-amount-done',
      stock_id: 1,
    });
  });

  it('expire orders', function () {
    const orders: Order[] = [
      { ...createOrder('100000', '3.6', new Date(new Date().getTime()), 'xch', 'ach', exchangeConfig), expires_at: new Date(new Date().getTime() + 100), status: 'queued' },
      { ...createOrder('100000', '3.6', new Date(new Date().getTime() - 100), 'xch', 'ach', exchangeConfig), expires_at: new Date(new Date().getTime() - 1), status: 'queued' },
      { ...createOrder('100000', '3.6', new Date(new Date().getTime() - 100), 'ach', 'xch', exchangeConfig), expires_at: new Date(new Date().getTime() - 1), status: 'queued' },
      { ...createOrder('100000', '3.6', new Date(new Date().getTime() - 100), 'xch', 'ach', exchangeConfig), expires_at: new Date(), status: 'queued' },
    ];
    const expiredOrders: Order[] = [
      { ...orders[1], status: 'expired' },
      { ...orders[2], status: 'expired' },
      { ...orders[3], status: 'expired' },
    ];
    const result = Stock.expireOrders(orders);
    assert.deepEqual(result.expiredOrders, expiredOrders);
    assert.deepEqual(result.freshOrders, [orders[0]]);
  });

  it('do not expire orders having orderLifetimeMs = 0', function () {
    const orders: Order[] = [{ ...createOrder('100000', '3.6', new Date(new Date().getTime() - 100), 'xch', 'ach', exchangeConfig), expires_at: undefined, status: 'queued' }];
    const result = Stock.expireOrders(orders);
    assert.deepEqual(result.expiredOrders, []);
    assert.deepEqual(result.freshOrders, [orders[0]]);
  });
});
