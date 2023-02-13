import blockchainConfigModel from '@/models/blockchain-config.model';
import coinCacheModel from '@/models/coin-cache.model';
import dealsModel from '@/models/deals.model';
import incomeModel from '@/models/income.model';
import ordersModel from '@/models/orders.model';
import outcomeModel from '@/models/outcome.model';
import stockConfigModel from '@/models/stock-config.model';
import FullNodeAdapter from '@/services/blockchain/fullnode/fullnode-adapter';
import BrokerOutcomes from '@/services/broker/broker-outcomes';
import Stock from '@/services/stock';
import { TxRecord } from '@/types/blockchain';
import { currency, Deal, ExchangeConfig, Income, Order } from '@/types/stock';
import { addressToPuzzleHash } from '@/utils';
import knex from '@/utils/knex';
import BigNumber from 'bignumber.js';
import { sha256 } from 'js-sha256';
import _flatten from 'lodash/flatten';

export function rateToAddress(cur: currency, rate: string, exchangeConfig: ExchangeConfig): string {
  return Object.keys(exchangeConfig[cur].addresses).find((address) => exchangeConfig[cur].addresses[address] === rate);
}

export function rateToPuzzleHash(cur: currency, rate: string, exchangeConfig: ExchangeConfig): string {
  return addressToPuzzleHash(rateToAddress(cur, rate, exchangeConfig));
}

export async function waitForTransaction(cur: currency, txId: string, customFullnode: FullNodeAdapter = null): Promise<boolean> {
  if (!txId) return true;

  const timeout = 1000 * 60 * 3;
  const start = new Date();

  const fullnode = customFullnode || new FullNodeAdapter(cur);

  return new Promise((resolve, reject) => {
    const handler = setInterval(async () => {
      if (new Date().getTime() - start.getTime() >= timeout) {
        clearInterval(handler);
        reject('not found');
      }

      try {
        const tx = await fullnode.request.walletHttp('get_transaction', { transaction_id: txId });
        if (tx?.transaction?.confirmed) {
          clearInterval(handler);
          resolve(true);
        }
      } catch {}
    }, 5000);
  });
}

// export function createIncome(): Income {
//   return {

//   }
// }

export function createTxRecord(props: {
  txId?: string;
  txIdAlias?: string;
  clientAlias?: string;
  headerHashAlias: string;
  blockIndex: number;
  parentCoinInfoAlias: string;
  amount: string;
  fromAddress: string;
  toAddress: string;
  cur: currency;
  createdAt?: number;
}): TxRecord {
  const txId = (props.txIdAlias && `0x${sha256(props.txIdAlias)}`) || props.txId;

  const clientPuzzleHash = props.fromAddress ? addressToPuzzleHash(props.fromAddress) : sha256(props.clientAlias || 'client1');
  const stockPuzzleHash: string = addressToPuzzleHash(props.toAddress);
  const timestamp = props.createdAt || Math.floor(new Date().getTime() / 1000);

  return {
    txId,
    cur: props.cur,
    createdAtTime: timestamp,
    headerHash: sha256(props.headerHashAlias),
    height: props.blockIndex,
    fromPuzzleHash: clientPuzzleHash,
    toPuzzleHash: stockPuzzleHash,
    coinRecord: {
      coin: {
        amount: props.amount,
        parent_coin_info: sha256(props.parentCoinInfoAlias),
        puzzle_hash: stockPuzzleHash,
      },
      coinbase: false,
      confirmed_block_index: props.blockIndex,
      spent: true,
      spent_block_index: props.blockIndex,
      timestamp: timestamp.toString(),
    },
  };
}

export function createOrder(amount: string, rate: string, createdAt: Date, cur1: currency, cur2: currency, config: ExchangeConfig): Order {
  const isSell = cur1 === config.cur1;
  return {
    amount: new BigNumber(amount),
    start_amount: new BigNumber(amount),
    created_at: createdAt,
    cur1,
    cur2,
    is_sell: isSell,
    rate: new BigNumber(rate),
    status: 'created',
  };
}

export function createDeal(
  buyer_amount_in_cur1: string,
  seller_amount_in_cur2: string,
  buyer_fee_in_cur1: string,
  seller_fee_in_cur2: string,
  rate: string,
  cur1: currency,
  cur2: currency
): Deal {
  return {
    created_at: new Date(),
    buyer_amount_in_cur1: new BigNumber(buyer_amount_in_cur1),
    seller_amount_in_cur2: new BigNumber(seller_amount_in_cur2),
    cur1,
    cur2,
    buyer_fee_in_cur1: new BigNumber(buyer_fee_in_cur1),
    seller_fee_in_cur2: new BigNumber(seller_fee_in_cur2),
    buyer_puzzle_hash: '',
    seller_order_id: 1,
    buyer_order_id: 1,
    rate: new BigNumber(rate),
    rate1_puzzle_hash: '',
    rate2_puzzle_hash: '',
    seller_puzzle_hash: '',
  };
}

export async function clearBrokerDb() {
  await knex(outcomeModel.tableName).delete();
  await knex(dealsModel.tableName).delete();
  await knex(ordersModel.tableName).delete();
  await knex(incomeModel.tableName).delete();
  await knex(coinCacheModel.tableName).delete();
  await knex(stockConfigModel.tableName).delete();
  await knex(blockchainConfigModel.tableName).delete();
}

export function playBrokerIncomes(incomes: Income[], exchangeConfig: ExchangeConfig) {
  const stock = new Stock(exchangeConfig);
  const brokerOutcome = new BrokerOutcomes();
  brokerOutcome.init(exchangeConfig);

  const orders = incomes.map(stock.incomeToOrder);
  const matches = orders.map(stock.matchNewOrder);
  const deals = _flatten(matches.map((match) => match.newDeals));
  const affectedOrders = _flatten(matches.map((match) => match.affectedOrders));
  const outcomes = _flatten(
    deals.map((deal) => {
      const clientsOutcomes = brokerOutcome.createOutcomesToClients(deal);
      const stockHolderOutcomes = brokerOutcome.createOutcomesToStockHolder(deal);

      return [...clientsOutcomes, ...stockHolderOutcomes];
    })
  );

  return {
    incomes,
    orders,
    affectedOrders,
    deals,
    outcomes,
  };
}
