import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';

const _in: StockConfigRecord = {
  ...defaultStockConfigRecord,
  transaction_json: '{"url": "http://localhost:8000/test-config1"}',
  config_json: null,
  status: 'new',
  cur1: null,
  cur2: null,
};

const _out = {
  stockConfigRecord: defaultStockConfigRecord,
};

export default { _in, _out };
