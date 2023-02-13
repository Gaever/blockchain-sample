import BigNumber from 'bignumber.js';
import { sha256 } from 'js-sha256';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import { exchangeConfig as defaultExchangeConfig, TCase } from '../testEnviroment';

// @ts-ignore
const d1 = new Date(1638531562769);
const d2 = new Date(1638531562600);
const d3 = new Date(1638531572600);

const testCase: TCase = {
  _in: {
    deal: null,
    order: {
      id: 3,
      stock_id: defaultExchangeConfig.id,
      created_at: d2,
      expires_at: d3,
      amount: new BigNumber(50),
      start_amount: new BigNumber(50),
      rate: new BigNumber('1'),
      cur1: defaultExchangeConfig.cur1,
      cur2: defaultExchangeConfig.cur2,
      client_puzzle_hash: sha256('client3_puzzle_hash'),
      rate_puzzle_hash: sha256('stock_puzzle_hash'),
      status: 'queued',
      income_id: 1,
    },
  },
  _out: {
    createOutcomesToClients: [],
    createOutcomesToStockHolder: [],
    createExpiredOrderPaybackOutcome: {
      amount: new BigNumber(0),
      transaction_fee: new BigNumber(defaultExchangeConfig[defaultExchangeConfig.cur1].fees.transactionFee),
      payback_fee: new BigNumber(0),
      client_puzzle_hash: sha256('client3_puzzle_hash'),
      cur: defaultExchangeConfig.cur1,
      status: 'done',
      order_id: 3,
      stock_id: defaultExchangeConfig.id,
    },
  },
};

const case1 = (() => {
  const _case = _cloneDeep(testCase);

  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0.002');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0.002');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '0');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(9970));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('10'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('20'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case2 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0.002');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '100');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0.002');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '100');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(9970));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('10'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('20'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case3 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '100');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '100');
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(9890));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('10'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('100'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case4 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '10');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '0');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(9990));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('10'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case5 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '0');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(10000));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case6 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '0');

  delete exchangeConfig[defaultExchangeConfig.cur1].fees.paybackFee.fixed;
  delete exchangeConfig[defaultExchangeConfig.cur1].fees.paybackFee.percent;
  delete exchangeConfig[defaultExchangeConfig.cur2].fees.paybackFee.fixed;
  delete exchangeConfig[defaultExchangeConfig.cur2].fees.paybackFee.percent;

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(10000));
  _set(_case, `_in.order.start_amount`, new BigNumber(10000));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(10000));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'created');

  return _case;
})();

const case7 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '20');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '20');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '70');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '70');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(90));
  _set(_case, `_in.order.start_amount`, new BigNumber(90));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(0));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('20'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('70'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'done');

  return _case;
})();

const case8 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '100');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '100');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(90));
  _set(_case, `_in.order.start_amount`, new BigNumber(90));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(0));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('100'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'done');

  return _case;
})();

const case9 = (() => {
  const _case = _cloneDeep(testCase);
  const exchangeConfig = _cloneDeep(defaultExchangeConfig);

  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.transactionFee`, '100');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.transactionFee`, '100');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur1}.fees.paybackFee.fixed`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.percent`, '0');
  _set(exchangeConfig, `${defaultExchangeConfig.cur2}.fees.paybackFee.fixed`, '0');

  _set(_case, `_in.exchangeConfig`, exchangeConfig);

  _set(_case, `_in.order.amount`, new BigNumber(90));
  _set(_case, `_in.order.start_amount`, new BigNumber(90));

  _set(_case, `_out.createExpiredOrderPaybackOutcome.amount`, new BigNumber(0));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.transaction_fee`, new BigNumber('100'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.payback_fee`, new BigNumber('0'));
  _set(_case, `_out.createExpiredOrderPaybackOutcome.status`, 'done');

  return _case;
})();

export { case1, case2, case3, case4, case5, case6, case7, case8, case9 };
