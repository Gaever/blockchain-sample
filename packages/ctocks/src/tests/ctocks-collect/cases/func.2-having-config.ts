import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';

const _in: StockConfigRecord = defaultStockConfigRecord;

const second: StockConfigRecord = {
  ...defaultStockConfigRecord,
  transaction_json: '{"url": "http://localhost:8000/test-config2"}',
  config_tx_id: '2',
  config_json: {
    fromHeight: '1',
    name: 'test stock 2',
    exchangeConfig: {
      ...defaultStockConfigRecord.config_json.exchangeConfig,
      xch: {
        ...defaultStockConfigRecord.config_json.exchangeConfig.xch,
        addresses: {
          xch1pwupfawcuet5hhsl3x8rnf7nje7svu5vewujvrxuz9ljatv7c3lq4yqztc: '1',
          xch10xhk9ld59v784n7u5tt96gq0glqt9ewr9m69pl0k7r24gjyl97msad8pck: '2',
          xch1m8jvwj3l9x3ydqx936jczvfx0xw8qp7fncywnmfw5z8lwzznd26s348k8y: '3',
        },
      },
      ach: {
        ...defaultStockConfigRecord.config_json.exchangeConfig.ach,
        addresses: {
          ach1kfgx5654syh8uujvu2hxq640yqufxmz8pkdykc6vnr5rs4kegvnswc9xcv: '1',
          ach1ktg0jcfphtsqu7uhldeyt49xctcjaf2mx0eluvhzck6gwj5tjvkqq4x0hs: '2',
          ach1c67vv8sgur03a768tzuyudvtfy3lulvv8n8v3796ju48llz8ryeqe9w8u3: '3',
        },
      },
    },
  },
  status: 'new',
};

const _out = {
  first: defaultStockConfigRecord,
  second,
};

export default { _in, _out };
