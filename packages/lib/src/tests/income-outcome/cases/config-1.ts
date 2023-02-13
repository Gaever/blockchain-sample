import { ExchangeConfig } from '@/types/stock';

const config: ExchangeConfig = {
  id: 1,
  cur1: 'xch',
  cur2: 'ach',
  xch: {
    orderLifetimeMs: '0',
    minInAmountFixed: '0',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      xch1zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8805ra: '1',
      xch1yqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsrys44: '2',
    },
  },
  ach: {
    orderLifetimeMs: '0',
    minInAmountFixed: '0',
    fees: {
      takerFee: { percent: '0.02', fixed: '0' },
      makerFee: { percent: '0.01', fixed: '0' },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      ach1zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7s7dqp: '1',
      ach1yqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqf54fkf: '2',
    },
  },
};

export default config;
