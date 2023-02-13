import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { createTxRecord, rateToAddress } from '@ctocker/lib/build/main/src/tests/helpers';
import { BcWalk } from '@ctocker/lib/build/main/src/types/blockchain';
import { sha256 } from 'js-sha256';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

const stockConfigRecord = _cloneDeep(defaultStockConfigRecord);

_set(stockConfigRecord, 'config_json.exchangeConfig.xch.orderLifetimeMs', 1000 * 10);
_set(stockConfigRecord, 'config_json.exchangeConfig.ach.orderLifetimeMs', 1000 * 10);

_set(stockConfigRecord, 'config_json.exchangeConfig.xch.minInAmountFixed', '100');
_set(stockConfigRecord, 'config_json.exchangeConfig.ach.minInAmountFixed', '100');

export { stockConfigRecord };

const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;

const txIdAlias1 = uuid();
const txIdAlias2 = uuid();
const txIdAlias3 = uuid();
const txIdAlias4 = uuid();

const txRecord1 = createTxRecord({
  txIdAlias: txIdAlias1,
  headerHashAlias: 'headerHash1',
  blockIndex: 100000,
  parentCoinInfoAlias: 'parent_coin1',
  amount: '100000',
  fromAddress: 'xch1x5pay2ukwsgc8jjk4ck3rs3s0m8cpq92mucyapmgje0js07vdgtsw4gdtp',
  toAddress: rateToAddress(exchangeConfig.cur1, '1.5', exchangeConfig),
  cur: exchangeConfig.cur1,
  createdAt: Math.floor(moment().subtract(3, 's').toDate().getTime() / 1000),
});

const txRecord2 = createTxRecord({
  txIdAlias: txIdAlias2,
  headerHashAlias: 'headerHash2',
  blockIndex: 100000,
  parentCoinInfoAlias: 'parent_coin2',
  amount: '150000',
  fromAddress: 'ach19jmnup4wg4c7md723mtcgsm283c2kt7fv0gjk0zuuglz3d0wefns4xu8a7',
  toAddress: rateToAddress(exchangeConfig.cur2, '1.5', exchangeConfig),
  cur: exchangeConfig.cur2,
  createdAt: Math.floor(moment().subtract(2, 's').toDate().getTime() / 1000),
});

const txRecord3 = createTxRecord({
  txIdAlias: txIdAlias3,
  headerHashAlias: 'headerHash3',
  blockIndex: 100000,
  parentCoinInfoAlias: 'parent_coin3',
  amount: '150000',
  fromAddress: 'xch1x5pay2ukwsgc8jjk4ck3rs3s0m8cpq92mucyapmgje0js07vdgtsw4gdtp',
  toAddress: rateToAddress(exchangeConfig.cur1, '2', exchangeConfig),
  cur: exchangeConfig.cur1,
  createdAt: Math.floor(moment().toDate().getTime() / 1000),
});

const txRecord4 = createTxRecord({
  txIdAlias: txIdAlias4,
  headerHashAlias: 'headerHash4',
  blockIndex: 100000,
  parentCoinInfoAlias: 'parent_coin4',
  amount: '50',
  fromAddress: 'xch1x5pay2ukwsgc8jjk4ck3rs3s0m8cpq92mucyapmgje0js07vdgtsw4gdtp',
  toAddress: rateToAddress(exchangeConfig.cur1, '2', exchangeConfig),
  cur: exchangeConfig.cur1,
  createdAt: Math.floor(moment().toDate().getTime() / 1000),
});

const _in: BcWalk = {
  inTxs: [txRecord1, txRecord2, txRecord3, txRecord4],
  outTxs: [],
  changeTxs: [],
  configTxs: [],
  confirmedRemovals: [],
  lastHeight: 1,
};

const _out = {
  incomes: [
    {
      tx_id: `0x${sha256(txIdAlias1)}`,
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x7330b474f9c177ca33ef4ab52eeffbb118a6d3c619721948b240ba1d1b2a1321',
      cur: 'xch',
      status: 'proceded',
      amount: '100000',
    },
    {
      tx_id: `0x${sha256(txIdAlias2)}`,
      client_puzzle_hash: '0x2cb73e06ae4571edb7ca8ed784436a3c70ab2fc963d12b3c5ce23e28b5eeca67',
      stock_puzzle_hash: '0x5fba5f61ebccee1b4551801f04c208f1d1b0653ae66a29d785be108b01ef6c5f',
      cur: 'ach',
      status: 'proceded',
      amount: '150000',
    },
    {
      tx_id: `0x${sha256(txIdAlias3)}`,
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x0c805d528dca33058e14d73c0e708a2059f3e79d492022aca8fb2bae6b2b9c7e',
      cur: 'xch',
      status: 'proceded',
      amount: '150000',
    },
    {
      tx_id: `0x${sha256(txIdAlias4)}`,
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x0c805d528dca33058e14d73c0e708a2059f3e79d492022aca8fb2bae6b2b9c7e',
      cur: 'xch',
      status: 'proceded',
      amount: '50',
    },
  ],
  orders: [
    {
      amount: '0',
      start_amount: '100000',
      rate: '1.5',
      cur1: 'xch',
      cur2: 'ach',
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x7330b474f9c177ca33ef4ab52eeffbb118a6d3c619721948b240ba1d1b2a1321',
      status: 'done',
    },
    {
      amount: '0',
      start_amount: '150000',
      rate: '1.5',
      cur1: 'ach',
      cur2: 'xch',
      client_puzzle_hash: '0x2cb73e06ae4571edb7ca8ed784436a3c70ab2fc963d12b3c5ce23e28b5eeca67',
      stock_puzzle_hash: '0x5fba5f61ebccee1b4551801f04c208f1d1b0653ae66a29d785be108b01ef6c5f',
      status: 'done',
    },
    {
      amount: '150000',
      start_amount: '150000',
      rate: '2',
      cur1: 'xch',
      cur2: 'ach',
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x0c805d528dca33058e14d73c0e708a2059f3e79d492022aca8fb2bae6b2b9c7e',
      status: 'expired',
    },
    {
      amount: '50',
      start_amount: '50',
      rate: '2',
      cur1: 'xch',
      cur2: 'ach',
      client_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      stock_puzzle_hash: '0x0c805d528dca33058e14d73c0e708a2059f3e79d492022aca8fb2bae6b2b9c7e',
      status: 'min-amount-done',
    },
  ],
  deals: [
    {
      client1_puzzle_hash: '0x3503d22b96741183ca56ae2d11c2307ecf8080aadf304e8768965f283fcc6a17',
      client2_puzzle_hash: '0x2cb73e06ae4571edb7ca8ed784436a3c70ab2fc963d12b3c5ce23e28b5eeca67',
      stock1_puzzle_hash: '0x7330b474f9c177ca33ef4ab52eeffbb118a6d3c619721948b240ba1d1b2a1321',
      stock2_puzzle_hash: '0x5fba5f61ebccee1b4551801f04c208f1d1b0653ae66a29d785be108b01ef6c5f',
      cur1: 'xch',
      cur2: 'ach',
      amount1: '150000',
      amount2: '100000',
      rate: '1.5',
      client1_fee: '1500',
      client2_fee: '2000',
      status: 'new',
    },
  ],
  curSeries: [
    {
      opening_price: '1.5',
      highest_price: '1.5',
      lowest_price: '1.5',
      closing_price: '1.5',
      volume_1: '100000',
      volume_2: '150000',
    },
  ],
};

export default { _in, _out };
