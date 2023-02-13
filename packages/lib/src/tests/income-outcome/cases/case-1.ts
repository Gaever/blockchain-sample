import BigNumber from 'bignumber.js';
import { TestCase } from '../income-outcome.test';

const testCase: TestCase = {
  _in: [
    {
      id: 1,
      stock_id: 1,
      cur: 'xch',
      amount: '10000',
      client_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      rate_puzzle_hash: '0x2000000000000000000000000000000000000000000000000000000000000000',
      height: 1,
      created_at: new Date(1),
      status: 'new',
      tx_id: '0x0000000000000000000000000000000000000000000000000000000000000cc1',
      rate: '2',
    },
    {
      id: 2,
      stock_id: 1,
      cur: 'ach',
      amount: '20',
      client_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000002',
      rate_puzzle_hash: '0x2000000000000000000000000000000000000000000000000000000000000000',
      height: 2,
      created_at: new Date(2),
      status: 'new',
      tx_id: '0x0000000000000000000000000000000000000000000000000000000000000cc2',
      rate: '2',
    },
  ],
  _out: {
    outcomes: [
      {
        cur: 'ach',
        amount: new BigNumber(19),
        client_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
        stock_holder_puzzle_hash: undefined,
        created_at: null,
        deal_id: 1,
        status: 'created',
        transaction_fee: new BigNumber(0),
      },
      {
        cur: 'xch',
        amount: new BigNumber(9800),
        client_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000002',
        stock_holder_puzzle_hash: undefined,
        created_at: null,
        deal_id: 1,
        status: 'created',
        transaction_fee: new BigNumber(0),
      },
      {
        cur: 'ach',
        amount: new BigNumber(1),
        stock_holder_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000004',
        client_puzzle_hash: undefined,
        created_at: null,
        deal_id: 1,
        status: 'created',
        transaction_fee: new BigNumber(0),
      },
      {
        cur: 'xch',
        amount: new BigNumber(200),
        stock_holder_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000003',
        client_puzzle_hash: undefined,
        created_at: null,
        deal_id: 1,
        status: 'created',
        transaction_fee: new BigNumber(0),
      },
    ],
  },
};

export default testCase;
