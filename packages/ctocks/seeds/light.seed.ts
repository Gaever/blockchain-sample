// organize-imports-ignore

import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { Knex } from 'knex';
import _partition from 'lodash/partition';
import { up as createCurSeriesTable } from '../src/models/knex-cur-series-migration';
import { clear } from './helpers';
import stockConfigs from '../../../config/dev-light-stock-configs.json';

// @ts-ignore
async function seedCurSeries(stockConfig: StockConfigRecord, trx: Knex.Transaction) {
  const stockConfigId = (await stockConfigModel.addConfig(stockConfig, trx))?.[0];
  await createCurSeriesTable(stockConfigId, trx);
  return stockConfigId;
}

export async function seed(knex: Knex) {
  await knex.transaction(async trx => {
    await clear(trx);
    for (const config of stockConfigs as StockConfigRecord[]) {
      await seedCurSeries(config, trx);
    }
  });
}
