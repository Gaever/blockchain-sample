import { up as createCurSeriesTable } from '@ctocker/ctocks/dist/src/models/knex-cur-series-migration';
import CtocksMatch from '@ctocker/ctocks/dist/src/services/ctocks-match';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { currency, ExchangeConfig, Income, StockConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { Knex } from 'knex';
import heavyStockConfig1 from '../../../config/stock-config-ach-hdd-heavy-1.json';
import heavyStockConfig2 from '../../../config/stock-config-xch-ach-heavy-1.json';
import { clearCtocksDb } from './helpers';

async function addStockConfig(stockConfig: StockConfigRecord, trx: Knex.Transaction) {
  const stockConfigId = (await stockConfigModel.addConfig(stockConfig, trx))?.[0];

  await createCurSeriesTable(stockConfigId, trx);

  return stockConfigId;
}

async function seedStockConfig(trx: Knex.Transaction) {
  let stockId1;
  let stockId2;
  const record1: StockConfigRecord = {
    config_tx_id: '0x0000000000000000000000000000000000000000000000000000000000000001',
    status: 'confirmed',
    config_json: heavyStockConfig1 as StockConfig,
    cur1: heavyStockConfig1.exchangeConfig.cur1 as currency,
    cur2: heavyStockConfig1.exchangeConfig.cur2 as currency,
    name: heavyStockConfig1.name,
    transaction_json: '',
  };
  const record2: StockConfigRecord = {
    config_tx_id: '0x0000000000000000000000000000000000000000000000000000000000000002',
    status: 'confirmed',
    config_json: heavyStockConfig2 as StockConfig,
    cur1: heavyStockConfig2.exchangeConfig.cur1 as currency,
    cur2: heavyStockConfig2.exchangeConfig.cur2 as currency,
    name: heavyStockConfig2.name,
    transaction_json: '',
  };
  stockId1 = await addStockConfig(record1, trx);
  stockId2 = await addStockConfig(record2, trx);

  return { stockId1, stockId2 };
}

async function runMatchJob(ctocksMatch: CtocksMatch, knex: Knex) {
  const id = ctocksMatch.stock.id;

  await knex.transaction(async trx => {
    const newIncomes = await incomeModel.getNew([id], trx);
    await ctocksMatch.saveNewIncomesToOrders(newIncomes, trx);

    const newOrders = await ordersModel.getCreated(id, trx);
    const existOrders = await ordersModel.getMarketDepth(id, trx);

    await ctocksMatch.match(newOrders, existOrders, trx);
  });
}

async function seedRecords(stockId: number, exchangeConfig: ExchangeConfig, knex: Knex) {
  const income1: Income = {
    cur: 'ach',
    amount: '10',
    client_puzzle_hash: '0x00000000000000000000000000000000000000000000000000000000000000c1',
    // 1:0.951
    rate_puzzle_hash: '0x42ca34be2ba8f15a45dee9390b5eabab8d5bf6ec44af931a01aa2da02186eac3',
    created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 35),
    height: 1,
    rate: '0.951',
    tx_id: '0x0000000000000000000000000000000000000000000000000000000000000002',
    status: 'new',
    stock_id: stockId,
  };

  const income2: Income = {
    cur: 'hdd',
    amount: '10000',
    client_puzzle_hash: '0x00000000000000000000000000000000000000000000000000000000000000c2',
    // 1:0.951
    rate_puzzle_hash: '0x31092675ea925017e946cedc746e3838663b8e0d4f109b33624d48a8075d0ee3',
    created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 34),
    height: 1,
    rate: '0.951',
    tx_id: '0x0000000000000000000000000000000000000000000000000000000000000001',
    status: 'new',
    stock_id: stockId,
  };
  await incomeModel.add([income1, income2]);

  const ctocksMatch = new CtocksMatch();
  ctocksMatch.init(exchangeConfig);

  await runMatchJob(ctocksMatch, knex);
}

export async function seed(knex: Knex) {
  const stockIds = { stockId1: 0 };
  await knex.transaction(async trx => {
    await clearCtocksDb(trx);
    const { stockId1 } = await seedStockConfig(trx);
    stockIds.stockId1 = stockId1;
  });

  const exchangeConfig: ExchangeConfig = { ...(heavyStockConfig1.exchangeConfig as ExchangeConfig), id: stockIds.stockId1 };

  await seedRecords(stockIds.stockId1, exchangeConfig, knex);
}
