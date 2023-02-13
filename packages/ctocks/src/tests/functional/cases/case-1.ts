import { rateToPuzzleHash } from '@ctocker/lib/build/main/src/tests/helpers';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import { TestCase } from '../ctocks.func.test';
import stockConfigRecord, {
  achMainAddress,
  buyerRate1Tx,
  buyerRate1TxHeight,
  buyerRate1TxTimestamp,
  hddMainAddress,
  sellerRate1Tx,
  sellerRate1TxHeight,
  sellerRate1TxTimestamp,
} from '../test-enviroment';

const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;

const sellerPh = addressToPuzzleHash(hddMainAddress);
const buyerPh = addressToPuzzleHash(achMainAddress);

function getTestCase(stockId: number): ReturnType<TestCase['getTestCase']> {
  const incomes = [
    {
      tx_id: sellerRate1Tx,
      height: sellerRate1TxHeight,
      created_at: new Date(sellerRate1TxTimestamp * 1000),
      client_puzzle_hash: sellerPh,
      rate_puzzle_hash: rateToPuzzleHash('hdd', '1', exchangeConfig),
      cur: 'hdd',
      amount: '10000',
      status: 'proceded',
      stock_id: stockId,
      rate: '1',
    },
    {
      tx_id: buyerRate1Tx,
      height: buyerRate1TxHeight,
      created_at: new Date(buyerRate1TxTimestamp * 1000),
      client_puzzle_hash: buyerPh,
      rate_puzzle_hash: rateToPuzzleHash('ach', '1', exchangeConfig),
      cur: 'ach',
      amount: '10',
      status: 'proceded',
      stock_id: stockId,
      rate: '1',
    },
  ];

  const orders = [
    {
      stock_id: stockId,
      amount: '0',
      start_amount: '10000',
      rate: '1',
      is_sell: true,
      cur1: 'hdd',
      cur2: 'ach',
      client_puzzle_hash: sellerPh,
      rate_puzzle_hash: rateToPuzzleHash('hdd', '1', exchangeConfig),
      status: 'done',
    },
    {
      stock_id: stockId,
      amount: '0',
      start_amount: '10',
      rate: '1',
      is_sell: false,
      cur1: 'ach',
      cur2: 'hdd',
      client_puzzle_hash: buyerPh,
      rate_puzzle_hash: rateToPuzzleHash('ach', '1', exchangeConfig),
      status: 'done',
    },
  ];

  const deals = [
    {
      seller_puzzle_hash: sellerPh,
      buyer_puzzle_hash: buyerPh,
      rate1_puzzle_hash: rateToPuzzleHash('hdd', '1', exchangeConfig),
      rate2_puzzle_hash: rateToPuzzleHash('ach', '1', exchangeConfig),
      cur1: 'hdd',
      cur2: 'ach',
      seller_amount_in_cur2: '10',
      buyer_amount_in_cur1: '10000',
      rate: '1',
      seller_fee_in_cur2: '1',
      buyer_fee_in_cur1: '200',
      status: 'new',
      stock_id: stockId,
      is_sell: true,
    },
  ];

  const outcomes = [];

  return {
    in: {
      hdd: {
        fromHeight: sellerRate1TxHeight - 1,
        toHeight: sellerRate1TxHeight,
      },
      ach: {
        fromHeight: buyerRate1TxHeight - 1,
        toHeight: buyerRate1TxHeight,
      },
    },
    out: {
      incomes,
      orders,
      deals,
      outcomes,
      blockchainConfig: {
        hdd: {
          cur: 'hdd',
          last_known_height: sellerRate1TxHeight,
          service_start_height: sellerRate1TxHeight - 1,
        },
        ach: {
          cur: 'ach',
          last_known_height: buyerRate1TxHeight,
          service_start_height: buyerRate1TxHeight - 1,
        },
      },
    },
  };
}

const testCase: TestCase = {
  stockConfigRecord,
  getTestCase,
};

export default testCase;
