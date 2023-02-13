import { clearCtocksDb, seedStock } from '@/utils/helpers';
import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { Knex } from 'knex';

export async function seed(knex: Knex) {
  await knex.transaction(async trx => {
    await clearCtocksDb(trx);
    await seedStock(trx, defaultStockConfigRecord);
  });
}
