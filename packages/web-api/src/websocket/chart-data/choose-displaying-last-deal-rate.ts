import { getMaxRatePresicion } from './aggregated-market-depth';

export function chooseDisplayingLastDealRate(
  aggregatedMarketDepthLength: number,
  minSellRate: string | undefined,
  maxBuyRate: string | undefined,
  lastDealRate: string | undefined,
) {
  const hasSellOrders = minSellRate !== undefined;
  const hasBuyOrders = maxBuyRate !== undefined;

  if (lastDealRate && lastDealRate !== '0') {
    // Хотя бы одна сделка была совершена.
    return lastDealRate;
  }

  if (aggregatedMarketDepthLength === 0 && !lastDealRate) {
    // Сейчас нет ордеров и никогда не было сделок
    return '1';
  }
  if (aggregatedMarketDepthLength > 0 && !lastDealRate && hasSellOrders && !hasBuyOrders) {
    // Есть ордер(а) и никогда не было сделок. Все ордера на продажу.
    return minSellRate;
  }
  if (aggregatedMarketDepthLength > 0 && !lastDealRate && hasBuyOrders && !hasSellOrders) {
    // Есть ордер(а) и никогда не было сделок. Все ордера на покупку.
    return maxBuyRate;
  }
  if (aggregatedMarketDepthLength > 0 && !lastDealRate && hasSellOrders && hasBuyOrders) {
    // Есть ордер(а) и никогда не было сделок. Ордера и на покупку и на продажу.
    return minSellRate;
  }

  throw new Error(
    `Can not choose last deal rate. Input: ${JSON.stringify({
      aggregatedMarketDepthLength,
      hasSellOrders,
      hasBuyOrders,
      minSellRate,
      maxBuyRate,
      lastDealRate,
    })}`,
  );
}

export function choosePricePrecision(marketDepthLength: number, maxRatePrecisionAfterAggregate: number, lastDealRate: string): number {
  if (marketDepthLength > 0) return maxRatePrecisionAfterAggregate;
  return getMaxRatePresicion(maxRatePrecisionAfterAggregate, lastDealRate);
}
