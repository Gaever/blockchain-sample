import Debug from 'debug';
import { Knex } from 'knex';

export const tableName = 'outcome';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.alterTable(tableName, (table) => {
    table.string('header_hash');
  });
}

export async function down(knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  await knex.schema.alterTable(tableName, async (table) => {
    if (await knex.schema.hasColumn(tableName, 'header_hash')) {
      table.dropColumn('header_hash');
    }
  });
}
