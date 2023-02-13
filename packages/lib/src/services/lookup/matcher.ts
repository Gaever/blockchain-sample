import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import { Deal, ExchangeConfig, FeeConfig, Match, Order } from '@/types/stock';
import BigNumber from 'bignumber.js';
import MarketDepth from './market-depth';

// Вернет true если новый ордер полностью реализован
export function matchOpposite(config: ExchangeConfig, newOrder: Order, oppositeOrder, newDeals: Deal[], affectedOrders: Order[], ordersToRemove: Order[]): boolean {
  const { deal, newOrderRestAmount, existOrderRestAmount } = createDeal(config, oppositeOrder, newOrder);

  newDeals.push(deal);

  oppositeOrder.amount = existOrderRestAmount;
  oppositeOrder.status = updateOrderStatus(oppositeOrder);

  newOrder.amount = newOrderRestAmount;

  affectedOrders.push(oppositeOrder);

  if (oppositeOrder.amount.lte(0)) {
    // Удаляем реализованный ордер из стакана
    ordersToRemove.push(oppositeOrder);
  }

  if (newOrder.amount.lte(0)) {
    // Новый ордер полностью реализован, выходим из цикла матчинга
    return true;
  }
  return false;
}

export function match(marketDepth: MarketDepth, newOrder: Order, config: ExchangeConfig): Match {
  const newDeals: Deal[] = [];
  const affectedOrders: Order[] = [];
  const ordersToRemove: Order[] = [];

  if (newOrder.is_sell) {
    const oppositeOrders = marketDepth.buy;
    for (let i = 0; i < oppositeOrders.length; i++) {
      const oppositeOrder = oppositeOrders[i];
      if (oppositeOrder.rate.lt(newOrder.rate)) {
        break;
      }
      const shallBreak = matchOpposite(config, newOrder, oppositeOrder, newDeals, affectedOrders, ordersToRemove);

      if (shallBreak) {
        break;
      }
    }

    ordersToRemove.forEach((order) => {
      oppositeOrders.splice(oppositeOrders.indexOf(order), 1);
    });

    newOrder.status = updateOrderStatus(newOrder);

    if (newOrder.status !== 'done') {
      pushNewOrder(marketDepth.sell, newOrder);
    }
  } else {
    const oppositeOrders = marketDepth.sell;
    for (let i = oppositeOrders.length - 1; i >= 0; i--) {
      const oppositeOrder = oppositeOrders[i];
      if (oppositeOrder.rate.gt(newOrder.rate)) {
        break;
      }
      const shallBreak = matchOpposite(config, newOrder, oppositeOrder, newDeals, affectedOrders, ordersToRemove);

      if (shallBreak) {
        break;
      }
    }

    ordersToRemove.forEach((order) => {
      oppositeOrders.splice(oppositeOrders.indexOf(order), 1);
    });

    newOrder.status = updateOrderStatus(newOrder);

    if (newOrder.status !== 'done') {
      pushNewOrder(marketDepth.buy, newOrder);
    }
  }
  affectedOrders.push(newOrder);

  return { affectedOrders, newDeals };
}

export function pushNewOrder(orders: Order[], newOrder: Order) {
  for (let i = 0; i < orders.length; i++) {
    const existOrder = orders[i];

    if (existOrder.rate.gte(newOrder.rate)) {
      continue;
    }
    orders.splice(i, 0, newOrder);
    return;
  }
  orders.push(newOrder);
}

export function createDeal(
  config: ExchangeConfig,
  existOrder: Order,
  newOrder: Order
): {
  deal: Deal;
  newOrderRestAmount: BigNumber;
  existOrderRestAmount: BigNumber;
} {
  // Seller всегда имеет корневую валюту такую же, как корневая валюта биржи
  const seller = newOrder.cur1 === config.cur1 ? newOrder : existOrder;
  const buyer = seller === newOrder ? existOrder : newOrder;

  const newOrderIsSeller = seller === newOrder;
  const isSell = !newOrderIsSeller;

  const { rate, restSellerInSellerCurrency, restBuyerInBuyerCurrency, sellerPayoutInBuyerCurrency, buyerPayoutInSellerCurrency } = calcExchange(seller, buyer, newOrderIsSeller);

  const sellerFees = config[seller.cur2].fees;
  const buyerFees = config[buyer.cur2].fees;

  const newOrderRestAmount = newOrderIsSeller ? restSellerInSellerCurrency : restBuyerInBuyerCurrency;
  const existOrderRestAmount = newOrderIsSeller ? restBuyerInBuyerCurrency : restSellerInSellerCurrency;

  const deal: Deal = {
    stock_id: config.id,
    created_at: new Date(),
    seller_puzzle_hash: seller.client_puzzle_hash,
    buyer_puzzle_hash: buyer.client_puzzle_hash,
    rate1_puzzle_hash: seller.rate_puzzle_hash,
    rate2_puzzle_hash: buyer.rate_puzzle_hash,
    cur1: seller.cur1,
    cur2: buyer.cur1,
    rate,
    seller_amount_in_cur2: sellerPayoutInBuyerCurrency,
    buyer_amount_in_cur1: buyerPayoutInSellerCurrency,
    seller_fee_in_cur2: calcFeeAmount(sellerPayoutInBuyerCurrency, sellerFees, seller === newOrder),
    buyer_fee_in_cur1: calcFeeAmount(buyerPayoutInSellerCurrency, buyerFees, buyer === newOrder),
    seller_order_id: seller.id,
    buyer_order_id: buyer.id,
    taker_order_id: newOrder.id,
    is_sell: isSell,
    status: 'new',
  };

  return {
    deal,
    newOrderRestAmount,
    existOrderRestAmount,
  };
}

export function mojo1ToMojo2(amount1: BigNumber, mojoInCoin1: BigNumber, mojoInCoin2: BigNumber): BigNumber {
  return amount1.div(mojoInCoin1).multipliedBy(mojoInCoin2).integerValue(BigNumber.ROUND_FLOOR);
}

export function mojosToCoins(mojos: BigNumber, mojosInCoin: BigNumber) {
  return mojos.div(mojosInCoin);
}

export function coinsToMojos(coins: BigNumber, mojosInCoin: BigNumber) {
  return coins.multipliedBy(mojosInCoin);
}

export const precisionLimit = 10;
export const significantDigitsLimit = 10;

export function flipRate(rate: BigNumber) {
  return new BigNumber(1).div(rate).dp(precisionLimit, BigNumber.ROUND_HALF_UP);
}

export function calcExchange(
  seller: Order,
  buyer: Order,
  newOrderIsSeller: boolean
): {
  rate: BigNumber;
  restSellerInSellerCurrency: BigNumber;
  restBuyerInBuyerCurrency: BigNumber;
  sellerPayoutInBuyerCurrency: BigNumber;
  buyerPayoutInSellerCurrency: BigNumber;
} {
  const rate = newOrderIsSeller ? buyer.rate : seller.rate;
  const sellerMojoInCoin = new BigNumber(fullnodeEnviroment[seller.cur1].MOJO_IN_COIN);
  const buyerMojoInCoin = new BigNumber(fullnodeEnviroment[buyer.cur1].MOJO_IN_COIN);

  const maxAmountInBuyerCurrency = BigNumber.minimum(mojo1ToMojo2(seller.amount, sellerMojoInCoin, buyerMojoInCoin).multipliedBy(rate), buyer.amount);
  const maxAmountInSellerCurrency = maxAmountInBuyerCurrency.dividedBy(rate);

  const sellerPayoutInBuyerCurrency = maxAmountInBuyerCurrency.integerValue(BigNumber.ROUND_FLOOR);
  const buyerPayoutInSellerCurrency = mojo1ToMojo2(maxAmountInSellerCurrency, buyerMojoInCoin, sellerMojoInCoin).integerValue(BigNumber.ROUND_FLOOR);

  const restSellerInSellerCurrency = seller.amount.minus(buyerPayoutInSellerCurrency);
  const restBuyerInBuyerCurrency = buyer.amount.minus(sellerPayoutInBuyerCurrency);

  return {
    rate,
    restSellerInSellerCurrency,
    restBuyerInBuyerCurrency,
    sellerPayoutInBuyerCurrency,
    buyerPayoutInSellerCurrency,
  };
}

export function calcFeeAmount(amount: BigNumber, feeConfig: FeeConfig, isTaker: boolean): BigNumber {
  let feeAmount: BigNumber = new BigNumber(0);
  const fee = isTaker ? feeConfig.takerFee : feeConfig.makerFee;

  if (+fee.percent) {
    feeAmount = amount.multipliedBy(fee.percent).integerValue(BigNumber.ROUND_UP);
  } else if (fee.fixed && fee.fixed !== '0') {
    feeAmount = new BigNumber(fee.fixed);
  }

  if (feeAmount.lte(0)) {
    feeAmount = new BigNumber(0);
  }

  return feeAmount;
}

export function updateOrderStatus(order: Order): Order['status'] {
  let status = order.status;
  if (order.amount.gt(0) && order.amount.lt(order.start_amount)) {
    status = 'part';
  } else if (order.amount.eq(0)) {
    status = 'done';
  } else if (order.amount.eq(order.start_amount)) {
    status = 'queued';
  }
  return status;
}
