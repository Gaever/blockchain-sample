import { StockConfigTxRecord, TxRecord } from '@/types/blockchain';
import { currency } from '@/types/stock';
import { puzzleHashToAddress } from '@/utils';
import { puzzle_hash_to_address } from '@/utils/puzzle-hash';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import fullnodeEnviroment from '../blockchain/fullnode-enviroment';
import { mojosToCoins } from '../lookup/matcher';

function toCoins(amount: string, cur: currency) {
  return mojosToCoins(new BigNumber(amount || '0'), new BigNumber(fullnodeEnviroment[cur].MOJO_IN_COIN)).toString();
}

function formatDate(date: any) {
  return moment(date).format('YYYY-MM-DD HH:mm:ssZZ');
}

export function formatIncome(item: any) {
  return {
    'income id': item.id,
    created: formatDate(item.created_at),
    height: item.height,
    'header hash': item.header_hash,
    rate: item.rate,
    currency: item.cur,
    [`amount (${item.cur} mojo)`]: item.amount,
    [`amount (${item.cur} coins)`]: toCoins(item.amount, item.cur),
    status: item.status,
    'client address': puzzle_hash_to_address(item.client_puzzle_hash, item.cur),
    'rate address': puzzle_hash_to_address(item.rate_puzzle_hash, item.cur),
    'client puzzle hash': item.client_puzzle_hash,
    'rate puzzle hash': item.rate_puzzle_hash,
    tx: item.tx_id,
    'stock id': item.stock_id,
  };
}

export function formatOrder(item: any, showAll: boolean = false) {
  return {
    'order id': item.id,
    'income id': item.income_id,
    created: formatDate(item.created_at),
    'expires at': formatDate(item.expires_at),
    rate: item.rate,
    [`amount (${item.cur1} mojo)`]: item.amount,
    [`amount (${item.cur1} coins)`]: toCoins(item.amount, item.cur1),
    'exchange from cur': item.cur1,
    'exchange to cur': item.cur2,
    'is sell': item.is_sell,
    status: item.status,
    ...(showAll
      ? {
          'client puzzle hash': item.client_puzzle_hash,
          'client address': item.client_puzzle_hash ? puzzleHashToAddress(item.client_puzzle_hash, item.cur1) : '',
          'rate puzzle hash': item.rate_puzzle_hash,
          'rate address': item.rate_puzzle_hash ? puzzleHashToAddress(item.rate_puzzle_hash, item.cur1) : '',
        }
      : null),
  };
}

export function formatTxRecord(item: TxRecord) {
  return {
    'tx id': item.txId,
    'header hash': item.headerHash,
    height: item.height,
    'from puzzle hash': item.fromPuzzleHash,
    'from address': puzzleHashToAddress(item.fromPuzzleHash, item.cur),
    'to puzzle hash': item.toPuzzleHash,
    'to address': puzzleHashToAddress(item.toPuzzleHash, item.cur),
    'created at': new Date(item.createdAtTime * 1000),
    cur: item.cur,
  };
}

export function formatStockConfigTxRecord(item: StockConfigTxRecord) {
  return {
    ...formatTxRecord(item),
    ...(item.json ? { 'stock config json': item.json } : null),
  };
}

export function formatDeal(item: any) {
  const sellerRecievesMojo = item.seller_amount_in_cur2;
  const sellerRecievesCoins = toCoins(item.seller_amount_in_cur2, item.cur2);

  const buyesRecievesMojo = item.buyer_amount_in_cur1;
  const buyesRecievesCoins = toCoins(item.buyer_amount_in_cur1, item.cur1);

  return {
    seller: `sold ${buyesRecievesCoins} ${item.cur1} for ${sellerRecievesCoins} ${item.cur2}`,
    buyer: `bought ${sellerRecievesCoins} ${item.cur2} for ${buyesRecievesCoins} ${item.cur1}`,
    'Taker is': `${item.is_sell ? 'seller' : 'buyer'}`,
    'deal id': item.id,
    'seller order id': item.seller_order_id,
    'buyer order id': item.buyer_order_id,
    'taker order id': item.taker_order_id,
    'is sell': item.is_sell,
    created: formatDate(item.created_at),
    'root cur': item.cur1,
    'minor cur': item.cur2,
    [`seller recieves ${item.cur2} mojo`]: sellerRecievesMojo,
    [`seller recieves ${item.cur2} coins`]: sellerRecievesCoins,
    [`buyer recieves ${item.cur1} mojo`]: buyesRecievesMojo,
    [`buyer recieves ${item.cur1} coins`]: buyesRecievesCoins,
    [`seller fee in ${item.cur2} mojo`]: item.seller_fee_in_cur2,
    [`seller fee in ${item.cur2} coins`]: toCoins(item.seller_fee_in_cur2, item.cur2),
    [`buyer fee in ${item.cur1} mojo`]: item.buyer_fee_in_cur1,
    [`buyer fee in ${item.cur1} coins`]: toCoins(item.buyer_fee_in_cur1, item.cur1),
    rate: item.rate,
    'seller puzzle hash': item.seller_puzzle_hash,
    'buyer puzzle hash': item.buyer_puzzle_hash,
    [`seller ${item.cur1} address`]: puzzle_hash_to_address(item.seller_puzzle_hash, item.cur1),
    [`seller ${item.cur2} address`]: puzzle_hash_to_address(item.seller_puzzle_hash, item.cur2),
    [`buyer ${item.cur1} address`]: puzzle_hash_to_address(item.buyer_puzzle_hash, item.cur1),
    [`buyer ${item.cur2} address`]: puzzle_hash_to_address(item.buyer_puzzle_hash, item.cur2),
    [`sell rate (${item.cur1}) ph`]: item.rate1_puzzle_hash,
    [`buy rate (${item.cur2}) ph`]: item.rate2_puzzle_hash,
    [`sell rate (${item.cur1}) address`]: puzzle_hash_to_address(item.rate1_puzzle_hash, item.cur1),
    [`buy rate (${item.cur2}) address`]: puzzle_hash_to_address(item.rate2_puzzle_hash, item.cur2),
    status: item.status,
  };
}

export function formatOutcome(item: any) {
  return {
    'outcome id': item.id,
    'deal id': item.deal_id,
    'order id': item.order_id,
    tx: item.tx_id,
    height: item.height,
    'header hash': item.header_hash,
    created: formatDate(item.created_at),
    currency: item.cur,
    [`amount in ${item.cur} mojo`]: item.amount,
    [`amount in ${item.cur} coins`]: toCoins(item.amount, item.cur),
    [`transaction fee in ${item.cur} mojo`]: item.transaction_fee,
    [`transaction fee in ${item.cur} coins`]: toCoins(item.transaction_fee, item.cur),
    [`payback_fee fee in ${item.cur} mojo`]: item.payback_fee || '0',
    [`payback fee fee in ${item.cur} coins`]: toCoins(item.payback_fee, item.cur),
    'client puzzle hash': item.client_puzzle_hash,
    [`client ${item.cur} address`]: (item.client_puzzle_hash && puzzle_hash_to_address(item.client_puzzle_hash, item.cur)) || '',
    'stock holder puzzle hash': item.stock_holder_puzzle_hash,
    [`stock holder ${item.cur} address`]: (item.stock_holder_puzzle_hash && puzzle_hash_to_address(item.stock_holder_puzzle_hash, item.cur)) || '',
    status: item.status,
  };
}
