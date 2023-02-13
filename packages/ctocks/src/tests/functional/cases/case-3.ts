import { rateToPuzzleHash } from '@ctocker/lib/build/main/src/tests/helpers';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import _cloneDeep from 'lodash/cloneDeep';
import { TestCase } from '../ctocks.func.test';
import stockConfigRecord, {
  achMainAddress,
  buyerRate1Tx,
  buyerRate1TxHeight,
  buyerRate1TxTimestamp,
  hddMainAddress,
  sellerRate2Tx,
  sellerRate2TxHeight,
  sellerRate2TxTimestamp,
} from '../test-enviroment';

const config = _cloneDeep(stockConfigRecord);

const sellerPh = addressToPuzzleHash(hddMainAddress);
const buyerPh = addressToPuzzleHash(achMainAddress);

const exchangeConfig = config.config_json.exchangeConfig;

function getTestCase(stockId: number, now: Date): ReturnType<TestCase['getTestCase']> {
  const incomes = [
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
    {
      tx_id: sellerRate2Tx,
      height: sellerRate2TxHeight,
      created_at: new Date(sellerRate2TxTimestamp * 1000),
      client_puzzle_hash: sellerPh,
      rate_puzzle_hash: rateToPuzzleHash('hdd', '2', exchangeConfig),
      cur: 'hdd',
      amount: '10000',
      status: 'proceded',
      stock_id: stockId,
      rate: '2',
    },
  ];

  const orders = [
    {
      created_at: new Date(buyerRate1TxTimestamp * 1000),
      expires_at: new Date(now.getTime() + 5000),
      stock_id: stockId,
      amount: '10',
      start_amount: '10',
      rate: '1',
      is_sell: false,
      cur1: 'ach',
      cur2: 'hdd',
      client_puzzle_hash: buyerPh,
      rate_puzzle_hash: rateToPuzzleHash('ach', '1', exchangeConfig),
      status: 'expired',
    },
    {
      created_at: new Date(sellerRate2TxTimestamp * 1000),
      expires_at: new Date(now.getTime() + 5000),
      stock_id: stockId,
      amount: '10000',
      start_amount: '10000',
      rate: '2',
      is_sell: true,
      cur1: 'hdd',
      cur2: 'ach',
      client_puzzle_hash: sellerPh,
      rate_puzzle_hash: rateToPuzzleHash('hdd', '2', exchangeConfig),
      status: 'expired',
    },
  ];

  const deals = [];

  const outcomes = [];

  return {
    in: {
      hdd: {
        fromHeight: sellerRate2TxHeight - 1,
        toHeight: sellerRate2TxHeight,
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
          last_known_height: sellerRate2TxHeight,
          service_start_height: sellerRate2TxHeight - 1,
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
  stockConfigRecord: config,
  getTestCase,
};

export default testCase;
