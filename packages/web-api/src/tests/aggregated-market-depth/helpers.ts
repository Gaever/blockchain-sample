import { currency, Order } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';

export function createOrder(amount: string, rate: string, createdAt: Date, cur1: currency, cur2: currency): Order {
  const isSell = cur1 === 'xch';
  return {
    amount: new BigNumber(amount),
    start_amount: new BigNumber(amount),
    created_at: createdAt,
    cur1,
    cur2,
    is_sell: isSell,
    rate: new BigNumber(rate),
    status: 'queued',
  };
}
