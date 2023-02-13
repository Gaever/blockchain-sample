import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import testStockConfigRecord from '../stock-config-manager/cases/test-stock-config-record.json';

const _in = {
  coinJson: { url: 'http://localhost:8000/test-config' },
  stockConfigAddress: fullnodeEnviroment.xch.STOCK_CONFIG_ADDRESS,
  fromAddress: 'xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp',
  keyStorage: {
    xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
      sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
      pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
    },
  } as KeyStorage,
};
const _out = {
  transaction_json: JSON.stringify(_in.coinJson),
  config_tx_id: null,
  cur1: testStockConfigRecord.cur1,
  cur2: testStockConfigRecord.cur2,
  status: 'confirmed',
  config_json: testStockConfigRecord.config_json,
} as StockConfigRecord;

export { _in, _out };
