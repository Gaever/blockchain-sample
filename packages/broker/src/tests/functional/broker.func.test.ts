import { runMatchJob } from '@/services/broker-service';
import { clearBrokerDb } from '@ctocker/lib/build/main/src/tests/helpers';
import { BlockchainConfig } from '@ctocker/lib/build/main/src/types/blockchain';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { sleep } from '@ctocker/lib/build/main/src/utils';
import { assert } from 'chai';
import _cloneDeep from 'lodash/cloneDeep';
import _omit from 'lodash/omit';
import _set from 'lodash/set';
import testCase1 from './cases/case-1';
import testCase2 from './cases/case-2';
import testCase3 from './cases/case-3';
import testCase4 from './cases/case-4';
import { getData, initService, runCollectJobWithThrows, runMatchJobWithThrows } from './helpers';
import { buyerRate1TxHeight, buyerRate1TxTimestamp, sellerRate1TxHeight, sellerRate2TxTimestamp } from './test-enviroment';

export interface TestCase {
  stockConfigRecord: StockConfigRecord;
  getTestCase: (
    stockId: number,
    now?: Date,
  ) => {
    in: {
      hdd: {
        fromHeight: number;
        toHeight: number;
      };
      ach: {
        fromHeight: number;
        toHeight: number;
      };
    };
    out: {
      incomes: any[];
      orders: any[];
      deals: any[];
      outcomes: any[];
      blockchainConfig: {
        hdd: BlockchainConfig;
        ach: BlockchainConfig;
      };
    };
  };
}

describe('Broker: collect and match services', function () {
  this.slow(60000);

  this.beforeEach(async function () {
    await clearBrokerDb();
  });

  this.afterAll(async function () {
    await clearBrokerDb();
  });

  describe('happy path', function () {
    it('Get 2 match transactions from blockchain. 2 incomes, 2 orders, 1 deal, 4 outcomes must be created', async function () {
      const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase1.stockConfigRecord);
      const testCase = testCase1.getTestCase(stockId);

      await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
      await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
      await runMatchJob(brokerMatch, brokerOutcomes);

      const result = await getData();

      assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
      assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
      assert.deepEqual(result.incomes, testCase.out.incomes);
      assert.deepEqual(
        result.orders.map(order => _omit(order, ['created_at', 'expires_at'])),
        testCase.out.orders,
      );
      assert.deepEqual(
        result.deals.map(deal => _omit(deal, ['seller_order_id', 'buyer_order_id', 'taker_order_id'])),
        testCase.out.deals,
      );
      assert.deepEqual(
        result.outcomes.map(order => _omit(order, ['order_id', 'deal_id'])),
        testCase.out.outcomes,
      );
      result.outcomes.forEach(item => {
        assert.ok(item.deal_id);
        assert.notOk(item.order_id);
      });
      result.deals.forEach(item => {
        assert.equal(item.buyer_order_id, item.taker_order_id);
      });
    });

    it('Get 2 non-match transactions from blockchain. 2 expired orders, 2 refund outcomes must be created', async function () {
      const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase2.stockConfigRecord);
      const testCase = testCase2.getTestCase(stockId);

      await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
      await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
      await runMatchJob(brokerMatch, brokerOutcomes);

      const result = await getData();

      assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
      assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
      assert.deepEqual(result.incomes, testCase.out.incomes);
      assert.deepEqual(result.orders, testCase.out.orders);
      assert.deepEqual(result.deals, testCase.out.deals);
      assert.deepEqual(
        result.outcomes.map(order => _omit(order, ['order_id', 'deal_id'])),
        testCase.out.outcomes,
      );
      result.outcomes.forEach(item => {
        assert.notOk(item.deal_id);
        assert.ok(item.order_id);
      });
    });

    it('Get 2 non-match transactions from blockchain. 2 orders that shall expire, 2 refund outcomes must be created', async function () {
      const testCase3Clone = _cloneDeep(testCase3);
      const now = new Date();
      _set(
        testCase3Clone,
        'stockConfigRecord.config_json.exchangeConfig.hdd.orderLifetimeMs',
        String(now.getTime() - sellerRate2TxTimestamp * 1000 + 5000),
      );
      _set(
        testCase3Clone,
        'stockConfigRecord.config_json.exchangeConfig.ach.orderLifetimeMs',
        String(now.getTime() - buyerRate1TxTimestamp * 1000 + 5000),
      );

      const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase3Clone.stockConfigRecord);
      const testCase = testCase3.getTestCase(stockId, now);

      await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
      await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
      await runMatchJob(brokerMatch, brokerOutcomes);

      const result1 = await getData();
      assert.deepEqual(
        result1.orders,
        testCase.out.orders.map(order => ({ ...order, status: 'queued' })),
      );

      await sleep(5500);
      await runMatchJob(brokerMatch, brokerOutcomes);
      const result2 = await getData();

      assert.deepEqual(result2.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
      assert.deepEqual(result2.blockchainConfigAch, testCase.out.blockchainConfig.ach);
      assert.deepEqual(result2.incomes, testCase.out.incomes);
      assert.deepEqual(result2.orders, testCase.out.orders);
      assert.deepEqual(result2.deals, testCase.out.deals);
      assert.deepEqual(
        result2.outcomes.map(order => _omit(order, ['order_id', 'deal_id'])),
        testCase.out.outcomes,
      );
      result2.outcomes.forEach(item => {
        assert.notOk(item.deal_id);
        assert.ok(item.order_id);
      });
    });

    it('Immortal orders. Get 2 non-match transactions from blockchain. 2 orders that shall not expire must be created, no deals, no outcomes', async function () {
      const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase4.stockConfigRecord);
      const testCase = testCase4.getTestCase(stockId);

      await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
      await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
      await runMatchJob(brokerMatch, brokerOutcomes);

      const result1 = await getData();
      assert.deepEqual(
        result1.orders,
        testCase.out.orders.map(order => ({ ...order, status: 'queued' })),
      );

      await sleep(500);
      await runMatchJob(brokerMatch, brokerOutcomes);
      const result2 = await getData();

      assert.deepEqual(result2.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
      assert.deepEqual(result2.blockchainConfigAch, testCase.out.blockchainConfig.ach);
      assert.deepEqual(result2.incomes, testCase.out.incomes);
      assert.deepEqual(result2.orders, testCase.out.orders);
      assert.deepEqual(result2.deals, testCase.out.deals);
      assert.deepEqual(
        result2.outcomes.map(order => _omit(order, ['order_id', 'deal_id'])),
        testCase.out.outcomes,
      );
      result2.outcomes.forEach(item => {
        assert.notOk(item.deal_id);
        assert.ok(item.order_id);
      });
    });
  });

  describe('unhappy path', function () {
    describe('Simulates broken connection', function () {
      it('trying to save incomes', async function () {
        const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase1.stockConfigRecord);
        const testCase = testCase1.getTestCase(stockId);

        await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight, { throwOnSaveRecords: true });
        await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight, { throwOnSaveRecords: true });
        await runMatchJob(brokerMatch, brokerOutcomes);

        const result = await getData();

        assert.deepEqual(result.blockchainConfigHdd, {
          ...testCase.out.blockchainConfig.hdd,
          last_known_height: sellerRate1TxHeight - 1,
        });
        assert.deepEqual(result.blockchainConfigAch, {
          ...testCase.out.blockchainConfig.ach,
          last_known_height: buyerRate1TxHeight - 1,
        });
        assert.deepEqual(result.incomes, []);
        assert.deepEqual(result.orders, []);
        assert.deepEqual(result.deals, []);
        assert.deepEqual(result.outcomes, []);
      });

      it('trying to save orders', async function () {
        const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase1.stockConfigRecord);
        const testCase = testCase1.getTestCase(stockId);

        await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
        await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
        await runMatchJobWithThrows(stockId, brokerMatch, brokerOutcomes, { throwOnSaveIncomes: true });

        const result = await getData();

        assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
        assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
        assert.deepEqual(
          result.incomes,
          testCase.out.incomes.map(item => ({ ...item, status: 'new' })),
        );
        assert.deepEqual(result.orders, []);
        assert.deepEqual(result.deals, []);
        assert.deepEqual(result.outcomes, []);
      });

      it('trying to save deals', async function () {
        const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase1.stockConfigRecord);
        const testCase = testCase1.getTestCase(stockId);

        await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
        await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
        await runMatchJobWithThrows(stockId, brokerMatch, brokerOutcomes, { throwOnMatch: true });

        const result = await getData();

        assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
        assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
        assert.deepEqual(result.incomes, testCase.out.incomes);
        assert.deepEqual(
          result.orders.map(order => _omit(order, ['created_at', 'expires_at'])),
          testCase.out.orders.map(order => ({ ...order, status: 'created', amount: order.start_amount })),
        );
        assert.deepEqual(result.deals, []);
        assert.deepEqual(result.outcomes, []);
      });

      it('trying to save outcomes', async function () {
        const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase1.stockConfigRecord);
        const testCase = testCase1.getTestCase(stockId);

        await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
        await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
        await runMatchJobWithThrows(stockId, brokerMatch, brokerOutcomes, { throwOnSaveOutcomes: true });

        const result = await getData();

        assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
        assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
        assert.deepEqual(result.incomes, testCase.out.incomes);
        assert.deepEqual(
          result.orders.map(order => _omit(order, ['created_at', 'expires_at'])),
          testCase.out.orders,
        );
        assert.deepEqual(
          result.deals.map(deal => _omit(deal, ['seller_order_id', 'buyer_order_id', 'taker_order_id'])),
          testCase.out.deals.map(deal => ({ ...deal, status: 'new' })),
        );
        assert.deepEqual(result.outcomes, []);
      });

      it('trying to expire exist orders before match', async function () {
        const { stockId, brokerMatch, brokerOutcomes, brokerCollectHdd, brokerCollectAch } = await initService(testCase2.stockConfigRecord);
        const testCase = testCase2.getTestCase(stockId);

        await runCollectJobWithThrows(brokerCollectHdd, testCase.in.hdd.fromHeight, testCase.in.hdd.toHeight);
        await runCollectJobWithThrows(brokerCollectAch, testCase.in.ach.fromHeight, testCase.in.ach.toHeight);
        await runMatchJobWithThrows(stockId, brokerMatch, brokerOutcomes, { throwOnExpireExistOrdersBeforeMatch: true });

        const result = await getData();

        assert.deepEqual(result.blockchainConfigHdd, testCase.out.blockchainConfig.hdd);
        assert.deepEqual(result.blockchainConfigAch, testCase.out.blockchainConfig.ach);
        assert.deepEqual(result.incomes, testCase.out.incomes);
        assert.deepEqual(
          result.orders,
          testCase.out.orders.map(order => ({ ...order, status: 'created' })),
        );
        assert.deepEqual(result.deals, []);
        assert.deepEqual(result.outcomes, []);
      });
    });
  });
});
