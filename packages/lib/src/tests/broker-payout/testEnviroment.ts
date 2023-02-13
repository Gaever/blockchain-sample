import { Deal, ExchangeConfig, Order, Outcome } from '@/types/stock';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import defaultStockConfigRecord from '../default-stock-config-record';

export type TCase = {
  _in: { deal: Deal; order: Order; exchangeConfig?: ExchangeConfig };
  _out: { createOutcomesToClients: Outcome[]; createOutcomesToStockHolder: Outcome[]; createExpiredOrderPaybackOutcome: Outcome };
};

const exchangeConfig = _cloneDeep(defaultStockConfigRecord.config_json.exchangeConfig);
_set(exchangeConfig, 'id', 1);
_set(exchangeConfig, `${exchangeConfig.cur1}.fees.transactionFee`, '100');
_set(exchangeConfig, `${exchangeConfig.cur2}.fees.transactionFee`, '150');
_set(exchangeConfig, `${exchangeConfig.cur1}.fees.paybackFee.percent`, '0');
_set(exchangeConfig, `${exchangeConfig.cur1}.fees.paybackFee.fixed`, '0');
_set(exchangeConfig, `${exchangeConfig.cur2}.fees.paybackFee.percent`, '0');
_set(exchangeConfig, `${exchangeConfig.cur2}.fees.paybackFee.fixed`, '0');

export { exchangeConfig };
