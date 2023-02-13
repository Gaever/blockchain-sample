import { currency, Order } from '@/types/stock';
import { createOrder as createOrderHelper } from '../helpers';
import config from './exchange-config';
export { createDeal } from '../helpers';

export function createOrder(amount: string, rate: string, createdAt: Date, cur1: currency, cur2: currency): Order {
  return createOrderHelper(amount, rate, createdAt, cur1, cur2, config);
}
