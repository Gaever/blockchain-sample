import { up as createCurSeriesTable } from '@/models/knex-cur-series-migration';
import CtocksCollect from '@/services/ctocks-collect';
import CtocksMatch from '@/services/ctocks-match';
import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import _omit from 'lodash/omit';

export function omitFields(data) {
  return data.map(item =>
    _omit(item, [
      'id',
      'created_at',
      'payback_fee',
      'updated_at',
      'expires_at',
      'income_id',
      'stock_id',
      'order1_id',
      'order2_id',
      'order_id',
      'deal_id',
    ]),
  );
}

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
  await knex.transaction(async trx => {
    await createCurSeriesTable(stockId, trx);
  });
  return stockId;
}

export async function initService(stockConfigRecord: StockConfigRecord): Promise<{
  stockId: number;
  ctocksMatch: CtocksMatch;
  ctocksCollectHdd: CtocksCollect;
  ctocksCollectAch: CtocksCollect;
}> {
  const stockId = await addStockConfig(stockConfigRecord);

  const ctocksCollectHdd = new CtocksCollect();
  const ctocksCollectAch = new CtocksCollect();
  const ctocksMatch = new CtocksMatch();

  const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;

  const config = { ...exchangeConfig, id: stockId };

  ctocksCollectHdd.init('hdd', [config]);
  ctocksCollectAch.init('ach', [config]);

  ctocksMatch.init(config);

  return {
    stockId,
    ctocksMatch,
    ctocksCollectHdd,
    ctocksCollectAch,
  };
}

export async function runMatchJobWithThrows(
  stockId: number,
  ctocksMatch: CtocksMatch,
  throwsOn?: {
    throwOnSaveIncomes?: boolean;
    throwOnExpireExistOrdersBeforeMatch?: boolean;
    throwOnMatch?: boolean;
    throwOnSaveOutcomes?: boolean;
    throwOnExpireExistOrders?: boolean;
  },
) {
  const id = stockId;

  try {
    await knex.transaction(async trx => {
      const newIncomes = await incomeModel.getNew([id], trx);
      await ctocksMatch.saveNewIncomesToOrders(newIncomes, trx);
      if (throwsOn.throwOnSaveIncomes) throw new Error();
    });
  } catch {}

  try {
    await knex.transaction(async trx => {
      const newOrders = await ordersModel.getCreated(id, trx);
      const existOrders = await ordersModel.getMarketDepth(id, trx);

      const freshExistOrders = await ctocksMatch.expireStaleOrders(existOrders, trx);
      if (throwsOn.throwOnExpireExistOrdersBeforeMatch) throw new Error();
      const freshNewOrders = await ctocksMatch.expireStaleOrders(newOrders, trx);

      await ctocksMatch.match(freshNewOrders, freshExistOrders, trx);
      if (throwsOn.throwOnMatch) throw new Error();
    });
  } catch {}
}

export async function runCollectJobWithThrows(ctocksCollect: CtocksCollect, from: number, to: number, throwsOn?: { throwOnSaveRecords: boolean }) {
  const txs = await ctocksCollect.collectBlockchainTransactions(from, to);
  try {
    await knex.transaction(async trx => {
      await ctocksCollect.processCollectedTxRecords(txs, trx);
      if (throwsOn?.throwOnSaveRecords) throw new Error();
    });
  } catch {}
  await ctocksCollect.processNewConfigs();
}

export async function clearCtocksDb() {
  await knex(outcomeModel.tableName).delete();
  await knex(dealsModel.tableName).delete();
  await knex(ordersModel.tableName).delete();
  await knex(incomeModel.tableName).delete();
  await knex(stockConfigModel.tableName).delete();
  await knex(blockchainConfigModel.tableName).delete();

  const timescaleDbs = (await knex.raw("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))?.rows;
  for (const item of timescaleDbs) {
    if (item.table_name.indexOf('timescale_stock_') !== -1) {
      await knex.raw(`DROP TABLE IF EXISTS ${item.table_name}`);
    }
  }
}
