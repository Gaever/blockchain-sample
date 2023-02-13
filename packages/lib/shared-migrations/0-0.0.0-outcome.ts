import Debug from 'debug';
import { Knex } from 'knex';

export const tableName = 'outcome';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id', { primaryKey: true });
    table.string('tx_id').unique().nullable();
    table.integer('height');
    table.timestamps(false, true);
    table.string('amount');
    table.string('transaction_fee');
    table.string('client_puzzle_hash');
    table.string('stock_holder_puzzle_hash');
    table.string('cur').notNullable();
    table.string('status');
    table.integer('deal_id');
    table.integer('order_id');
    table.integer('stock_id');
    table.string('payback_fee');
  });
}

export async function down(knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  await knex.raw(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
}
