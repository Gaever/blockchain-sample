import { CurSeriesRecord, Deal } from '@ctocker/lib/build/main/src/types/stock';
import BigNumber from 'bignumber.js';
import moment from 'moment';

const d = moment(1637561220780);

const arr: { created_at: moment.Moment; amount2: number; amount1: number; rate: number }[] = [
  { created_at: d.clone().add(0, 'seconds'), amount1: 100, amount2: 50, rate: 1.5 },
  { created_at: d.clone().add(20, 'seconds'), amount1: 300, amount2: 150, rate: 2 },
  { created_at: d.clone().add(59, 's'), amount1: 200, amount2: 100, rate: 1.7 },

  { created_at: d.clone().add(61, 's'), amount1: 180, amount2: 90, rate: 2.2 },
  { created_at: d.clone().add(80, 's'), amount1: 160, amount2: 80, rate: 1.8 },
  { created_at: d.clone().add(110, 's'), amount1: 220, amount2: 110, rate: 2.5 },
];

const deals: Deal[] = arr.map(item => ({
  stock_id: 1,
  created_at: item.created_at.toDate(),
  seller_amount_in_cur2: new BigNumber(item.amount1),
  buyer_amount_in_cur1: new BigNumber(item.amount2),
  buyer_puzzle_hash: '',
  seller_puzzle_hash: '',
  rate1_puzzle_hash: '',
  rate2_puzzle_hash: '',
  cur1: 'xch',
  cur2: 'ach',
  seller_order_id: 1,
  buyer_order_id: 2,
  status: 'paid-out',
  seller_fee_in_cur2: new BigNumber(0),
  buyer_fee_in_cur1: new BigNumber(0),
  rate: new BigNumber(item.rate),
}));

const curSeriesArr: CurSeriesRecord[] = [
  {
    time: d.clone().add(59, 'seconds').toDate(),
    opening_price: '1.5',
    highest_price: '2',
    lowest_price: '1.5',
    closing_price: '1.7',
    volume_1: '300',
    volume_2: '600',
  },
  {
    time: d.clone().add(110, 'seconds').toDate(),
    opening_price: '2.2',
    highest_price: '2.5',
    lowest_price: '1.8',
    closing_price: '2.5',
    volume_1: '280',
    volume_2: '560',
  },
];

const _in: Deal[] = deals;
const _out: CurSeriesRecord[] = curSeriesArr;

export default { _in, _out };
