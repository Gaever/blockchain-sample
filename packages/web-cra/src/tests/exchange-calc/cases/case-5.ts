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
        transactionFee: "100",
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
        transactionFee: "100",
      },
    },
  },
};
const testCase: TestCase = {
  in: {
    sendCur: "ach",
    sendAmountInSendCurCoins: "0.000001",
    addressConfig,
    mojosInRootCurCoin: new BigNumber("1000000000"),
    mojosInMinorCurCoin: new BigNumber("1000000000000"),
  },
  out: {
    minSendAmountInSendCurCoins: "0.00000001",

    payoutBlockchainFeeInTargetCurCoins: "0.0000000001",

    makerStockFeeInPercent: 0.01,
    makerStockFeeInTargetCurCoins: "0.00000001",
    makerPayoutInTargetCurCoins: "0.0000009899",

    takerStockFeeInPercent: 0.02,
    takerStockFeeInTargetCurCoins: "0.00000002",
    takerPayoutInTargetCurCoins: "0.0000009799",

    refundBlockchainFeeInSendCurCoins: "0.0000001",
    refundStockFeeInInPercent: 0.001,
    refundStockFeeInSendCurCoins: "0.000000001",
    refundAmountInSendCurInCoins: "0.000000899",

    expiresIn: "10 minutes",

    sendCur: "ach",
    targetCur: "xch",
  },
};
export default testCase;
