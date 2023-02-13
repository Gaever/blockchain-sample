import { TxRecord } from '@/types/blockchain';
import { AddressConfig, currency, Deal, ExchangeConfig, Income, Match, Order } from '@/types/stock';
import { puzzleHashToAddress } from '@/utils';
import autoBind from 'auto-bind';
import BigNumber from 'bignumber.js';
import _partition from 'lodash/partition';
import fullnodeEnviroment from './blockchain/fullnode-enviroment';
import MarketDepth from './lookup/market-depth';
import { match } from './lookup/matcher';

class Stock {
  public config: ExchangeConfig;
  public id: number;
  public marketDepth: MarketDepth = new MarketDepth();

  public testCoinResult: [Order, Deal];

  constructor(config: ExchangeConfig) {
    autoBind(this);
    this.config = config;
    this.id = config.id;
  }

  public static txRecordsToIncomes(txRecords: TxRecord[]): Income[] {
    return txRecords.map(this.txRecordToIncome);
  }

  public static txRecordToIncome(tx: TxRecord): Income {
    return {
      tx_id: tx?.txId,
      height: tx?.height,
      header_hash: tx?.headerHash,
      created_at: new Date(+tx?.coinRecord?.timestamp * 1000),
      client_puzzle_hash: tx?.fromPuzzleHash,
      rate_puzzle_hash: tx?.toPuzzleHash,
      cur: tx?.cur,
      amount: tx?.coinRecord?.coin?.amount,
      status: 'new',
      stock_id: tx.stock_id,
      rate: tx.rate,
    };
  }

  public incomeToOrder(income: Income): Order {
    const addressConfig = this.puzzleHashToAddressConfig(income.rate_puzzle_hash, income.cur);
    if (!addressConfig) {
      const address = puzzleHashToAddress(income.rate_puzzle_hash, income.cur);
      if (address === fullnodeEnviroment[this.config.cur1].TEST_ADDRESS_TO || address === fullnodeEnviroment[this.config.cur2].TEST_ADDRESS_TO) {
        this.processTestCoin(income);
      }

      return null;
    }

    const isSell = income.cur === this.config.cur1;

    let expiresAt = undefined;
    const orderLifetimeMs = addressConfig?.stockConfig?.[addressConfig?.cur1]?.orderLifetimeMs;
    const minInAmountFixed = addressConfig?.stockConfig?.[addressConfig?.cur1]?.minInAmountFixed;

    if (orderLifetimeMs !== undefined && orderLifetimeMs !== '0') {
      expiresAt = new Date(new Date(income.created_at).getTime() + Number(orderLifetimeMs));
    }

    return {
      created_at: income.created_at,
      expires_at: expiresAt,
      client_puzzle_hash: income.client_puzzle_hash,
      rate_puzzle_hash: income.rate_puzzle_hash,
      rate: new BigNumber(addressConfig.rate),
      is_sell: isSell,
      cur1: addressConfig.cur1,
      cur2: addressConfig.cur2,
      amount: new BigNumber(income.amount),
      start_amount: new BigNumber(income.amount),
      income_id: income.id,
      status: new BigNumber(income.amount || 0).gte(minInAmountFixed || 0) ? 'created' : 'min-amount-done',
      stock_id: this.config.id,
    };
  }

  private processTestCoin(income: Income) {
    const cur1 = income.cur;
    const cur2 = this.config.cur1 === income.cur ? this.config.cur2 : this.config.cur1;
    const order: Order = {
      created_at: income.created_at,
      expires_at: undefined,
      client_puzzle_hash: income.client_puzzle_hash,
      rate_puzzle_hash: income.rate_puzzle_hash,
      rate: new BigNumber(1),
      is_sell: false,
      cur1,
      cur2,
      amount: new BigNumber(income.amount),
      start_amount: new BigNumber(income.amount),
      income_id: income.id,
      status: 'done',
      stock_id: this.config.id,
    };

    const deal: Deal = {
      stock_id: this.config.id,
      created_at: new Date(),
      seller_puzzle_hash: income.client_puzzle_hash,
      buyer_puzzle_hash: income.client_puzzle_hash,
      rate1_puzzle_hash: income.rate_puzzle_hash,
      rate2_puzzle_hash: income.rate_puzzle_hash,
      cur1,
      cur2,
      rate: new BigNumber(1),
      seller_amount_in_cur2: new BigNumber(0),
      buyer_amount_in_cur1: new BigNumber(income.amount),
      seller_fee_in_cur2: new BigNumber(0),
      buyer_fee_in_cur1: new BigNumber(0),
      seller_order_id: undefined,
      buyer_order_id: undefined,
      taker_order_id: undefined,
      is_sell: false,
      status: 'new',
    };

    this.testCoinResult = [order, deal];
  }

  public puzzleHashToAddressConfig(puzzleHash: string, cur: currency): AddressConfig {
    const address = puzzleHashToAddress(puzzleHash, cur);

    if (address === fullnodeEnviroment[this.config.cur1].TEST_ADDRESS_TO || address === fullnodeEnviroment[this.config.cur2].TEST_ADDRESS_TO) {
      return null;
    }

    return this.addressToAddressConfig(address, this.config, cur);
  }

  private addressToAddressConfig(address: string, config: ExchangeConfig, curOfAddress: currency): AddressConfig {
    if (!config?.[curOfAddress]?.addresses?.[address]) throw new Error(`addressToAddressConfig can not find config by address: ${address}`);

    let cur1: currency;
    let cur2: currency;

    if (config?.cur1 === curOfAddress) {
      cur1 = config?.cur1;
      cur2 = config?.cur2;
    }
    if (config?.cur2 === curOfAddress) {
      cur1 = config?.cur2;
      cur2 = config?.cur1;
    }

    return {
      stockId: this.id,
      cur1,
      cur2,
      address,
      rate: config[cur1].addresses[address],
      stockConfig: {
        [cur1]: {
          fees: config[cur1].fees,
          orderLifetimeMs: config[cur1].orderLifetimeMs,
          minInAmountFixed: config[cur1].minInAmountFixed,
        },
        [cur2]: {
          fees: config[cur2].fees,
          orderLifetimeMs: config[cur2].orderLifetimeMs,
          minInAmountFixed: config[cur2].minInAmountFixed,
        },
      },
    };
  }

  public matchNewOrder(newOrder: Order): Match {
    return match(this.marketDepth, newOrder, this.config);
  }

  public setMarketDepth(sortedOrders: Order[]): void {
    const [sell, buy] = _partition(sortedOrders, (order) => order.cur1 === this.config.cur1);
    this.marketDepth.sell = sell;
    this.marketDepth.buy = buy;
  }

  public static isOrderExpired(order: Order): boolean {
    if (!order?.expires_at) return false;
    return order.expires_at.getTime?.() > 0 && order.expires_at.getTime() <= new Date().getTime();
  }

  public static expireOrders(orders: Order[]): { expiredOrders: Order[]; freshOrders: Order[] } {
    const expiredOrders: Order[] = [];
    const freshOrders: Order[] = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      if (Stock.isOrderExpired(order)) {
        expiredOrders.push({ ...order, status: 'expired' });
      } else {
        freshOrders.push(order);
      }
    }

    return { expiredOrders, freshOrders };
  }
}

export default Stock;
