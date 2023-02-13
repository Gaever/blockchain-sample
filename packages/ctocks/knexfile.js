require('ts-node').register({ project: 'tsconfig.knex.json' });
require('dotenv').config({ path: '../../.env' });
const parse = require('pg-connection-string').parse;
const pgconfig = parse(process.env.POSTGRES);
// pgconfig.ssl = { rejectUnauthorized: false };

module.exports = {
  client: 'pg',

  connection: pgconfig,

  migrations: {
    directory: `${__dirname}/migrations`,
  },
  seeds: {
    directory: `${__dirname}/seeds`,
  },
};
