import BrokerOutcomes from '@/services/broker/broker-outcomes';
import { mojo1ToMojo2 } from '@/services/lookup/matcher';
import Stock from '@/services/stock';
import { Income, Outcome } from '@/types/stock';
import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import _flatten from 'lodash/flatten';
import _omit from 'lodash/omit';
import case1 from './cases/case-1';
import exchangeConfig from './cases/config-1';

export interface TestCase {
  _in: Income[];
  _out: {
    outcomes: Outcome[];
  };
}

const prev_CUR1_STOCK_HOLDER_ADDRESS = process.env.CUR1_STOCK_HOLDER_ADDRESS;
const prev_CUR2_STOCK_HOLDER_ADDRESS = process.env.CUR2_STOCK_HOLDER_ADDRESS;

describe('Incomes to outcomes', function () {
  this.beforeAll(function () {
    process.env.CUR1_STOCK_HOLDER_ADDRESS = 'xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpssqkdgh';
    process.env.CUR2_STOCK_HOLDER_ADDRESS = 'ach1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzqdc7trj';
  });

  this.afterAll(function () {
    process.env.CUR1_STOCK_HOLDER_ADDRESS = prev_CUR1_STOCK_HOLDER_ADDRESS;
    process.env.CUR2_STOCK_HOLDER_ADDRESS = prev_CUR2_STOCK_HOLDER_ADDRESS;
  });

  function runTest(testCase: TestCase) {
    return function () {
      const stock = new Stock(exchangeConfig);
      const brokerOutcome = new BrokerOutcomes();

      brokerOutcome.init(exchangeConfig);

      const incomes = testCase._in;
      const orders = incomes.map(stock.incomeToOrder);
      const matches = orders.map(stock.matchNewOrder);

      const deals = _flatten(matches.map((match) => match.newDeals));

      const outcomes = _flatten(
        deals.map((deal) => {
          const clientsOutcomes = brokerOutcome.createOutcomesToClients(deal);
          const stockHolderOutcomes = brokerOutcome.createOutcomesToStockHolder(deal);

          return [...clientsOutcomes, ...stockHolderOutcomes];
        })
      );

      assert.deepEqual(
        outcomes.map((item) => _omit(item, ['created_at', 'deal_id', 'stock_id'])),
        testCase._out.outcomes.map((item) => _omit(item, ['created_at', 'deal_id', 'stock_id']))
      );
      assert.deepEqual(stock.marketDepth.buy, []);
      assert.deepEqual(stock.marketDepth.sell, []);
    };
  }

  it('mojo1ToMojo2, xch -> ach', function () {
    const amount2 = mojo1ToMojo2(new BigNumber(1000), new BigNumber(1000000000000), new BigNumber(1000000000));
    assert.equal(amount2.toNumber(), 1);
  });

  it('mojo1ToMojo2, xch -> ach, xch is too small', function () {
    const amount2 = mojo1ToMojo2(new BigNumber(999), new BigNumber(1000000000000), new BigNumber(1000000000));
    assert.equal(amount2.toNumber(), 0);
  });

  it('mojo1ToMojo2, ach -> xch', function () {
    const amount2 = mojo1ToMojo2(new BigNumber(1), new BigNumber(1000000000), new BigNumber(1000000000000));
    assert.equal(amount2.toNumber(), 1000);
  });

  it('Full match', runTest(case1));
});
