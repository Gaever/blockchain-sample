import { AddressConfig } from "@ctocker/lib/build/main/src/types/stock";
import BigNumber from "bignumber.js";
import { TestCase } from "../exchange-calc.test";

const addressConfig: AddressConfig = {
  address: "xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqslaehr3",
  cur1: "ach",
  cur2: "xch",
  rate: "1",
  stockId: 1,
  stockConfig: {
    ach: {
      minInAmountFixed: "10",
      orderLifetimeMs: "600000",
      fees: {
        makerFee: {
          fixed: "0",
          percent: "0.01",
        },
        takerFee: {
          fixed: "0",
          percent: "0.02",
        },
        paybackFee: {
          fixed: "0",
          percent: "0.001",
        },
        transactionFee: "0",
      },
    },
    xch: {
      minInAmountFixed: "10000",
      orderLifetimeMs: "600000",
      fees: {
        makerFee: {
          fixed: "0",
          percent: "0.01",
        },
        takerFee: {
          fixed: "0",
          percent: "0.02",
        },
        paybackFee: {
          fixed: "0",
          percent: "0.001",
        },
        transactionFee: "0",
      },
    },
  },
};
const testCase: TestCase = {
  in: {
    sendCur: "xch",
    sendAmountInSendCurCoins: "1000.00000006",
    addressConfig,
    mojosInRootCurCoin: new BigNumber("1000000000"),
    mojosInMinorCurCoin: new BigNumber("1000000000000"),
  },
  out: {
    minSendAmountInSendCurCoins: "0.00000001",

    payoutBlockchainFeeInTargetCurCoins: "0",

    makerStockFeeInPercent: 0.01,
    makerStockFeeInTargetCurCoins: "10",
    makerPayoutInTargetCurCoins: "990.0000001",

    takerStockFeeInPercent: 0.02,
    takerStockFeeInTargetCurCoins: "20",
    takerPayoutInTargetCurCoins: "980.0000001",

    refundBlockchainFeeInSendCurCoins: "0",
    refundStockFeeInInPercent: 0.001,
    refundStockFeeInSendCurCoins: "1",
    refundAmountInSendCurInCoins: "999.0000001",

    expiresIn: "10 minutes",

    sendCur: "xch",
    targetCur: "ach",
  },
};
export default testCase;
