import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import BrokerCollect from '@ctocker/lib/build/main/src/services/broker/broker-collect';
import BrokerMatch from '@ctocker/lib/build/main/src/services/broker/broker-match';
import BrokerOutcomes from '@ctocker/lib/build/main/src/services/broker/broker-outcomes';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import knex from '@ctocker/lib/build/main/src/utils/knex';

export async function getData() {
  const incomes = await knex(incomeModel.tableName)
    .select('tx_id', 'height', 'created_at', 'client_puzzle_hash', 'rate_puzzle_hash', 'cur', 'amount', 'status', 'stock_id', 'rate')
    .orderBy('created_at', 'asc');
  const orders = await knex(ordersModel.tableName)
    .select(
      'stock_id',
      'created_at',
      'expires_at',
      'amount',
      'start_amount',
      'rate',
      'is_sell',
      'cur1',
      'cur2',
      'client_puzzle_hash',
      'rate_puzzle_hash',
      'status',
    )
    .orderBy('created_at', 'asc');
  const deals = await knex(dealsModel.tableName)
    .select(
      'seller_puzzle_hash',
      'buyer_puzzle_hash',
      'rate1_puzzle_hash',
      'rate2_puzzle_hash',
      'cur1',
      'cur2',
      'seller_amount_in_cur2',
      'buyer_amount_in_cur1',
      'rate',
      'seller_fee_in_cur2',
      'buyer_fee_in_cur1',
      'seller_order_id',
      'buyer_order_id',
      'taker_order_id',
      'status',
      'stock_id',
      'is_sell',
    )
    .orderBy('created_at', 'asc');
  const outcomes = await knex(outcomeModel.tableName)
    .select(
      'tx_id',
      'height',
      'amount',
      'transaction_fee',
      'client_puzzle_hash',
      'stock_holder_puzzle_hash',
      'cur',
      'status',
      'deal_id',
      'order_id',
      'stock_id',
      'payback_fee',
    )
    .orderBy('created_at', 'asc');

  const blockchainConfig = await knex(blockchainConfigModel.tableName).select('cur', 'last_known_height', 'service_start_height');
  blockchainConfigModel.clearCache();

  return {
    incomes,
    orders,
    deals,
    outcomes,
    blockchainConfigHdd: blockchainConfig.find(item => item.cur === 'hdd'),
    blockchainConfigAch: blockchainConfig.find(item => item.cur === 'ach'),
  };
}

export async function addStockConfig(stockConfigRecord: StockConfigRecord) {
  const stockId = (await knex(stockConfigModel.tableName).insert(stockConfigRecord).returning('id'))?.[0];
  return stockId;
}

export async function initService(stockConfigRecord: StockConfigRecord): Promise<{
  stockId: number;
  brokerMatch: BrokerMatch;
  brokerOutcomes: BrokerOutcomes;
  brokerCollectHdd: BrokerCollect;
  brokerCollectAch: BrokerCollect;
}> {
  const stockId = await addStockConfig(stockConfigRecord);

  const brokerCollectHdd = new BrokerCollect();
  const brokerCollectAch = new BrokerCollect();
  const brokerMatch = new BrokerMatch();
  const brokerOutcomes = new BrokerOutcomes();

  const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;

  const config = { ...exchangeConfig, id: stockId };

  brokerCollectHdd.init('hdd', [config]);
  brokerCollectAch.init('ach', [config]);

  brokerMatch.init(config);
  brokerOutcomes.init(config);

  return {
    stockId,
    brokerMatch,
    brokerOutcomes,
    brokerCollectHdd,
    brokerCollectAch,
  };
}

export async function runMatchJobWithThrows(
  stockId: number,
  brokerMatch: BrokerMatch,
  brokerOutcomes: BrokerOutcomes,
  throwsOn?: {
    throwOnSaveIncomes?: boolean;
    throwOnExpireExistOrdersBeforeMatch?: boolean;
    throwOnMatch?: boolean;
    throwOnSaveOutcomes?: boolean;
    throwOnExpireExistOrders?: boolean;
  },
) {
  try {
    await knex.transaction(async trx => {
      const newIncomes = await incomeModel.getNew([stockId], trx);
      if (throwsOn.throwOnSaveIncomes) throw new Error();
      await brokerMatch.saveNewIncomesToOrders(newIncomes, trx);
    });
  } catch {}

  try {
    await knex.transaction(async trx => {
      const newOrders = await ordersModel.getCreated(stockId, trx);
      const existOrders = await ordersModel.getMarketDepth(stockId, trx);

      const freshExistOrders = await brokerMatch.expireStaleOrders(existOrders, trx);
      if (throwsOn.throwOnExpireExistOrdersBeforeMatch) throw new Error();
      const freshNewOrders = await brokerMatch.expireStaleOrders(newOrders, trx);

      await brokerMatch.match(freshNewOrders, freshExistOrders, trx);
      if (throwsOn.throwOnMatch) throw new Error();
    });
  } catch {}

  try {
    await knex.transaction(async trx => {
      const deals = await dealsModel.getNew([stockId], trx);

      await brokerOutcomes.dealsToOutcomes(deals, trx);
      if (throwsOn.throwOnSaveOutcomes) throw new Error();
    });
  } catch {}

  try {
    await knex.transaction(async trx => {
      const expiredOrders = await ordersModel.getExpired([stockId], trx);
      await brokerOutcomes.processExpiredOrders(expiredOrders, trx);
      if (throwsOn.throwOnExpireExistOrders) throw new Error();
    });
  } catch {}
}

export async function runCollectJobWithThrows(brokerCollect: BrokerCollect, from: number, to: number, throwsOn?: { throwOnSaveRecords: boolean }) {
  const txs = await brokerCollect.collectBlockchainTransactions(from, to);
  try {
    await knex.transaction(async trx => {
      await brokerCollect.processCollectedTxRecords(txs, trx);
      if (throwsOn?.throwOnSaveRecords) throw new Error();
    });
  } catch {}
  await brokerCollect.releaseExpiredFrozenCoins();
}
