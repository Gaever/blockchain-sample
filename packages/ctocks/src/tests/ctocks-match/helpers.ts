import { CurSeriesElements, Deal } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';

export const createDeal = (created_at: Date, rate: string, amount1: string, amount2: string): Deal => ({
  created_at,
  seller_puzzle_hash: '',
  buyer_puzzle_hash: '',
  rate1_puzzle_hash: '',
  rate2_puzzle_hash: '',
  cur1: 'xch',
  cur2: 'ach',
  seller_amount_in_cur2: new BigNumber(amount1),
  buyer_amount_in_cur1: new BigNumber(amount2),
  rate: new BigNumber(rate),
  seller_fee_in_cur2: new BigNumber(0),
  buyer_fee_in_cur1: new BigNumber(0),
  seller_order_id: 1,
  buyer_order_id: 2,
  status: 'new',
  stock_id: 1,
});

export interface TestCase {
  _in: {
    deals: Deal[];
    lastElements: CurSeriesElements;
  };
  _out: {
    toAdd: CurSeriesElements;
    toUpdate: CurSeriesElements;
  };
}
