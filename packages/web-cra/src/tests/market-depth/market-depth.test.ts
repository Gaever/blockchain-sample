// organize-imports-ignore

import { getVisibleMarketDepthRows, findRangeDown, findRangeUp } from "../../containers/market-depth";
import { assert } from "chai";
import * as case1 from "./cases/case-1";
import * as case2 from "./cases/case-2";
import * as case3 from "./cases/case-3";
import * as case4 from "./cases/case-4";
import * as case5 from "./cases/case-5";
import * as case6 from "./cases/case-6";
import * as case7 from "./cases/case-7";
import * as case8 from "./cases/case-8";
import * as case9 from "./cases/case-9";
import * as case10 from "./cases/case-10";
import * as case11 from "./cases/case-11";
import * as case12 from "./cases/case-12";
import * as case13 from "./cases/case-13";
import * as case14 from "./cases/case-14";
import * as case15 from "./cases/case-15";
import * as case16 from "./cases/case-16";
import * as case17 from "./cases/case-17";
import * as case18 from "./cases/case-18";
import * as case19 from "./cases/case-19";
import * as case20 from "./cases/case-20";
import * as case21 from "./cases/case-21";
import * as case22 from "./cases/case-22";
import * as case23 from "./cases/case-23";
import * as case24 from "./cases/case-24";
import * as case25 from "./cases/case-25";
import BigNumber from "bignumber.js";

describe("Market depth front", function () {
  function runTest(testCase) {
    return function () {
      const result = getVisibleMarketDepthRows(
        testCase._in.orders,
        testCase._in.rates,
        testCase._in.lastPrice,
        testCase._in.zoomFactor,
        testCase._in.visibleRowsPerHalf,
        testCase._in?.scrollOffsetTop,
        testCase._in?.scrollOffsetBottom
      );
      // console.log(result);
      assert.deepEqual(result, testCase._out);
    };
  }
  describe("Stock is just open.", function () {
    it("Has no orders and no last price. Stock is just open.", runTest(case1));
  });

  describe("Have no orders and have last price.", function () {
    it("Last price > first rate", runTest(case2));
    it("Last price = first rate", runTest(case3));
    it("Last price < last rate", runTest(case4));
    it("Last price = last rate", runTest(case5));
    describe("Last price between first and last rate", function () {
      it("last price equals one of rate", runTest(case6));
      it("last price not equals one of rate", runTest(case7));
      it("visible top is partially filled", runTest(case8));
      it("visible bottom is partially filled", runTest(case9));
    });
  });

  describe("Have orders", function () {
    it("one order for sale", runTest(case10));
    it("one order for buy", runTest(case11));
    it("one order for sale and one for buy", runTest(case12));
    it("many orders (yet have empty rows)", runTest(case13));
    it("many orders in top (yet have empty rows)", runTest(case14));
    it("many orders in bottom (yet have empty rows)", runTest(case15));
    it("many orders (no empty rows)", runTest(case16));
    it("sell order for max price and buy order for min price", runTest(case17));
  });

  describe("Aggregate", function () {
    describe("find range", function () {
      const rates = ["2", "1.8", "1.6", "1.4", "1.2", "1", "0.8", "0.6", "0.4", "0.2"];

      it("down 1", function () {
        const result = findRangeDown(0, rates, "2");
        assert.deepEqual(result, [new BigNumber("2"), new BigNumber("1.8"), 1]);
      });
      it("down 2", function () {
        const result = findRangeDown(0, rates, "0.2");
        assert.deepEqual(result, [new BigNumber("0.4"), new BigNumber("0.2"), 9]);
      });
      it("down 3", function () {
        const result = findRangeDown(0, rates, "1.3");
        assert.deepEqual(result, [new BigNumber("1.4"), new BigNumber("1.2"), 4]);
      });
      it("down 4", function () {
        const result1 = findRangeDown(0, rates, "2");
        assert.deepEqual(result1, [new BigNumber("2"), new BigNumber("1.8"), 1]);
        const result2 = findRangeDown(result1[2], rates, "1.3");
        assert.deepEqual(result2, [new BigNumber("1.4"), new BigNumber("1.2"), 4]);
        const result3 = findRangeDown(result2[2], rates, "0.2");
        assert.deepEqual(result3, [new BigNumber("0.4"), new BigNumber("0.2"), 9]);
      });

      it("up 1", function () {
        const result = findRangeUp(9, rates, "0.2");
        assert.deepEqual(result, [new BigNumber("0.4"), new BigNumber("0.2"), 8]);
      });
      it("up 2", function () {
        const result = findRangeUp(9, rates, "2");
        assert.deepEqual(result, [new BigNumber("2"), new BigNumber("1.8"), 0]);
      });
      it("up 3", function () {
        const result = findRangeUp(9, rates, "1.3");
        assert.deepEqual(result, [new BigNumber("1.4"), new BigNumber("1.2"), 3]);
      });
      it("up 4", function () {
        const result1 = findRangeUp(9, rates, "0.2");
        assert.deepEqual(result1, [new BigNumber("0.4"), new BigNumber("0.2"), 8]);
        const result2 = findRangeUp(result1[2], rates, "1.3");
        assert.deepEqual(result2, [new BigNumber("1.4"), new BigNumber("1.2"), 3]);
        const result3 = findRangeUp(result2[2], rates, "2");
        assert.deepEqual(result3, [new BigNumber("2"), new BigNumber("1.8"), 0]);
      });
    });

    describe("having no orders", function () {
      it("stock is just open (no last price), zf = 1", runTest(case18));
      it("zf = 2", runTest(case19));
      it("zf = 3", runTest(case20));
      it("zf = 100", runTest(case21));
    });

    describe("having orders", function () {
      it("zf = 2", runTest(case22));
      it("zf = 3", runTest(case23));
      it("zf = 100", runTest(case24));
    });

    describe("scroll", function () {
      it("top + 1", runTest(case25));
    });
  });
});
