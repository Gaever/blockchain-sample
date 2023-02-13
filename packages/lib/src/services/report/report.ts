require('dotenv').config({ path: '../../.env' });

import { addressToPuzzleHash, configBigNumber } from '@/utils';
import knex from '@/utils/knex';
import { ArgumentParser } from 'argparse';
import columnify from 'columnify';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { formatDeal, formatIncome, formatOrder, formatOutcome } from './report-formats';

configBigNumber();

const argumentParser = new ArgumentParser();

argumentParser.add_argument('--income-id', { action: 'append' });
argumentParser.add_argument('--order-id', { action: 'append' });
argumentParser.add_argument('--income-height', { action: 'append' });
argumentParser.add_argument('--stock-id', { action: 'append' });
argumentParser.add_argument('--income-tx-id', { action: 'append' });
argumentParser.add_argument('--income-client-ph', { action: 'append' });
argumentParser.add_argument('--income-client-addr', { action: 'append' });
argumentParser.add_argument('--limit');

argumentParser.add_argument('--dom', { action: 'store_true' });

const args = argumentParser.parse_args();

function pushWhereCondition(condArr: string[], cond: string | number[]) {
  if (condArr.length === 0) {
    condArr.push(`where ${cond}`);
  } else {
    condArr.push(`or ${cond}`);
  }
}

function tab(spaces: number) {
  for (let i = 0; i < spaces; i++) {
    process.stdout.write(' ');
  }
}

function printObj(spaces: number, str: string) {
  str.split('\n').forEach((row) => {
    tab(spaces);
    process.stdout.write(`${row}\n`);
  });
}

function printRows(rows: any) {
  rows?.forEach?.((item) => {
    const income = item.income;
    printObj(0, columnify(formatIncome(income.values), { showHeaders: false }));
    printObj(0, 'ORDER:');
    income?.orders?.forEach?.((order) => {
      printObj(5, columnify(formatOrder(order.values), { showHeaders: false }));
      printObj(5, `DEALS: (${order?.deals?.length || 0})`);
      order?.deals?.forEach?.((deal) => {
        printObj(10, 'DEAL');
        printObj(10, columnify(formatDeal(deal.values), { showHeaders: false }));
        printObj(10, 'OUTCOMES:');
        process.stdout.write('\n');
        deal?.outcomes?.forEach?.((outcome) => {
          printObj(15, 'OUTCOME');
          printObj(15, columnify(formatOutcome(outcome.values), { showHeaders: false }));
          process.stdout.write('\n');
        });
      });
      if (order.expired_outcome) {
        printObj(5, `REFUND EXPIRED ORDER OUTCOME: `);
        order.expired_outcome && printObj(10, columnify(formatOutcome(order.expired_outcome), { showHeaders: false }));
      }
      process.stdout.write('\n');
    });
    process.stdout.write('\n\n');
  });
}

async function inspectStock(props: {
  incomeIds?: number[];
  incomeHeights?: number[];
  incomeTxIds?: string[];
  clientPhs?: string[];
  clientAddress?: string[];
  orderIds?: number[];
  stockIds?: number[];
  limit?: number;
}) {
  const reportSqlFile = fs.readFileSync(path.join(__dirname, 'report.sql'), { encoding: 'utf-8' });
  let sql = reportSqlFile;

  const whereConditions: string[] = [];
  if (props.incomeIds?.length > 0) pushWhereCondition(whereConditions, `id in (${props.incomeIds.join(',')})`);
  if (props.incomeHeights?.length > 0) pushWhereCondition(whereConditions, `height in (${props.incomeHeights.join(',')})`);
  if (props.incomeTxIds?.length > 0) pushWhereCondition(whereConditions, `tx_id in ('${props.incomeTxIds.join("','")}')`);
  if (props.clientPhs?.length > 0) pushWhereCondition(whereConditions, `client_puzzle_hash in ('${props.clientPhs.join("','")}')`);
  if (props.stockIds?.length > 0) pushWhereCondition(whereConditions, `stock_id in (${props.stockIds.join(',')})`);
  if (props.clientAddress?.length > 0) {
    const phs = props.clientAddress.map((addr) => addressToPuzzleHash(addr));
    pushWhereCondition(whereConditions, `client_puzzle_hash in ('${phs.join("','")}')`);
  }
  if (props.orderIds?.length > 0) {
    sql += ' inner join orders on orders.income_id = i.id ';
    pushWhereCondition(whereConditions, `orders.id in (${props.orderIds.join(',')})`);
  }

  sql += whereConditions.join(' ');

  const limit = props.limit || 100;

  sql += ` group by i.id, income order by i.id desc limit ${limit}`;

  const response = await knex.raw(sql);
  const rows = response.rows;

  printRows(rows);

  process.stdout.write(`Incomes: ${rows.length}\n`);
}

function printDom(rows: any) {
  console.table(
    rows.map((item) => ({
      rate: item.rate,
      cur1: item.cur1,
      cur2: item.cur2,
      created: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
      'income id': item.income_id,
      'order id': item.order_id,
    }))
  );
}

async function marketDepth(stockId: number) {
  const rows = await knex('orders')
    .select('rate', 'cur1', 'cur2', 'created_at', 'income_id', { order_id: 'id' })
    .whereIn('status', ['queued', 'part'])
    .andWhere({ stock_id: stockId })
    .orderByRaw('rate::float desc, id');
  printDom(rows);
}

if (!args.dom) {
  inspectStock({
    incomeTxIds: args.income_tx_id,
    incomeHeights: args.income_height,
    incomeIds: args.income_id,
    clientPhs: args.income_client_ph,
    clientAddress: args.income_client_addr,
    orderIds: args.order_id,
    stockIds: args.stock_id,
    limit: args.limit,
  })
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else if (args.dom) {
  if (args.stock_id?.length < 1) {
    console.error('Specify stock id: yarn report --dom --stock-id <id>');
    process.exit(0);
  }
  setInterval(() => {
    console.clear();
    marketDepth(args.stock_id[0]).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }, 500);
}
