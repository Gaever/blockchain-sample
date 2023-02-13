import { log } from '@/log';
import dealsModel from '@/models/deals.model';
import incomeModel from '@/models/income.model';
import ordersModel from '@/models/orders.model';
import outcomeModel from '@/models/outcome.model';
import Stock from '@/services/stock';
import { ExchangeConfig, Income, Match, Order, Outcome } from '@/types/stock';
import autoBind from 'auto-bind';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import { formatDeal, formatOrder, formatOutcome } from '../report/report-formats';

class BrokerMatch {
  public stock: Stock;

  constructor() {
    autoBind(this);
  }

  public init(config: ExchangeConfig) {
    this.stock = new Stock(config);
  }

  public async saveNewIncomesToOrders(newIncomes: Income[], trx: Knex.Transaction): Promise<Order[]> {
    log.debug('saveNewIncomesToOrders call');
    const newOrders = newIncomes.map(this.stock.incomeToOrder);
    log.info('%s new orders', newOrders.length);

    if (process.env.LOG_LEVEL === 'debug') {
      log.debug('new incomes: %O', JSON.stringify(newIncomes.map(incomeModel.entityToRow)));
      log.debug('new orders: %O', JSON.stringify(newOrders.map(ordersModel.entityToRow)));
    }

    const savedOrders = await ordersModel.add(newOrders, trx);
    savedOrders.forEach((order) => {
      log.info('saved order %O', formatOrder(ordersModel.entityToRow(order)));
    });

    for (const income of newIncomes) {
      income.status = 'proceded';
      await incomeModel.update(income.id, income, trx);
    }

    if (this.stock.testCoinResult) {
      const [testOrder, testDeal] = this.stock.testCoinResult;
      const savedOrder = (await ordersModel.add([testOrder], trx))[0];
      testDeal.buyer_order_id = savedOrder.id;
      testDeal.seller_order_id = savedOrder.id;
      testDeal.taker_order_id = savedOrder.id;
      const savedDeal = (await dealsModel.add([testDeal], trx))[0];

      log.info('*** TEST COIN: TEST ORDER ANR TEST DEAL ARE SAVED *** %O %O', formatOrder(ordersModel.entityToRow(savedOrder)), formatDeal(dealsModel.entityToRow(savedDeal)));
    }

    return newOrders;
  }

  public async match(newOrders: Order[], existOrders: Order[], trx: Knex.Transaction) {
    this.stock.setMarketDepth(existOrders);

    log.info('proceed %s new orders; %s orders in glass', newOrders.length, existOrders.length);

    for (const newOrder of newOrders) {
      await this.saveOneNewOrderMatch(newOrder, trx);
    }
  }

  protected async saveOneNewOrderMatch(newOrder: Order, trx: Knex.Transaction): Promise<Match> {
    const match = this.stock.matchNewOrder(newOrder);
    for (const order of match.affectedOrders) {
      await ordersModel.update(order.id, order, trx);
      log.info('Order after match %O', formatOrder(ordersModel.entityToRow(order), true));
    }
    (await dealsModel.add(match.newDeals, trx)).forEach((deal) => {
      log.info('Saved new deal %O', formatDeal(dealsModel.entityToRow(deal)));
    });
    log.info('match result for new order id %s: \n  - %s new deals \n  - %s affected orders', newOrder.id, match.newDeals.length, match.affectedOrders.length);

    return match;
  }

  // Устанавливает статус просроченным ордерам в базе на expired и возвращает непросроченные ордера
  public async expireStaleOrders(orders: Order[], trx: Knex.Transaction): Promise<Order[]> {
    log.debug('expireStaleOrders call');

    const { expiredOrders, freshOrders } = Stock.expireOrders(orders);
    const expiredOrdersIds: number[] = expiredOrders.map((order) => {
      log.info('Expired order %O', formatOrder(ordersModel.entityToRow(order), true));
      return order.id;
    });

    if (expiredOrdersIds.length > 0) {
      await ordersModel.setExpired(expiredOrdersIds, trx);
    }

    log.info('%s stale orders set as expired', expiredOrdersIds.length);

    return freshOrders;
  }

  public async processTestIncome(income: Income, trx: Knex.Transaction) {
    const testDeal = await trx(dealsModel.tableName).where({ id: 0 });
    if (testDeal?.length < 1) {
      await trx(dealsModel.tableName).insert({ id: 0, stock_id: 0 });
    }
    const testOutcome: Outcome = {
      amount: new BigNumber(income.amount),
      client_puzzle_hash: income.client_puzzle_hash,
      created_at: new Date(),
      cur: income.cur,
      status: 'created',
      stock_id: 0,
      transaction_fee: new BigNumber('0'),
      deal_id: 0,
    };
    const savedOutcome = (await outcomeModel.add([testOutcome], trx))?.[0];
    log.info('saved test coin outcome %O', formatOutcome(outcomeModel.entityToRow(savedOutcome)));
  }
}

export default BrokerMatch;
