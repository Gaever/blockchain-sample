import { ordersToAggregatedMarketDepth } from '@/websocket/chart-data/aggregated-market-depth';
import { assert } from 'chai';
import case1 from './cases/case-1';
import case10 from './cases/case-10';
import case11 from './cases/case-11';
import case12 from './cases/case-12';
import case13 from './cases/case-13';
import case14 from './cases/case-14';
import case15 from './cases/case-15';
import case16 from './cases/case-16';
import case17 from './cases/case-17';
import case18 from './cases/case-18';
import case19 from './cases/case-19';
import case2 from './cases/case-2';
import case20 from './cases/case-20';
import case21 from './cases/case-21';
import case22 from './cases/case-22';
import case23 from './cases/case-23';
import case3 from './cases/case-3';
import case4 from './cases/case-4';
import case5 from './cases/case-5';
import case6 from './cases/case-6';
import case7 from './cases/case-7';
import case8 from './cases/case-8';
import case9 from './cases/case-9';

export interface TestCase {
  in: Parameters<typeof ordersToAggregatedMarketDepth>;
  out: ReturnType<typeof ordersToAggregatedMarketDepth>;
}

describe('orderToAggregatedMarketDepth', function () {
  function runTest(testCase: TestCase) {
    return function () {
      const result = ordersToAggregatedMarketDepth(...testCase.in);

      // console.log(result);

      assert.deepEqual(result.marketDepth, testCase.out.marketDepth);
      assert.strictEqual(result.maxBuyRate, testCase.out.maxBuyRate);
      assert.strictEqual(result.minSellRate, testCase.out.minSellRate);
      assert.strictEqual(result.maxRatePrecision, testCase.out.maxRatePrecision);
    };
  }

  describe('unflipped', function () {
    it('no orders', runTest(case1));
    it('1 sell order', runTest(case2));
    it('1 buy order', runTest(case3));
    it('2 sell orders with same rate', runTest(case4));
    it('2 buy orders with same rate', runTest(case5));
    it('1 sell order with rate 1 and 1 sell order with rate 2', runTest(case6));
    it('1 buy order with rate 1 and 1 buy order with rate 3', runTest(case7));
    it('3 sell orders rate 3, 3 sell orders rate 2, 3 sell orders rate 1', runTest(case8));
    it('3 buy orders rate 3, 3 buy orders rate 2, 3 buy orders rate 1', runTest(case9));
    it('buy and sell orders', runTest(case10));
    it('sell order mojos less then buy order mojos in coin', runTest(case11));
    it('sell mojos in coin > buy mojos in coin', runTest(case12));
  });

  describe('flipped', function () {
    it('1 sell order', runTest(case13));
    it('1 buy order', runTest(case14));
    it('2 sell orders with same rate', runTest(case15));
    it('2 buy orders with same rate', runTest(case16));
    it('1 sell order with rate 1 and 1 sell order with rate 2', runTest(case17));
    it('1 buy order with rate 1 and 1 buy order with rate 3', runTest(case18));
    it('3 sell orders rate 3, 3 sell orders rate 2, 3 sell orders rate 1', runTest(case19));
    it('3 buy orders rate 3, 3 buy orders rate 2, 3 buy orders rate 1', runTest(case20));
    it('buy and sell orders', runTest(case21));
    it('sell order mojos less then buy order mojos in coin', runTest(case22));
    it('sell mojos in coin > buy mojos in coin', runTest(case23));
  });
});
