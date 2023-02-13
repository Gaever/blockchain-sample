import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { Knex } from 'knex';

export async function clearCtocksDb(trx: Knex.Transaction) {
  await trx(outcomeModel.tableName).delete();
  await trx(dealsModel.tableName).delete();
  await trx(ordersModel.tableName).delete();
  await trx(incomeModel.tableName).delete();
  await trx(stockConfigModel.tableName).delete();
  await trx(blockchainConfigModel.tableName).delete();

  const timescaleDbs = (await trx.raw("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))?.rows;
  for (const item of timescaleDbs) {
    if (item.table_name.indexOf('timescale_stock_') !== -1) {
      await trx.raw(`DROP TABLE IF EXISTS ${item.table_name}`);
    }
  }
}
