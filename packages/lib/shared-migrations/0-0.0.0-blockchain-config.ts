import Debug from 'debug';
import { Knex } from 'knex';

const tableName = 'blockchain_config';

export async function up(knex: Knex) {
  const debug = Debug(`migration:up:${__filename}`);

  debug('up');

  await down(knex);
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id', { primaryKey: true });
    table.string('cur');
    table.integer('last_known_height');
    table.integer('service_start_height');
  });
}

export async function down(knex: Knex) {
  const debug = Debug(`migration:down:${__filename}`);

  debug('down');

  await knex.raw(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
}
