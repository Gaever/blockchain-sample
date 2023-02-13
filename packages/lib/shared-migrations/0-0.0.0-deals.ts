import Debug from 'debug';
import { Knex } from 'knex';

export const tableName = 'deals';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id', { primaryKey: true });

    table.timestamps(true, true);
    table.string('seller_puzzle_hash');
    table.string('buyer_puzzle_hash');
    table.string('rate1_puzzle_hash');
    table.string('rate2_puzzle_hash');
    table.string('cur1');
    table.string('cur2');
    table.string('seller_amount_in_cur2');
    table.string('buyer_amount_in_cur1');
    table.string('rate');
    table.string('seller_fee_in_cur2');
    table.string('buyer_fee_in_cur1');
    table.integer('seller_order_id');
    table.integer('buyer_order_id');
    table.integer('taker_order_id');
    table.string('status');
    table.integer('stock_id');
    table.boolean('is_sell');
  });
}

export async function down(knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  await knex.raw(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
}
