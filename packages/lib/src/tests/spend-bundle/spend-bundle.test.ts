import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import TransactionManager from '@/services/blockchain/fullnode/puzzle/transacton-manager';
import { assert } from 'chai';
import Debug from 'debug';
import _omit from 'lodash/omit';
import testCase1 from './cases/1-xch';
import testCase2 from './cases/2-xch-big';
import testCase3 from './cases/3-xch-fee';
import testCase4 from './cases/4-xch-config-coin';
import testCase5 from './cases/5-ach-big';
import testCase6 from './cases/6-hdd-big';

// @ts-ignore
const debug = Debug('ctocker:test');

const omitFields = (data) => _omit(data, 'created_at_time');

describe('lib:Spend bundle', function () {
  this.slow(500);

  it('xch small', async function () {
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.xch, testCase1._in.keyStorage);
    const tx = await txManager.createTransaction(testCase1._in.amount, testCase1._in.phFrom, testCase1._in.phTo, testCase1._in.coins, testCase1._in.fee);

    assert.deepEqual(omitFields(tx), omitFields(testCase1._out));
  });

  it('xch big', async function () {
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.xch, testCase2._in.keyStorage);
    const tx = await txManager.createTransaction(testCase2._in.amount, testCase2._in.phFrom, testCase2._in.phTo, testCase2._in.coins, testCase2._in.fee);

    assert.deepEqual(omitFields(tx), omitFields(testCase2._out));
  });

  it('xch fee', async function () {
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.xch, testCase3._in.keyStorage);
    const tx = await txManager.createTransaction(testCase3._in.amount, testCase3._in.phFrom, testCase3._in.phTo, testCase3._in.coins, testCase3._in.fee);

    assert.deepEqual(omitFields(tx), omitFields(testCase3._out));
  });

  it('stock config transaction', async function () {
    const json = { url: 'http://localhost:8000/test-config' };
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.xch, testCase4._in.keyStorage);
    const tx = await txManager.creatStockConfigTransaction(json, '1', testCase4._in.phFrom, testCase4._in.phTo, testCase4._in.coins, '0');
    assert.deepEqual(omitFields(tx), omitFields(testCase4._out));
  });

  it('ach big', async function () {
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.ach, testCase5._in.keyStorage);
    const tx = await txManager.createTransaction(testCase5._in.amount, testCase5._in.phFrom, testCase5._in.phTo, testCase5._in.coins, testCase5._in.fee);

    assert.deepEqual(omitFields(tx), omitFields(testCase5._out));
  });

  it('hdd big', async function () {
    const txManager = new TransactionManager();
    await txManager.init(fullnodeEnviroment.hdd, testCase6._in.keyStorage);
    const tx = await txManager.createTransaction(testCase6._in.amount, testCase6._in.phFrom, testCase6._in.phTo, testCase6._in.coins, testCase6._in.fee);

    assert.deepEqual(omitFields(tx), omitFields(testCase6._out));
  });
});
