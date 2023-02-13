// organize-imports-ignore

import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { currency, StockConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { Knex } from 'knex';
import _partition from 'lodash/partition';
import { up as createCurSeriesTable } from '../src/models/knex-cur-series-migration';
import { clearCtocksDb } from './helpers';
import heavyStockConfig1 from '../../../config/stock-config-ach-hdd-heavy-1.json';
import heavyStockConfig2 from '../../../config/stock-config-xch-ach-heavy-1.json';

async function seedCurSeries(stockConfig: StockConfigRecord, trx: Knex.Transaction) {
  const stockConfigId = (await stockConfigModel.addConfig(stockConfig, trx))?.[0];

  await createCurSeriesTable(stockConfigId, trx);

  return stockConfigId;
}

export async function seed(knex: Knex) {
  await knex.transaction(async trx => {
    await clearCtocksDb(trx);
    const record1: StockConfigRecord = {
      config_tx_id: '0x00000000000000000000000000000001',
      status: 'confirmed',
      config_json: heavyStockConfig1 as StockConfig,
      cur1: heavyStockConfig1.exchangeConfig.cur1 as currency,
      cur2: heavyStockConfig1.exchangeConfig.cur2 as currency,
      name: heavyStockConfig1.name,
      transaction_json: '',
    };
    const record2: StockConfigRecord = {
      config_tx_id: '0x00000000000000000000000000000002',
      status: 'confirmed',
      config_json: heavyStockConfig2 as StockConfig,
      cur1: heavyStockConfig2.exchangeConfig.cur1 as currency,
      cur2: heavyStockConfig2.exchangeConfig.cur2 as currency,
      name: heavyStockConfig2.name,
      transaction_json: '',
    };
    await seedCurSeries(record1, trx);
    await seedCurSeries(record2, trx);
  });
}
