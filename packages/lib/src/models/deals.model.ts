import { Deal } from '@/types/stock';
import knex from '@/utils/knex';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import Model from './model';

export const tableName = 'deals';

class DealsModel extends Model<Deal> {
  public async getNew(stockIds: number[], trx?: Knex.Transaction): Promise<Deal[]> {
    const rows = await (trx || knex)(this.tableName).andWhere({ status: 'new' }).whereIn('stock_id', stockIds);
    return rows.map(this.rowToEntity);
  }

  public rowToEntity(row: any): Deal {
    return {
      id: row?.id,
      created_at: row?.created_at,
      seller_puzzle_hash: row?.seller_puzzle_hash,
      buyer_puzzle_hash: row?.buyer_puzzle_hash,
      rate1_puzzle_hash: row?.rate1_puzzle_hash,
      rate2_puzzle_hash: row?.rate2_puzzle_hash,
      cur1: row?.cur1,
      cur2: row?.cur2,
      seller_amount_in_cur2: new BigNumber(row?.seller_amount_in_cur2),
      buyer_amount_in_cur1: new BigNumber(row?.buyer_amount_in_cur1),
      rate: new BigNumber(row?.rate),
      seller_fee_in_cur2: row?.seller_fee_in_cur2,
      buyer_fee_in_cur1: row?.buyer_fee_in_cur1,
      seller_order_id: row?.seller_order_id,
      buyer_order_id: row?.buyer_order_id,
      taker_order_id: row?.taker_order_id,
      status: row?.status,
      stock_id: row?.stock_id,
      is_sell: row?.is_sell,
    };
  }

  public entityToRow(entity: Deal): any {
    return this.avoidUndefined({
      id: entity?.id,
      created_at: entity?.created_at,
      seller_puzzle_hash: entity?.seller_puzzle_hash,
      buyer_puzzle_hash: entity?.buyer_puzzle_hash,
      rate1_puzzle_hash: entity?.rate1_puzzle_hash,
      rate2_puzzle_hash: entity?.rate2_puzzle_hash,
      cur1: entity?.cur1,
      cur2: entity?.cur2,
      seller_amount_in_cur2: entity?.seller_amount_in_cur2?.toString?.(),
      buyer_amount_in_cur1: entity?.buyer_amount_in_cur1?.toString?.(),
      rate: entity?.rate?.toString?.(),
      seller_fee_in_cur2: entity?.seller_fee_in_cur2?.toString?.(),
      buyer_fee_in_cur1: entity?.buyer_fee_in_cur1?.toString?.(),
      seller_order_id: entity?.seller_order_id,
      buyer_order_id: entity?.buyer_order_id,
      taker_order_id: entity?.taker_order_id,
      status: entity?.status,
      stock_id: entity?.stock_id,
      is_sell: entity?.is_sell,
    });
  }
}

export default new DealsModel(tableName);
