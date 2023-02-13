import stockConfigValidator from '@ctocker/lib/build/main/src/services/stock-config-validator';
import { StockConfig } from '@ctocker/lib/build/main/src/types/stock';
import { assert } from 'chai';
import http, { Server } from 'http';
import _cloneDeep from 'lodash/cloneDeep';
import _omit from 'lodash/omit';
import _set from 'lodash/set';
import * as intersectionTestCase from './cases/address-intersection-validation';
import testConfigRecord from './cases/test-stock-config-record.json';

const testConfig = testConfigRecord.config_json;

describe('ctocks:StockConfigManager', function () {
  let serverInstance: Server;

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

  describe('#valdateRemoteStockConfig', function () {
    const v = o => stockConfigValidator.validateRemoteStockConfig(o as StockConfig);

    it('happy path', function () {
      assert.doesNotThrow(() => v(testConfig));

      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.takerFee.fixed')));
      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.takerFee.percent')));
      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.makerFee.fixed')));
      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.makerFee.percent')));
      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.paybackFee.fixed')));
      assert.doesNotThrow(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.paybackFee.percent')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.makerFee.percent', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.makerFee.percent', '0.001')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.makerFee.percent', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.makerFee.percent', '0.001')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.takerFee.percent', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.takerFee.percent', '0.001')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.takerFee.percent', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.takerFee.percent', '0.001')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.transactionFee', '100000')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.transactionFee', '100000')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.paybackFee.percent', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.paybackFee.percent', '0.001')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.paybackFee.fixed', '100')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.orderLifetimeMs', '0')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.orderLifetimeMs', '0')));

      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.minInAmountFixed', '100')));
      assert.doesNotThrow(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.minInAmountFixed', '100')));
    });

    it('fail without name', function () {
      assert.throw(() => v(_omit(testConfig, 'name')));
    });

    it('fail without exchangeConfig', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig')));
    });

    it('fail without cur1', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.cur1')));
    });
    it('fail without cur2', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.cur2')));
    });

    // it('fail with extra unsupported field', function () {
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.takerFee.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.takerFee.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.makerFee.foo', 'foo')));
    //   assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.makerFee.foo', 'foo')));
    // });

    it('fail with wrong cur1', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.cur1', 'cxh')));
    });
    it('fail with wrong cur2', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.cur1', 'cxh')));
    });

    it('fail without [cur1] section', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch')));
    });
    it('fail without [cur2] section', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach')));
    });

    it('fail without [cur].addresses', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.addresses')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.addresses')));
    });

    it('fail without [cur].fees', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.fees')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.fees')));
    });

    it('fail without [cur].orderLifetimeMs', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.orderLifetimeMs')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.orderLifetimeMs')));
    });

    it('fail having wrong [cur].orderLifetimeMs', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.orderLifetimeMs', '_')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.orderLifetimeMs', 1)));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.orderLifetimeMs', -10)));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.orderLifetimeMs', '-10')));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.orderLifetimeMs', '_')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.orderLifetimeMs', 1)));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.orderLifetimeMs', -10)));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.orderLifetimeMs', '-10')));
    });

    it('fail having wrong [cur].minInAmountFixed', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.minInAmountFixed', '_')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.minInAmountFixed', 1)));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.minInAmountFixed', -10)));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.minInAmountFixed', '-10')));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.minInAmountFixed', '_')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.minInAmountFixed', 1)));

      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.minInAmountFixed', -10)));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.minInAmountFixed', '-10')));
    });

    it('fail having incorrect [cur].addresses[address]', function () {
      assert.throw(() =>
        v(
          _set(_cloneDeep(testConfig), 'exchangeConfig.ach.addresses', {
            ...testConfig.exchangeConfig.xch.addresses,
            cch1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '1',
          }),
        ),
      );

      assert.throw(() =>
        v(
          _set(_cloneDeep(testConfig), 'exchangeConfig.ach.addresses', {
            ...testConfig.exchangeConfig.ach.addresses,
            cch1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '1',
          }),
        ),
      );
    });

    it('fail having incorrect [cur].addresses[address] rate', function () {
      assert.throw(() =>
        v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.addresses[xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj]', 'foo')),
      );

      assert.throw(() =>
        v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.addresses[ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku]', 'foo')),
      );
    });

    it('fail without [cur].fees.takerFee', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.takerFee')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.takerFee')));

      assert.throw(() => v(_omit(testConfig, ['exchangeConfig.xch.fees.takerFee.percent', 'exchangeConfig.xch.fees.takerFee.fixed'])));
      assert.throw(() => v(_omit(testConfig, ['exchangeConfig.ach.fees.takerFee.percent', 'exchangeConfig.ach.fees.takerFee.fixed'])));
    });

    it('fail without [cur].fees.makerFee', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.makerFee')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.makerFee')));
    });

    it('fail without [cur].fees.paybackFee', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.paybackFee')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.paybackFee')));
    });

    it('fail without [cur].fees.transactionFee', function () {
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.xch.fees.transactionFee')));
      assert.throw(() => v(_omit(testConfig, 'exchangeConfig.ach.fees.transactionFee')));
    });

    it('fail having [cur].fees.takerFee.fixed not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.takerFee.fixed', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.takerFee.fixed', 'foo')));
    });

    it('fail having [cur].fees.takerFee.percent not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.takerFee.percent', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.takerFee.percent', 'foo')));
    });

    it('fail having [cur].fees.makerFee.fixed not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.makerFee.fixed', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.makerFee.fixed', 'foo')));
    });

    it('fail having [cur].fees.makerFee.percent not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.makerFee.percent', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.makerFee.percent', 'foo')));
    });

    it('fail having [cur].fees.paybackFee.fixed not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.paybackFee.fixed', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.paybackFee.fixed', 'foo')));
    });

    it('fail having [cur].fees.paybackFee.percent not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.paybackFee.percent', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.paybackFee.percent', 'foo')));
    });

    it('fail having [cur].fees.transactionFee not string of number', function () {
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.xch.fees.transactionFee', 'foo')));
      assert.throw(() => v(_set(_cloneDeep(testConfig), 'exchangeConfig.ach.fees.transactionFee', 'foo')));
    });
  });

  describe('#validateAddressCrossing', function () {
    it('should not fail having no puzzle hash intersection', function () {
      assert.doesNotThrow(() => stockConfigValidator.validateAddressCrossing(intersectionTestCase._in, intersectionTestCase.noIntersection));
    });
    it('should fail having puzzle hash intersection', function () {
      assert.throw(() => stockConfigValidator.validateAddressCrossing(intersectionTestCase._in, intersectionTestCase.hasIntersection));
    });
  });

  // describe('#fetchStockConfig', function () {
  //   it('fetches', async function () {
  //     const out = await stockConfigManager.fetchStockConfig(testConfigRecord as StockConfigRecord);
  //     assert.deepEqual(out, testConfig as StockConfig);
  //   });

  //   it('fails on wrong url', async function () {
  //     try {
  //       await stockConfigManager.fetchStockConfig(
  //         _set(_cloneDeep(testConfigRecord), 'config_url', 'http://localhost:8000/200-dont-exist') as StockConfigRecord,
  //       );
  //       assert.fail();
  //     } catch {}
  //   });
  // });
});
