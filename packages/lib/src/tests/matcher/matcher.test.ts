import MarketDepth from '@/services/lookup/market-depth';
import { match } from '@/services/lookup/matcher';
import { Deal, ExchangeConfig, Order } from '@/types/stock';
import { assert } from 'chai';
import _pick from 'lodash/pick';
import case1 from './cases/case-1';
import case10 from './cases/case-10';
import case11 from './cases/case-11';
import case12 from './cases/case-12';
import case13 from './cases/case-13';
import case14 from './cases/case-14';
import case15 from './cases/case-15';
import case16 from './cases/case-16';
import case17 from './cases/case-17';
import case2 from './cases/case-2';
import case3 from './cases/case-3';
import case4 from './cases/case-4';
import case5 from './cases/case-5';
import case6 from './cases/case-6';
import case7 from './cases/case-7';
import case8 from './cases/case-8';
import case9 from './cases/case-9';

export interface TestCase {
  in: {
    sell: Order[];
    buy: Order[];
    exchangeConfig: ExchangeConfig;
    newOrder: Order;
  };
  out: {
    newDeals: Deal[];
    affectedOrders: Order[];
    sell: Order[];
    buy: Order[];
  };
}

describe('Market depth matching', function () {
  function runTest(testCase: TestCase) {
    return function () {
      const marketDepth = new MarketDepth();
      marketDepth.sell = testCase.in.sell;
      marketDepth.buy = testCase.in.buy;

      const { newDeals, affectedOrders } = match(marketDepth, testCase.in.newOrder, testCase.in.exchangeConfig);

      // console.log('After match');
      // console.log('Sell', marketDepth.sell.map(ordersModel.entityToRow));
      // console.log('Buy', marketDepth.buy.map(ordersModel.entityToRow));

      // console.log('new deals', newDeals.map(dealsModel.entityToRow));
      // console.log('affected orders', affectedOrders.map(ordersModel.entityToRow));

      const pickDealFields = ['buyer_amount_in_cur1', 'seller_amount_in_cur2', 'cur1', 'cur2', 'buyer_fee_in_cur1', 'seller_fee_in_cur2', 'rate'];
      assert.deepEqual(
        newDeals.map((deal) => _pick(deal, pickDealFields)),
        testCase.out.newDeals.map((deal) => _pick(deal, pickDealFields))
      );
      assert.deepEqual(affectedOrders, testCase.out.affectedOrders);
      assert.deepEqual(marketDepth.sell, testCase.out.sell);
      assert.deepEqual(marketDepth.buy, testCase.out.buy);
    };
  }

  it('1 new sell order in empty glass', runTest(case1));
  it('1 new buy order in empty glass', runTest(case2));
  describe('have 3 sell and 3 buy orders', function () {
    describe('add 1 new non-matching sell order', function () {
      it('in the beginning', runTest(case3));
      it('in the end', runTest(case4));
      it('in the middle', runTest(case5));
      it('in the middle with same rate and different date', runTest(case6));
    });
    describe('add 1 new non-matching buy order', function () {
      it('in the beginning', runTest(case7));
      it('in the end', runTest(case8));
      it('in the middle', runTest(case9));
      it('in the middle with same rate and different date', runTest(case10));
    });
  });
  describe('match', function () {
    it('1 exist sell order (rate 1) with new buy order (rate 1)', runTest(case11));
    it('3 exist sell orders, 3 exist buy orders, with 1 new buy order, 2 sell orders shall be done', runTest(case12));
    it('3 exist sell orders, 3 exist buy orders, with 1 new sell order, 2 buy orders shall be done', runTest(case13));
    it('3 exist sell orders, 3 exist buy orders, with 1 new buy order, 2 sell order shall be done, new order shall be set first in buy orders', runTest(case14));
    it('3 exist sell orders, 3 exist buy orders, with 1 new buy order, 2 buy order shall be done, new order shall be set last in sell orders', runTest(case15));
  });
  it('big numbers, 1 exist sell order (rate 1000) with new buy order (rate 1000)', runTest(case16));
  it('fixed comission', runTest(case17));
});
