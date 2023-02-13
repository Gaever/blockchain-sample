import { FrozenCoinRecord } from '@/types/blockchain';
import knex from '@/utils/knex';
import { Knex } from 'knex';
import Model from './model';

export const tableName = 'coin_cache';

class CoinCacheModel extends Model<FrozenCoinRecord> {
  public rowToEntity(row: any): FrozenCoinRecord {
    return {
      expires_at: new Date(row?.expires_at),
      coin_name: row?.coin_name,
    };
  }

  public async deleteExpired(trx: Knex.Transaction = null): Promise<string[]> {
    return (trx || knex).from(tableName).delete().where('expires_at', '<', new Date()).returning('id');
  }

  public async delete(coinName: string, trx: Knex.Transaction = null): Promise<void> {
    await (trx || knex).from(tableName).delete().where({ coin_name: coinName });
  }

  public async fetch(): Promise<FrozenCoinRecord[]> {
    return knex(tableName).select('*');
  }

  public entityToRow(entity: FrozenCoinRecord): any {
    return this.avoidUndefined({
      expires_at: entity?.expires_at,
      coin_name: entity?.coin_name,
    });
  }
}

export default new CoinCacheModel(tableName);
