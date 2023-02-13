import { ExchangeConfig } from '@/types/stock';

const config: ExchangeConfig = {
  id: 1,
  cur1: 'xch',
  cur2: 'ach',
  xch: {
    orderLifetimeMs: '6000000',
    minInAmountFixed: '0',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx2slsdkst: '0.995',
      xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxtq9v25w7: '0.996',
      xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxtssdzvmd: '0.997',
    },
  },
  ach: {
    orderLifetimeMs: '600000',
    minInAmountFixed: '0',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      ach1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx2sx8u0nh: '0.995',
      ach1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxtqummddz: '0.996',
      ach1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxtsf6n4c3: '0.997',
    },
  },
};

export default config;
