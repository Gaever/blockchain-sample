import BrokerOutcomes from '@/services/broker/broker-outcomes';
import { assert } from 'chai';
import Debug from 'debug';
import _omit from 'lodash/omit';
import _set from 'lodash/set';
import testCase1 from './cases/case-1';
import testCase2 from './cases/case-2';
import testCase3 from './cases/case-3';
import testCase4 from './cases/case-4';
import * as paybackCases from './cases/payback-cases';
import { exchangeConfig, TCase } from './testEnviroment';

_set(process.env, 'CUR1_STOCK_HOLDER_ADDRESS', 'xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp');
_set(process.env, 'CUR2_STOCK_HOLDER_ADDRESS', 'ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna');

// @ts-ignore
const debug = Debug('ctocker:test');

describe('lib:BrokerOutcomes', function () {
  describe('payouts', function () {
    const brokerOutcomes = new BrokerOutcomes();
    brokerOutcomes.init(exchangeConfig);

    function runTestCase(testCase: TCase) {
      return function () {
        {
          if (testCase._in.deal) {
            const outcomes = brokerOutcomes.createOutcomesToClients(testCase._in.deal);
            assert.deepEqual(
              outcomes.map((item) => _omit(item, 'created_at')),
              testCase._out.createOutcomesToClients
            );
          }
        }

        {
          if (testCase._in.deal) {
            const outcomes = brokerOutcomes.createOutcomesToStockHolder(testCase._in.deal);
            assert.deepEqual(
              outcomes.map((item) => _omit(item, 'created_at')),
              testCase._out.createOutcomesToStockHolder
            );
          }
        }

        {
          if (testCase._in.order) {
            const outcomes = brokerOutcomes.createExpiredOrderPaybackOutcome(testCase._in.order);
            assert.deepEqual(_omit(outcomes, 'created_at'), testCase._out.createExpiredOrderPaybackOutcome);
          }
        }
      };
    }

    it('payout > stockFee + transactionFee ', runTestCase(testCase1));
    it('payout > stockFee and =< transactionFee', runTestCase(testCase2));
    it('payout > transactionFee and =< stockFee', runTestCase(testCase3));
    it('payout < stockFee + transactionFee', runTestCase(testCase4));
  });

  describe('paybacks', function () {
    function runTestCase(testCase: TCase) {
      return function () {
        const brokerOutcomes = new BrokerOutcomes();
        brokerOutcomes.init(testCase._in.exchangeConfig!);

        if (testCase._in.order) {
          const outcomes = brokerOutcomes.createExpiredOrderPaybackOutcome(testCase._in.order);
          assert.deepEqual(_omit(outcomes, 'created_at'), testCase._out.createExpiredOrderPaybackOutcome);
        }
      };
    }

    it('payback > payback fee (>0, percent) + transaction fee (>0)', runTestCase(paybackCases.case1));
    it('payback > payback fee (>0, percent, defined both fixed and percent) + transaction fee (>0)', runTestCase(paybackCases.case2));
    it('payback > payback fee (>0, fixed) + transaction fee (>0)', runTestCase(paybackCases.case3));
    it('payback > payback fee (0) + transaction fee (>0)', runTestCase(paybackCases.case4));
    it('payback > payback fee (0) + transaction fee (0)', runTestCase(paybackCases.case5));
    it('payback > payback fee (unset) + transaction fee (unset)', runTestCase(paybackCases.case6));
    it('payback =< payback fee (>0) + transaction fee (>0)', runTestCase(paybackCases.case7));
    it('payback =< payback fee (>0) + transaction fee (0)', runTestCase(paybackCases.case8));
    it('payback =< payback fee (0) + transaction fee (>0)', runTestCase(paybackCases.case9));
  });
});
