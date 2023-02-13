import { ExchangeConfig } from '@/types/stock';

const config: ExchangeConfig = {
  id: 1,
  cur1: 'xch',
  cur2: 'ach',
  xch: {
    orderLifetimeMs: '6000000',
    minInAmountFixed: '100',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      xch1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqslaehr3: '1',
    },
  },
  ach: {
    orderLifetimeMs: '600000',
    minInAmountFixed: '100',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      ach1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsx2gwqd: '1',
    },
  },
};

export default config;
