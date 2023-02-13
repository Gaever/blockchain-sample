// organize-imports-ignore
import CtocksMatch from '@/services/ctocks-match';
import { assert } from 'chai';
import { TestCase } from './helpers';
import case1 from './cases/case-1';
import case2 from './cases/case-2';
import case3 from './cases/case-3';

describe('dealsToSeries', function () {
  function runTest(testCase: TestCase) {
    return function () {
      const result = CtocksMatch.dealsToSeries(testCase._in.deals, testCase._in.lastElements);
      assert.deepEqual(result, testCase._out);
    };
  }

  it('empty', runTest(case1));
  it('to add', runTest(case2));
  it('to update', runTest(case3));
});
