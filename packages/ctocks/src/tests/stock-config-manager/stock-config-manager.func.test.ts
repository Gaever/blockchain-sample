// organize-imports-ignore
import stockConfigManager from '@/services/stock-config-manager';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { assert } from 'chai';
import _omit from 'lodash/omit';
import _pick from 'lodash/pick';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';
import testConfigRecord from './cases/test-stock-config-record.json';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { StockConfigTxRecord } from '@ctocker/lib/build/main/src/types/blockchain';
import { createTxRecord } from '@ctocker/lib/build/main/src/tests/helpers';
import http, { Server } from 'http';
import { down as dropTimescaleTable } from '@/models/knex-cur-series-migration';
import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import Debug from 'debug';

// @ts-ignore
const debug = Debug('ctocker:test');

const testConfig = testConfigRecord.config_json;

describe('ctocks:StockConfigManager functional', function () {
  let serverInstance: Server;

  this.slow(500);

  this.beforeAll(function (done) {
    serverInstance = http
      .createServer(function (request, response) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (request.url === '/test-config') {
          response.end(JSON.stringify(testConfig));
        } else {
          response.end();
        }
      })
      .listen(8000);
    serverInstance.on('listening', function () {
      done();
    });
  });

  this.afterAll(function () {
    serverInstance.close();
  });

  describe('Add new config', function () {
    async function clearDb() {
      await knex(stockConfigModel.tableName).delete().where({ config_tx_id: testConfigRecord.config_tx_id });
    }

    function createTx() {
      const stockConfigTxRecord: StockConfigTxRecord = {
        ...createTxRecord({
          txId: testConfigRecord.config_tx_id,
          amount: '1',
          blockIndex: 1,
          cur: 'xch',
          fromAddress: 'xch10mveq6nqa9gukqyhcnjeqhth4t7hwxn2utpelg9nf4482g88d0ksjreezt',
          toAddress: 'xch10mveq6nqa9gukqyhcnjeqhth4t7hwxn2utpelg9nf4482g88d0ksjreezt',
          parentCoinInfoAlias: 'parent',
          headerHashAlias: 'header',
        }),
        json: testConfigRecord.transaction_json,
      };

      return stockConfigTxRecord;
    }

    this.beforeAll(async function () {
      await clearDb();
    });

    this.afterAll(async function () {
      await clearDb();
    });

    describe('happy path', function () {
      this.beforeAll(async function () {
        await clearDb();
      });

      it('#addNewConfig', async function () {
        await stockConfigManager.addNewConfig(createTx());
        const row = await knex(stockConfigModel.tableName).select('*').where({ config_tx_id: testConfigRecord.config_tx_id });
        assert.deepEqual(_omit(row[0], ['id', 'created_at', 'updated_at']), {
          config_tx_id: testConfigRecord.config_tx_id,
          transaction_json: testConfigRecord.transaction_json,
          cur1: null,
          config_json: null,
          cur2: null,
          name: null,
          status: 'new',
        } as StockConfigRecord);
      });

      it('#processNewConfigs', async function () {
        await stockConfigManager.processNewConfigs();
        const row = await knex(stockConfigModel.tableName).select('*').where({ config_tx_id: testConfigRecord.config_tx_id });
        assert.equal(row[0].status, 'moderation');
        assert.equal(row[0].name, testConfigRecord.config_json.name);
        const curSeriesRow = await curSeriesModel.getSeries(`${row[0].id}`, '1min');
        await knex.transaction(async trx => {
          await dropTimescaleTable(curSeriesModel.tableName(`${row[0].id}`, '1min'), trx);
          await dropTimescaleTable(curSeriesModel.tableName(`${row[0].id}`, '1h'), trx);
          await dropTimescaleTable(curSeriesModel.tableName(`${row[0].id}`, '1d'), trx);
          await dropTimescaleTable(curSeriesModel.tableName(`${row[0].id}`, '1w'), trx);
        });
        assert.sameMembers(curSeriesRow, []);
      });
    });

    describe('rejected config', async function () {
      before(async function () {
        await clearDb();
      });

      it('#addNewConfig', async function () {
        const notExistUrlJson = JSON.stringify({ url: 'http://localhost:8000/not-exist' });
        await stockConfigManager.addNewConfig({
          ...createTx(),
          json: notExistUrlJson,
        });
        const row = await knex(stockConfigModel.tableName).select('*').where({ config_tx_id: testConfigRecord.config_tx_id });
        assert.deepEqual(_omit(row[0], ['id', 'created_at', 'updated_at']), {
          config_tx_id: testConfigRecord.config_tx_id,
          transaction_json: notExistUrlJson,
          cur1: null,
          config_json: null,
          cur2: null,
          name: null,
          status: 'new',
        } as StockConfigRecord);
      });

      it('#processNewConfigs', async function () {
        await stockConfigManager.processNewConfigs();
        const row = await knex(stockConfigModel.tableName).select('*').where({ config_tx_id: testConfigRecord.config_tx_id });
        assert.equal(row[0].status, 'error');
      });
    });
  });
});
