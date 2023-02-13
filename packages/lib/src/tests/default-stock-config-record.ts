import { StockConfigRecord } from '@/types/stock';

const defaultStockConfigRecord: StockConfigRecord = {
  config_tx_id: '1',
  transaction_json: '{"url": "http://localhost:3000/test-config"}',
  cur1: 'xch',
  name: 'Test Stock',
  cur2: 'ach',
  config_json: {
    name: 'Test Stock',
    fromHeight: '1',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        minInAmountFixed: '0',
        orderLifetimeMs: '60000000',
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
          xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '1',
          xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '1.5',
          xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '2',
        },
      },
      ach: {
        minInAmountFixed: '0',
        orderLifetimeMs: '60000000',
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
          ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: '1',
          ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '1.5',
          ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

export default defaultStockConfigRecord;
