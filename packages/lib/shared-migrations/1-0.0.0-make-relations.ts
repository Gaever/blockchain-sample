import Debug from 'debug';
import { Knex } from 'knex';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.alterTable('income', (table) => {
    table.foreign('stock_id').references('stock_config.id');
  });
  await knex.schema.alterTable('orders', (table) => {
    table.foreign('income_id').references('income.id');
    table.foreign('stock_id').references('stock_config.id');
  });
  await knex.schema.alterTable('deals', (table) => {
    // table.foreign('order1_id').references('orders.id');
    // table.foreign('order2_id').references('orders.id');
    table.foreign('stock_id').references('stock_config.id');
  });
  await knex.schema.alterTable('outcome', (table) => {
    table.foreign('order_id').references('orders.id');
    table.foreign('deal_id').references('deals.id');
    table.foreign('stock_id').references('stock_config.id');
  });
}

export async function down(_knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');
}
