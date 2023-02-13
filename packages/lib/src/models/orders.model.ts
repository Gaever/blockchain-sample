import { Order } from '@/types/stock';
import knex from '@/utils/knex';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import Model from './model';

export const tableName = 'orders';

class OrdersModel extends Model<Order> {
  public entityToRow(entity: Order): any {
    return this.avoidUndefined({
      id: entity?.id,
      expires_at: entity?.expires_at,
      created_at: entity?.created_at,
      amount: entity?.amount?.toString?.(),
      start_amount: entity?.start_amount?.toString?.(),
      rate: entity?.rate?.toString?.(),
      is_sell: entity?.is_sell,
      cur1: entity?.cur1,
      cur2: entity?.cur2,
      client_puzzle_hash: entity?.client_puzzle_hash,
      rate_puzzle_hash: entity?.rate_puzzle_hash,
      status: entity?.status,
      income_id: entity?.income_id,
      stock_id: entity?.stock_id,
    });
  }

  public rowToEntity(row: any): Order {
    return {
      id: row?.id,
      expires_at: row?.expires_at,
      created_at: row?.created_at,
      amount: new BigNumber(row?.amount),
      start_amount: new BigNumber(row?.start_amount),
      rate: new BigNumber(row?.rate),
      is_sell: row?.is_sell,
      cur1: row?.cur1,
      cur2: row?.cur2,
      client_puzzle_hash: row?.client_puzzle_hash,
      rate_puzzle_hash: row?.rate_puzzle_hash,
      status: row?.status,
      income_id: row?.income_id,
      stock_id: row?.stock_id,
    };
  }

  public async getMarketDepth(stockId: number, trx?: Knex.Transaction): Promise<Order[]> {
    return (await (trx || knex)(this.tableName).whereIn('status', ['queued', 'part']).andWhere({ stock_id: stockId }).orderByRaw('rate::float desc, created_at')).map(
      this.rowToEntity
    );
  }

  public async getCreated(stockId: number, trx: Knex.Transaction = null): Promise<Order[]> {
    return (
      await (trx || knex)(this.tableName)
        .where({ status: 'created' })
        .andWhere({ stock_id: stockId })
        .orderBy('created_at', 'asc')
        .limit(+process.env.ORDER_MATCH_BATCH_LIMIT || 100)
    ).map(this.rowToEntity);
  }

  public async getExpired(stockIds: number[], trx?: Knex.Transaction): Promise<Order[]> {
    return (await (trx || knex)(this.tableName).andWhere({ status: 'expired' }).whereIn('stock_id', stockIds)).map(this.rowToEntity);
  }

  public async setExpired(ids: number[], trx: Knex.Transaction = null): Promise<void> {
    await (trx || knex)(this.tableName).update({ status: 'expired' }).whereIn('id', ids);
  }

  public async setExpiredDone(ids: number[], trx: Knex.Transaction = null): Promise<void> {
    await (trx || knex)(this.tableName).update({ status: 'expired-done' }).whereIn('id', ids);
  }
}

export default new OrdersModel(tableName);
