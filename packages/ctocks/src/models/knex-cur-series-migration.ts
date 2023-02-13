import { log } from '@ctocker/lib/build/main/src/log';
import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import { timeBuckets } from '@ctocker/lib/build/main/src/types/stock';
import Debug from 'debug';
import { Knex } from 'knex';

export async function up(stockId, trx: Knex.Transaction) {
  log.debug('create timescale tables for stockId %s', stockId);
  await down(stockId, trx);

  for (let timeBucket of timeBuckets) {
    const tableName = curSeriesModel.tableName(stockId, timeBucket);
    await trx.schema.createTable(tableName, table => {
      table.timestamp('time', { useTz: true });
      table.double('opening_price');
      table.double('highest_price');
      table.double('lowest_price');
      table.double('closing_price');
      table.double('volume_1');
      table.double('volume_2');
    });

    await trx.schema.raw(`SELECT create_hypertable('${tableName}', 'time');`);
    log.debug('%s table created', tableName);
  }
}

export async function down(stockId: string, trx: Knex.Transaction) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  for (let timeBucket of timeBuckets) {
    const tableName = curSeriesModel.tableName(stockId, timeBucket);
    await trx.raw(`DROP TABLE IF EXISTS ${tableName}`);
  }
}
