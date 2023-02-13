import { down as dropCurSeriesTable } from '@/models/knex-cur-series-migration';
import CtocksCollect from '@/services/ctocks-collect';
import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import Blockchain from '@ctocker/lib/build/main/src/services/blockchain/blockchain';
import FullNodeAdapter from '@ctocker/lib/build/main/src/services/blockchain/fullnode/fullnode-adapter';
import { waitForTransaction } from '@ctocker/lib/build/main/src/tests/helpers';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import { assert } from 'chai';
import Debug from 'debug';
import http, { Server } from 'http';
import _omit from 'lodash/omit';
import schedule from 'node-schedule';
import { getAddressAmount, sendAmountToAddress, setLastKnownHeight } from '../helpers';
import testConfig from './cases/test-stock-config-record.json';
import { _in, _out } from './test-enviroment';

const debug = Debug('ctocker:test');

describe('ctocks:Add stock config via xch blockchain', function () {
  this.slow(1000 * 60 * 2);
  let serverInstance: Server;

  let ctocksCollect = new CtocksCollect();
  let tx;

  this.beforeAll(async function () {
    await ctocksCollect.init('xch', []);
    await new Promise(resolve => {
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
        resolve(true);
      });
    });
  });

  this.afterAll(async function () {
    if (!tx) return;
    const stockConfigRow = await knex(stockConfigModel.tableName).select('id').where({ config_tx_id: tx });
    const id = String(stockConfigRow[0]?.id);
    if (id) {
      await knex(stockConfigModel.tableName).delete().where({ id });
      await knex.transaction(async trx => {
        if (await curSeriesModel.timescaleExists(id, '1min')) {
          await dropCurSeriesTable(curSeriesModel.tableName(id, '1min'), trx);
        }
        if (await curSeriesModel.timescaleExists(id, '1h')) {
          await dropCurSeriesTable(curSeriesModel.tableName(id, '1h'), trx);
        }
        if (await curSeriesModel.timescaleExists(id, '1d')) {
          await dropCurSeriesTable(curSeriesModel.tableName(id, '1d'), trx);
        }
        if (await curSeriesModel.timescaleExists(id, '1w')) {
          await dropCurSeriesTable(curSeriesModel.tableName(id, '1w'), trx);
        }
      });
    }
  });

  it('reset amount state', async function () {
    const spendableAmount = Number(await getAddressAmount(_in.fromAddress));
    const fullnode = new FullNodeAdapter('xch');
    const height = (await fullnode.instance.getBlockchainState())?.blockchain_state?.peak?.height;
    await setLastKnownHeight(height);
    if (spendableAmount < 1) {
      await sendAmountToAddress('1', _in.fromAddress);
    }
  });

  it('send config coin', async function () {
    const bc = new Blockchain('xch', []);
    await bc.initPayout(_in.keyStorage);
    const txRecord = await bc.sendStockConfigPayout(
      _in.coinJson,
      '1',
      addressToPuzzleHash(_in.fromAddress),
      addressToPuzzleHash(_in.stockConfigAddress),
    );
    tx = txRecord.payout_tx_id;
    debug('tx %s', tx);
    await waitForTransaction('xch', tx);
    if (!tx) throw new Error('failed to create config coin transaction');
  });

  it('recieves config coin', async function () {
    const stockConfigRow: StockConfigRecord = await new Promise(async (resolve, reject) => {
      const timeout = 1000 * 60 * 10;
      const start = new Date();

      const job = schedule.scheduleJob('*/5 * * * * *', async function () {
        await ctocksCollect.collectBlockchainTransactions();
        await ctocksCollect.processNewConfigs();

        try {
          const stockConfigRow = (await knex(stockConfigModel.tableName).select('*').where({ config_tx_id: tx }))?.map?.(
            stockConfigModel.rowToEntity,
          );
          const id = String(stockConfigRow[0]?.id);

          if (
            (await curSeriesModel.timescaleExists(id, '1min')) &&
            (await curSeriesModel.timescaleExists(id, '1h')) &&
            (await curSeriesModel.timescaleExists(id, '1d')) &&
            (await curSeriesModel.timescaleExists(id, '1w'))
          ) {
            resolve(stockConfigRow[0]);
          }
        } catch {}

        if (new Date().getTime() - start.getTime() >= timeout) {
          job.cancel();
          reject('tasks incomplete in reasonable time');
        }
      });
      job.invoke();
    });

    assert.deepEqual(_omit(stockConfigRow, 'id'), {
      ..._out,
      config_tx_id: tx,
    });
  });
});
