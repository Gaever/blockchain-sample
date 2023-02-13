import { up as createTimescaleTable } from '@/models/knex-cur-series-migration';
import CtocksCollect from '@/services/ctocks-collect';
import { clearCtocksDb, seedStock } from '@/utils/helpers';
import curSeriesModel from '@ctocker/lib/build/main/src/models/cur-series.model';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import orderModel from '@ctocker/lib/build/main/src/models/orders.model';
import Blockchain from '@ctocker/lib/build/main/src/services/blockchain/blockchain';
import FullNodeAdapter from '@ctocker/lib/build/main/src/services/blockchain/fullnode/fullnode-adapter';
import { waitForTransaction } from '@ctocker/lib/build/main/src/tests/helpers';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import { assert } from 'chai';
import Debug from 'debug';
import _mapValues from 'lodash/mapValues';
import _pick from 'lodash/pick';
import schedule from 'node-schedule';
import { getAddressAmount, sendAmountToAddress, setLastKnownHeight } from '../helpers';
import { _in, _out } from './cases/integ.1';

// @ts-ignore
const debug = Debug('ctocker:test');

let ctocksCollect;
let stockId;

const cur1 = _in.stockConfigRecord.cur1;
const cur2 = _in.stockConfigRecord.cur2;

describe('ctocks:integration', function () {
  this.slow(1000 * 60 * 8);

  before(async function () {
    await knex.transaction(async trx => {
      await clearCtocksDb(trx);
      stockId = await seedStock(trx, _in.stockConfigRecord);
      await createTimescaleTable(stockId, trx);

      ctocksCollect = new CtocksCollect();
      ctocksCollect.init([{ ..._in.stockConfigRecord.config_json.exchangeConfig, id: stockId }]);
    });
  });

  this.afterAll(async function () {
    await knex.transaction(async trx => {
      await clearCtocksDb(trx);
    });
  });

  async function getData() {
    const incomes = await knex(incomeModel.tableName).select('*');
    const orders = await knex(orderModel.tableName).select('*');
    const deals = await knex(dealsModel.tableName).select('*');
    const curSeries = await knex(curSeriesModel.tableName(stockId, '1min')).select('*');

    return { incomes, orders, deals, curSeries };
  }

  it('reset amount state', async function () {
    {
      const spendableAmount = Number(await getAddressAmount(_in.fromAddressCur1, cur1));
      const fullnode = new FullNodeAdapter(cur1);
      const height = (await fullnode.instance.getBlockchainState())?.blockchain_state?.peak?.height;
      await setLastKnownHeight(height, cur1);
      if (spendableAmount < Number(_in.necessaryAmountCur1)) {
        await sendAmountToAddress(String(_in.necessaryAmountCur1), _in.fromAddressCur1, cur1);
      }
    }
    {
      const spendableAmount = Number(await getAddressAmount(_in.fromAddressCur2, cur2));
      const fullnode = new FullNodeAdapter(cur2);
      const height = (await fullnode.instance.getBlockchainState())?.blockchain_state?.peak?.height;
      await setLastKnownHeight(height, cur2);
      if (spendableAmount < Number(_in.necessaryAmountCur2)) {
        await sendAmountToAddress(String(_in.necessaryAmountCur2), _in.fromAddressCur2, cur1);
      }
    }
  });

  it('send from clients to stock', async function () {
    const bc1 = new Blockchain(cur1, []);
    await bc1.initPayout(_in.keyStorage);

    const bc2 = new Blockchain(cur2, []);
    await bc2.initPayout(_in.keyStorage);

    for (const item of _in.transactions) {
      const bc = item.cur === cur1 ? bc1 : bc2;

      const txRecord = await bc.sendPayout(String(item.amount), addressToPuzzleHash(item.fromAddress), addressToPuzzleHash(item.toAddress));
      const tx = txRecord.payout_tx_id;
      debug('tx %s %O %s', item.cur, txRecord, bc.fullnode.enviroment.currency);
      await waitForTransaction(item.cur, tx);
    }
  });

  it('matching', async function () {
    await new Promise(async (resolve, reject) => {
      const timeout = 1000 * 60 * 5;
      const start = new Date();

      const job = schedule.scheduleJob('*/5 * * * * *', async function () {
        await ctocksCollect.collectBlockchainTransactions();
        await ctocksCollect.play();

        const curSeriesRow = await curSeriesModel.getSeries(String(stockId), '1min');

        if (curSeriesRow.length > 0) {
          job.cancel();
          resolve(true);
        }

        if (new Date().getTime() - start.getTime() >= timeout) {
          job.cancel();
          reject('tasks incomplete in reasonable time');
        }
      });
      job.invoke();
    });
  });

  it('validates', async function () {
    const actual = await getData();

    debug('actual raw %O', actual);

    const map = (collection1, collection2) => collection1.map(item => _mapValues(_pick(item, Object.keys(collection2[0])), String));

    const income = map(actual.incomes, _out.income);
    const orders = map(actual.orders, _out.orders);
    const deals = map(actual.deals, _out.deals);
    const curSeries = map(actual.curSeries, _out.curSeries);

    assert.sameDeepMembers(income, _out.income);
    assert.deepEqual(orders, _out.orders);
    assert.deepEqual(deals, _out.deals);
    assert.deepEqual(curSeries, _out.curSeries);
  });
});
