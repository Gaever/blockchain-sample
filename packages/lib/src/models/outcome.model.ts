import { currency, Outcome } from '@/types/stock';
import knex from '@/utils/knex';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import Model from './model';

export const tableName = 'outcome';

class OutcomeModel extends Model<Outcome> {
  public async updateByTxIds(outcomes: Outcome[], trx: Knex.Transaction) {
    for (const outcome of outcomes) {
      if (!outcome.tx_id) throw new Error('!tx_id');
      const row = this.entityToUpdateRow(outcome);
      await trx(this.tableName).update(row).where({ tx_id: outcome.tx_id });
    }
  }

  public async fetchByStatus(status: Outcome['status'], cur: currency): Promise<Outcome[]> {
    return knex(tableName).select('*').andWhere({ status }).andWhere('cur', cur);
  }

  public rowToEntity(row: any): Outcome {
    return {
      id: row?.id,
      tx_id: row?.tx_id,
      height: row?.height,
      header_hash: row?.header_hash,
      created_at: row?.created_at,
      amount: new BigNumber(row?.amount),
      transaction_fee: new BigNumber(row?.transaction_fee || 0),
      payback_fee: new BigNumber(row?.payback_fee || 0),
      client_puzzle_hash: row?.client_puzzle_hash,
      stock_holder_puzzle_hash: row?.stock_holder_puzzle_hash,
      cur: row?.cur,
      status: row?.status,
      deal_id: row?.deal_id,
      order_id: row?.order_id,
      stock_id: row?.stock_id,
    };
  }

  public entityToRow(entity: Outcome): any {
    return this.avoidUndefined({
      id: entity?.id,
      tx_id: entity?.tx_id,
      height: entity?.height,
      header_hash: entity?.header_hash,
      created_at: entity?.created_at,
      amount: entity?.amount?.toString?.(),
      transaction_fee: entity?.transaction_fee?.toString?.(),
      payback_fee: entity?.payback_fee?.toString?.(),
      client_puzzle_hash: entity?.client_puzzle_hash,
      stock_holder_puzzle_hash: entity?.stock_holder_puzzle_hash,
      cur: entity?.cur,
      status: entity?.status,
      deal_id: entity?.deal_id,
      order_id: entity?.order_id,
      stock_id: entity?.stock_id,
    });
  }
}

export default new OutcomeModel(tableName);
