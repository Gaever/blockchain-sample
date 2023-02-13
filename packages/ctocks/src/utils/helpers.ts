import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { Knex } from 'knex';
import { up as createStockConfigTable } from '../models/knex-cur-series-migration';

export async function clearCtocksDb(trx: Knex.Transaction) {
  await trx(outcomeModel.tableName).delete();
  await trx(dealsModel.tableName).delete();
  await trx(ordersModel.tableName).delete();
  await trx(incomeModel.tableName).delete();
  await trx(stockConfigModel.tableName).delete();

  const timescaleDbs = (await trx.raw("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))?.rows;
  for (const item of timescaleDbs) {
    if (item.table_name.indexOf('timescale_stock_') !== -1) {
      await trx.raw(`DROP TABLE IF EXISTS ${item.table_name}`);
    }
  }
}

export async function seedStock(trx: Knex.Transaction, stockConfigRecord: StockConfigRecord) {
  await clearCtocksDb(trx);
  const id = (await stockConfigModel.addConfig(stockConfigRecord, trx))[0];
  await createStockConfigTable(curSeriesModel.tableName(String(id), '1min'), trx);
  await createStockConfigTable(curSeriesModel.tableName(String(id), '1h'), trx);
  await createStockConfigTable(curSeriesModel.tableName(String(id), '1d'), trx);
  await createStockConfigTable(curSeriesModel.tableName(String(id), '1w'), trx);
  return id;
}
