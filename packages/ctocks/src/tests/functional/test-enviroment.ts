import { ExchangeConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';

export const hddMainAddress = 'hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0';
export const achMainAddress = 'ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna';

export const stockConfigHddTx = 'd72eb05a161226a3a51c6ca84f68b65c392c64dd6cb84ddc3f78bf99c6002bc1';
export const stockConfigHddHeight = 937218;
export const stockConfigHddTimestamp = 1642806056;

const stockConfigRecord: StockConfigRecord = {
  config_tx_id: stockConfigHddTx,
  transaction_json: '{"url":"http://localhost:3000/test-config"}',
  cur1: 'hdd',
  cur2: 'ach',
  name: 'Test Stock',
  config_json: {
    name: 'Test Stock',
    fromHeight: '1',
    exchangeConfig: {
      cur1: 'hdd',
      cur2: 'ach',
      hdd: {
        minInAmountFixed: '0',
        orderLifetimeMs: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: {
            percent: '0.001',
            fixed: '0',
          },
          transactionFee: '0',
        },
        addresses: {
          hdd1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49q2gdc8f: '1',
          hdd1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9qk8de5n: '2',
        },
      },
      ach: {
        minInAmountFixed: '0',
        orderLifetimeMs: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: {
            percent: '0.001',
            fixed: '0',
          },
          transactionFee: '0',
        },
        addresses: {
          ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '1',
          ach1rqzu34weezuzadawpmn4n8x4h8939f77j33g9dd04f4ps0u0djjsxyg60h: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

export const exchangeConfig: ExchangeConfig = stockConfigRecord.config_json.exchangeConfig;

export const sellerRate1Tx = 'a480123f556cfefc650ee978f825132022e2a2e6b435f0c82d6e05157515fa55';
export const sellerRate1TxHeight = 936506;
export const sellerRate1TxTimestamp = 1642793618;

export const sellerRate2Tx = 'adf31a4d5be7c7de98901581c06ad3b3409c487a3b23ef45c550646d8ef823f4';
export const sellerRate2TxHeight = 936537;
export const sellerRate2TxTimestamp = 1642794268;

export const buyerRate1Tx = '875f3d7bfd19558fe0270b5a26296d52df587062aa26b349f40c061f9f89e25c';
export const buyerRate1TxHeight = 765831;
export const buyerRate1TxTimestamp = 1642794170;

export default stockConfigRecord;
