import BigNumber from 'bignumber.js';
import { sha256 } from 'js-sha256';
import { exchangeConfig, TCase } from '../testEnviroment';

const d1 = new Date(1638531562769);
const d2 = new Date(1638531562600);
const d3 = new Date(1638531572600);

const testCase: TCase = {
  _in: {
    deal: {
      id: 1,
      created_at: d1,
      seller_puzzle_hash: sha256('client1_puzzle_hash'),
      buyer_puzzle_hash: sha256('client2_puzzle_hash'),
      rate1_puzzle_hash: sha256('stock1_puzzle_hash'),
      rate2_puzzle_hash: sha256('stock2_puzzle_hash'),
      cur1: exchangeConfig.cur1,
      cur2: exchangeConfig.cur2,
      seller_amount_in_cur2: new BigNumber(1000),
      buyer_amount_in_cur1: new BigNumber(1000),
      rate: new BigNumber('1'),
      seller_fee_in_cur2: new BigNumber(200),
      buyer_fee_in_cur1: new BigNumber(250),
      seller_order_id: 1,
      buyer_order_id: 2,
      status: 'new',
      stock_id: exchangeConfig.id,
    },
    order: {
      id: 3,
      stock_id: exchangeConfig.id,
      created_at: d2,
      expires_at: d3,
      amount: new BigNumber(1000),
      start_amount: new BigNumber(1000),
      rate: new BigNumber('1'),
      cur1: exchangeConfig.cur1,
      cur2: exchangeConfig.cur2,
      client_puzzle_hash: sha256('client3_puzzle_hash'),
      rate_puzzle_hash: sha256('stock_puzzle_hash'),
      status: 'queued',
      income_id: 1,
    },
  },
  _out: {
    createOutcomesToClients: [
      {
        amount: new BigNumber(650),
        transaction_fee: new BigNumber(exchangeConfig[exchangeConfig.cur2].fees.transactionFee),
        client_puzzle_hash: sha256('client1_puzzle_hash'),
        stock_holder_puzzle_hash: undefined,
        cur: exchangeConfig.cur2,
        status: 'created',
        deal_id: 1,
        stock_id: exchangeConfig.id,
      },
      {
        amount: new BigNumber(650),
        transaction_fee: new BigNumber(exchangeConfig[exchangeConfig.cur1].fees.transactionFee),
        client_puzzle_hash: sha256('client2_puzzle_hash'),
        stock_holder_puzzle_hash: undefined,
        cur: exchangeConfig.cur1,
        status: 'created',
        deal_id: 1,
        stock_id: exchangeConfig.id,
      },
    ],
    createOutcomesToStockHolder: [
      {
        amount: new BigNumber(50),
        transaction_fee: new BigNumber(exchangeConfig[exchangeConfig.cur2].fees.transactionFee),
        client_puzzle_hash: undefined,
        stock_holder_puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        cur: exchangeConfig.cur2,
        status: 'created',
        deal_id: 1,
        stock_id: exchangeConfig.id,
      },
      {
        amount: new BigNumber(150),
        transaction_fee: new BigNumber(exchangeConfig[exchangeConfig.cur1].fees.transactionFee),
        client_puzzle_hash: undefined,
        stock_holder_puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        cur: exchangeConfig.cur1,
        status: 'created',
        deal_id: 1,
        stock_id: exchangeConfig.id,
      },
    ],
    createExpiredOrderPaybackOutcome: {
      amount: new BigNumber(900),
      transaction_fee: new BigNumber(exchangeConfig[exchangeConfig.cur1].fees.transactionFee),
      payback_fee: new BigNumber(0),
      client_puzzle_hash: sha256('client3_puzzle_hash'),
      cur: exchangeConfig.cur1,
      status: 'created',
      order_id: 3,
      stock_id: exchangeConfig.id,
    },
  },
};

export default testCase;
