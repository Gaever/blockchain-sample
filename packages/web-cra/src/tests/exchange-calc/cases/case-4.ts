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
          fixed: "100",
        },
        takerFee: {
          fixed: "200",
        },
        paybackFee: {
          fixed: "10",
        },
        transactionFee: "0",
      },
    },
    xch: {
      minInAmountFixed: "10000",
      orderLifetimeMs: "600000",
      fees: {
        makerFee: {
          fixed: "100000",
        },
        takerFee: {
          fixed: "200000",
        },
        paybackFee: {
          fixed: "10000",
        },
        transactionFee: "0",
      },
    },
  },
};
const testCase: TestCase = {
  in: {
    sendCur: "ach",
    sendAmountInSendCurCoins: "0.00001",
    addressConfig,
    mojosInRootCurCoin: new BigNumber("1000000000"),
    mojosInMinorCurCoin: new BigNumber("1000000000000"),
  },
  out: {
    minSendAmountInSendCurCoins: "0.00000001",

    payoutBlockchainFeeInTargetCurCoins: "0",

    makerStockFeeInPercent: 0,
    makerStockFeeInTargetCurCoins: "0.0000001",
    makerPayoutInTargetCurCoins: "0.0000099",

    takerStockFeeInPercent: 0,
    takerStockFeeInTargetCurCoins: "0.0000002",
    takerPayoutInTargetCurCoins: "0.0000098",

    refundBlockchainFeeInSendCurCoins: "0",
    refundStockFeeInInPercent: 0,
    refundStockFeeInSendCurCoins: "0.00000001",
    refundAmountInSendCurInCoins: "0.00000999",

    expiresIn: "10 minutes",

    sendCur: "ach",
    targetCur: "xch",
  },
};
export default testCase;
