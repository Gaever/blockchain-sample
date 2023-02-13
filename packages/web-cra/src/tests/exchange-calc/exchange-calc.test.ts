// organize-imports-ignore

import { assert } from "chai";
import { doExchangeCalc } from "../../containers/exchange-calc/exchange-calc-functions";
import _omit from "lodash/omit";
import case1 from "./cases/case-1";
import case2 from "./cases/case-2";
import case3 from "./cases/case-3";
import case4 from "./cases/case-4";
import case5 from "./cases/case-5";
import case6 from "./cases/case-6";

export interface TestCase {
  in: Parameters<typeof doExchangeCalc>[0];
  out: Omit<ReturnType<typeof doExchangeCalc>, "mojosInSendCurCoin">;
}

describe("useFees", function () {
  function runTest(testCase: TestCase) {
    return function () {
      const result = doExchangeCalc(testCase.in);
      assert.deepEqual(_omit(result, ["mojosInSendCurCoin"]), testCase.out);
    };
  }

  describe("maker fee 1%, taker fee 2%, refund fee 0.1%, no transaction fees", function () {
    it("send 0.0000001  ach (100 mojo)        rate 1,             maker get 0.000000099 xch (99 000 mojo),  taker get 0.000000098 xch (98 000 mojo)", runTest(case1));
    it("send 0.0000001  xch (100 000 mojo)    rate 1,             maker get 0.000000099 ach (99 mojo),      taker get 0.000000098 ach (98 mojo)", runTest(case2));
    it("send 0.000001   xch (1 000 000 mojo)  rate 0.3333333333,  maker get 0.000000329 ach (329 mojo),     taker get 0.000000326 ach (326 mojo)", runTest(case3));
  });
  describe("ach maker fee 100 mojo, ach taker fee 200 mojo, xch maker fee 100 000 mojo xch maker fee 200 000 mojo, ach refund fee 10 mojo, xch refund fee 10 000 mojo, no transaction fees", function () {
    it("send 0.00001    ach (10 000 mojo),    rate 1,             maker get 0.0000099 xch (9 900 000 mojo), taker get 0.0000098 xch (9 800 000 mojo)", runTest(case4));
  });
  describe("maker fee 1%, taker fee 2%, refund fee 0.1%, ach transaction fee 100 mojo, xch transaction fee 100 mojo", function () {
    it("send 0.000001  ach (1000 mojo),       rate 1,             maker get 0.0000009899 xch (989 900 mojo), taker get 0.0000009799 xch (979 900 mojo)", runTest(case5));
  });
  describe("Significant digits and decimal places", function () {
    it("send 1000,00000006 xch", runTest(case6));
  });
});
