import { ExchangeCalcResult } from "@/types";
import { coinsToMojos, mojo1ToMojo2, mojosToCoins } from "@ctocker/lib/build/main/src/services/lookup/matcher";
import { AddressConfig, currency, Fee } from "@ctocker/lib/build/main/src/types/stock";
import BigNumber from "bignumber.js";

export function pickTargetCur(sendCur: currency, rootCur: currency, minorCur: currency): currency {
  if (sendCur === rootCur) return minorCur;
  return rootCur;
}

function feeEntityToAmountInMojos(amountInMojo: BigNumber, feeEntity: Fee): BigNumber {
  let feeAmount = new BigNumber(0);

  if (!!feeEntity.percent && feeEntity.percent !== "0") {
    feeAmount = amountInMojo.multipliedBy(new BigNumber(feeEntity.percent)).integerValue(BigNumber.ROUND_UP);
  } else if (!!feeEntity.fixed && feeEntity.fixed !== "0") {
    feeAmount = new BigNumber(feeEntity.fixed);
  }

  if (feeAmount.lt(0)) feeAmount = new BigNumber(0);

  return feeAmount;
}

function secondsToString(seconds: number) {
  const numyears = Math.floor(seconds / 31536000);
  const numdays = Math.floor((seconds % 31536000) / 86400);
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

  const strArr: string[] = [];

  if (numyears && numyears >= 1) strArr.push(`${numyears} years`);
  if (numdays && numdays >= 1) strArr.push(`${numdays} days`);
  if (numhours && numhours >= 1) strArr.push(`${numhours} hours`);
  if (numminutes && numminutes >= 1) strArr.push(`${numminutes} minutes`);
  if (numseconds && numseconds >= 1) strArr.push(`${numseconds} seconds`);

  return strArr.join(" ").trimEnd();
}

function msToSeconds(ms: string) {
  if (!ms || isNaN(Number(ms)) || ms === "0") return 0;
  return Math.floor(Number(ms) / 1000);
}

export function toCoins(amountInMojos: BigNumber, mojosInCoin: BigNumber, roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_FLOOR): BigNumber {
  const decimalPlaces = mojosInCoin.toString().length - 1;
  return mojosToCoins(amountInMojos, mojosInCoin).dp(decimalPlaces, roundingMode).sd(10, BigNumber.ROUND_HALF_CEIL);
}

export function doExchangeCalc(props: {
  sendCur: currency | undefined;
  sendAmountInSendCurCoins: string | undefined;
  addressConfig: AddressConfig | undefined;
  mojosInRootCurCoin: BigNumber | undefined;
  mojosInMinorCurCoin: BigNumber | undefined;
}): ExchangeCalcResult | null {
  if (!props.sendCur || !props.addressConfig || !props.sendAmountInSendCurCoins || !props.mojosInMinorCurCoin || !props.mojosInRootCurCoin) {
    return null;
  }

  const rootCur = props.addressConfig.cur1;
  const minorCur = props.addressConfig.cur2;
  const sendCur = props.sendCur;
  const targetCur = pickTargetCur(sendCur, rootCur, minorCur);

  if (!props?.addressConfig?.stockConfig?.[sendCur] || !props?.addressConfig?.stockConfig?.[targetCur]) {
    return null;
  }

  const rate = new BigNumber(props.addressConfig.rate);
  const sendCurFees = props.addressConfig.stockConfig[sendCur]!.fees;
  const targetCurFees = props.addressConfig.stockConfig[targetCur]!.fees;

  const mojosInSendCurCoin = props?.sendCur === rootCur ? props.mojosInRootCurCoin : props.mojosInMinorCurCoin;
  const mojosInTargetCurCoin = props?.sendCur === rootCur ? props.mojosInMinorCurCoin : props.mojosInRootCurCoin;

  const minSendAmountInSendCurCoins = toCoins(new BigNumber(props.addressConfig.stockConfig[sendCur]!.minInAmountFixed), mojosInSendCurCoin);

  const sendAmountInSendCurMojos = coinsToMojos(new BigNumber(props.sendAmountInSendCurCoins), mojosInSendCurCoin);
  let payoutAmountInTargetCurMojos: BigNumber = new BigNumber(0);

  if (targetCur === rootCur) {
    payoutAmountInTargetCurMojos = mojo1ToMojo2(sendAmountInSendCurMojos, mojosInSendCurCoin, mojosInTargetCurCoin).dividedBy(rate).integerValue(BigNumber.ROUND_FLOOR);
  } else {
    payoutAmountInTargetCurMojos = mojo1ToMojo2(sendAmountInSendCurMojos, mojosInSendCurCoin, mojosInTargetCurCoin).multipliedBy(rate).integerValue(BigNumber.ROUND_FLOOR);
  }

  const payoutBlockchainFeeInTargetCurMojos = new BigNumber(targetCurFees.transactionFee);

  const makerStockFeeInPercent = Number(targetCurFees.makerFee.percent) || 0;
  const makerStockFeeInTargetCurMojos = feeEntityToAmountInMojos(payoutAmountInTargetCurMojos, targetCurFees.makerFee);
  const makerPayoutInTargetCurMojos = payoutAmountInTargetCurMojos.minus(makerStockFeeInTargetCurMojos).minus(payoutBlockchainFeeInTargetCurMojos);

  const takerStockFeeInPercent = Number(targetCurFees.takerFee.percent) || 0;
  const takerStockFeeInTargetCurMojos = feeEntityToAmountInMojos(payoutAmountInTargetCurMojos, targetCurFees.takerFee);
  const takerPayoutInTargetCurMojos = payoutAmountInTargetCurMojos.minus(takerStockFeeInTargetCurMojos).minus(payoutBlockchainFeeInTargetCurMojos);

  const refundBlockchainFeeInSendCurMojos = new BigNumber(sendCurFees.transactionFee);
  const refundStockFeeInInPercent = Number(sendCurFees.paybackFee.percent) || 0;
  const refundStockFeeInSendCurMojos = feeEntityToAmountInMojos(sendAmountInSendCurMojos, sendCurFees.paybackFee);
  const refundAmountInSendCurInMojos = sendAmountInSendCurMojos.minus(refundStockFeeInSendCurMojos).minus(refundBlockchainFeeInSendCurMojos);

  const payoutBlockchainFeeInTargetCurCoins = toCoins(payoutBlockchainFeeInTargetCurMojos, mojosInTargetCurCoin);
  const refundBlockchainFeeInSendCurCoins = toCoins(refundBlockchainFeeInSendCurMojos, mojosInSendCurCoin);

  const takerStockFeeInTargetCurCoins = toCoins(takerStockFeeInTargetCurMojos, mojosInTargetCurCoin);
  const makerStockFeeInTargetCurCoins = toCoins(makerStockFeeInTargetCurMojos, mojosInTargetCurCoin);
  const refundStockFeeInSendCurCoins = toCoins(refundStockFeeInSendCurMojos, mojosInSendCurCoin);
  const payoutAmountInTargetCurCoins = toCoins(payoutAmountInTargetCurMojos, mojosInTargetCurCoin);

  const makerPayoutInTargetCurCoins = toCoins(makerPayoutInTargetCurMojos, mojosInTargetCurCoin);
  const takerPayoutInTargetCurCoins = toCoins(takerPayoutInTargetCurMojos, mojosInTargetCurCoin);
  const refundAmountInSendCurInCoins = toCoins(refundAmountInSendCurInMojos, mojosInSendCurCoin);

  const expiresIn = secondsToString(msToSeconds(props.addressConfig.stockConfig[sendCur]!.orderLifetimeMs));

  return {
    minSendAmountInSendCurCoins: minSendAmountInSendCurCoins.toString(),
    payoutBlockchainFeeInTargetCurCoins: payoutBlockchainFeeInTargetCurCoins.toString(),

    payoutAmountInTargetCurMojos: payoutAmountInTargetCurMojos.toString(),
    payoutAmountInTargetCurCoins: payoutAmountInTargetCurCoins.toString(),

    makerStockFeeInPercent,
    makerStockFeeInTargetCurCoins: makerStockFeeInTargetCurCoins.toString(),
    makerPayoutInTargetCurCoins: makerPayoutInTargetCurCoins.toString(),

    takerStockFeeInPercent,
    takerStockFeeInTargetCurCoins: takerStockFeeInTargetCurCoins.toString(),
    takerPayoutInTargetCurCoins: takerPayoutInTargetCurCoins.toString(),

    refundBlockchainFeeInSendCurCoins: refundBlockchainFeeInSendCurCoins.toString(),
    refundStockFeeInInPercent,
    refundStockFeeInSendCurCoins: refundStockFeeInSendCurCoins.toString(),
    refundAmountInSendCurInCoins: refundAmountInSendCurInCoins.toString(),

    expiresIn,

    sendCur,
    targetCur,
    mojosInSendCurCoin: mojosInSendCurCoin.toString(),
  };
}
