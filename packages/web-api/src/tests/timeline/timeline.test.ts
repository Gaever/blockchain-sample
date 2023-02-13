// organize-imports-ignore

import { assert } from 'chai';
import { createTimeline } from '@/websocket/chart-data/timeline';
import case1 from './cases/case-1';
import case2 from './cases/case-2';
import case3 from './cases/case-3';
import case4 from './cases/case-4';

import case5 from './cases/case-8';
import case6 from './cases/case-6';
import case7 from './cases/case-7';
import case8 from './cases/case-8';

import case9 from './cases/case-9';
import case10 from './cases/case-10';
import case11 from './cases/case-11';

import case12 from './cases/case-12';
import case13 from './cases/case-13';

import case14 from './cases/case-14';

import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

export interface TestCase {
  in: Parameters<typeof createTimeline>[0];
  out: Omit<ReturnType<typeof createTimeline>, 'candlesPricePrecision'>;
}

describe('timeline', function () {
  function runTest(testCase: TestCase) {
    return function () {
      const result = createTimeline(testCase.in);

      // console.log('candles length\t', result.candles.length);
      // console.log('candles start date\t', new Date(+result.candles[0].time * 1000));
      // console.log('candles end date\t', new Date(+result.candles[result.candles.length - 1].time * 1000));
      // console.log('candles start item\t', result.candles[0]);
      // console.log('candles end item\t', result.candles[result.candles.length - 1]);
      // console.log('candles diff ts\t', +result.candles[result.candles.length - 1].time - +result.candles[0].time);
      // console.log('volume length\t', result.volume.length);
      // console.log('volume end item\t', result.volume[result.volume.length - 1]);
      // console.log('volume slice\t', [result.volume[259], result.volume[260]]);

      // result.candles.forEach((item, index) => {
      //   const out = testCase.out.candles[index];
      //   assert.deepEqual(item, out, JSON.stringify({ item, out, index }, null, 2));
      // });

      // result.volume.forEach((item, index) => {
      //   const out = testCase.out.volume[index];
      //   assert.deepEqual(item, out, JSON.stringify({ item, out, index }, null, 2));
      // });

      assert.sameDeepMembers(result.candles, testCase.out.candles);
      assert.sameDeepMembers(result.volume, testCase.out.volume);
    };
  }

  describe('empty timeline', function () {
    it('1min', runTest(case1));
    it('1h', runTest(case2));
    it('1d', runTest(case3));
    it('1w', runTest(case4));

    describe('timezoneOffset -180 (GMT+3)', function () {
      it('1min', runTest(case5));
      it('1h', runTest(case6));
      it('1d', runTest(case7));
      it('1w', runTest(case8));
    });

    describe('flip', function () {
      it('1min', runTest(_set(_cloneDeep(case5), 'in.flip', true)));
      it('1h', runTest(_set(_cloneDeep(case6), 'in.flip', true)));
      it('1d', runTest(_set(_cloneDeep(case6), 'in.flip', true)));
      it('1w', runTest(_set(_cloneDeep(case6), 'in.flip', true)));
    });
  });

  describe('timeline not empty', function () {
    it('have first deal (1min)', runTest(case9));
    it('have first deal (1w)', runTest(case10));
    it('have deal older than current interval', runTest(case11));
    it('have two deals in current interval and have no deals older than current inverval', runTest(case12));
    it('have two deals in current interval and have deal older than current inverval', runTest(case13));
    it('have two deals in current interval, flipped', runTest(case14));
  });
});
