import { Income } from '@/types/stock';
import knex from '@/utils/knex';
import { Knex } from 'knex';
import Model from './model';

export const tableName = 'income';

class IncomeModel extends Model<Income> {
  public async getNew(stockIds: number[], trx?: Knex.Transaction): Promise<Income[]> {
    return (
      await (trx || knex)(tableName)
        .whereIn('stock_id', stockIds)
        .andWhere({ status: 'new' })
        .orderBy('created_at', 'asc')
        .limit(+process.env.INCOME_MATCH_BATCH_LIMIT || 100)
    ).map(this.rowToEntity);
  }

  public async getByTxId(tx_id: string) {
    return this.rowToEntity((await knex(tableName).where({ tx_id }).limit(1))?.[0]);
  }

  public rowToEntity(row: any): Income {
    return {
      id: row?.id,
      tx_id: row?.tx_id,
      height: row?.height,
      header_hash: row?.header_hash,
      created_at: row?.created_at,
      client_puzzle_hash: row?.client_puzzle_hash,
      rate_puzzle_hash: row?.rate_puzzle_hash,
      cur: row?.cur,
      amount: row?.amount,
      status: row?.status,
      stock_id: row?.stock_id,
      rate: row?.rate,
    };
  }

  public entityToRow(entity: Income): any {
    return this.avoidUndefined({
      id: entity?.id,
      tx_id: entity?.tx_id,
      height: entity?.height,
      header_hash: entity?.header_hash,
      created_at: entity?.created_at,
      client_puzzle_hash: entity?.client_puzzle_hash,
      rate_puzzle_hash: entity?.rate_puzzle_hash,
      cur: entity?.cur,
      amount: entity?.amount?.toString?.(),
      status: entity?.status,
      stock_id: entity?.stock_id,
      rate: entity?.rate,
    });
  }
}

export default new IncomeModel(tableName);
