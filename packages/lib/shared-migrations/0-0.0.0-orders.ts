import Debug from 'debug';
import { Knex } from 'knex';

export const tableName = 'orders';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id', { primaryKey: true });

    table.timestamps(false, true);
    table.timestamp('expires_at');
    table.string('amount');
    table.string('start_amount');
    table.string('rate');
    table.boolean('is_sell');
    table.string('cur1');
    table.string('cur2');
    table.string('client_puzzle_hash');
    table.string('rate_puzzle_hash');
    table.string('status');
    table.integer('income_id');
    table.integer('stock_id');
  });
}

export async function down(knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  await knex.raw(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
}
