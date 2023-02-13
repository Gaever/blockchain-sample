import { currency, ExchangeConfigByCur, StockConfigRecord } from '@/types/stock';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import { Knex } from 'knex';
import _omit from 'lodash/omit';

export const tableName = 'stock_config';
// select jsonb_extract_path(jsonb_extract_path(config_json->'exchangeConfig', cur1), 'addresses') from stock_config

class StockConfigModel {
  constructor() {
    autoBind(this);
  }

  tableName = tableName;

  public async addConfig(stockConfig: StockConfigRecord, trx: Knex.Transaction = null): Promise<number[]> {
    return (trx || knex)(tableName).insert(this.entityToRow(stockConfig), 'id');
  }

  public async updateConfig(stockConfig: StockConfigRecord, trx: Knex.Transaction = null): Promise<void> {
    await (knex || trx)(tableName).update(this.entityToRow(stockConfig)).where({ id: stockConfig.id });
  }

  public async getConfigs(): Promise<StockConfigRecord[]> {
    return (await knex(tableName).select('*').where({ status: 'confirmed' }))?.map?.(this.rowToEntity);
  }

  public async getStockList(anyStatus: boolean = false): Promise<StockConfigRecord[]> {
    if (anyStatus) return (await knex(tableName).select(['name', 'cur1', 'cur2', 'id', 'status']))?.map?.(this.rowToEntity);
    return (await knex(tableName).select(['name', 'cur1', 'cur2', 'id', 'status']).where({ status: 'confirmed' }))?.map?.(this.rowToEntity);
  }

  public async getAddressesToRates(id: number, cur: 'cur1' | 'cur2'): Promise<ExchangeConfigByCur['addresses']> {
    return (
      await knex.raw(
        `select jsonb_extract_path(jsonb_extract_path(config_json->'exchangeConfig', ${cur === 'cur1' ? 'cur1' : ''}${
          cur === 'cur2' ? 'cur2' : ''
        }), 'addresses') address_to_rate from ${tableName} where id=${id} and status='confirmed'`
      )
    ).rows?.[0]?.address_to_rate;
  }

  public async getConfigsByCur(cur: currency, omitId?: number): Promise<StockConfigRecord[]> {
    if (omitId) {
      return (await knex(tableName).select('*').whereNot({ id: omitId }).where({ cur1: cur }).orWhere({ cur2: cur }).andWhere({ status: 'confirmed' })).map(this.rowToEntity);
    }
    return (await knex(tableName).select('*').where({ cur1: cur }).orWhere({ cur2: cur }).andWhere({ status: 'confirmed' })).map(this.rowToEntity);
  }

  public async getConfigIds(): Promise<number[]> {
    return (await knex(tableName).select('id').where({ status: 'confirmed' }))?.map?.((item) => +item.id);
  }

  public async getConfig(id: number, anyStatus: boolean = false): Promise<StockConfigRecord> {
    if (anyStatus) return (await knex(tableName).select('*').where({ id }))?.map?.(this.rowToEntity)?.[0];
    return (await knex(tableName).select('*').where({ status: 'confirmed', id }))?.map?.(this.rowToEntity)?.[0];
  }

  public async getUnconfirmedConfigs(): Promise<StockConfigRecord[]> {
    return knex(tableName).select('*').whereNot({ status: 'confirmed' });
  }

  public entityToRow(stockConfig: StockConfigRecord): any {
    return _omit(stockConfig, ['id']);
  }

  public rowToEntity(row: any): StockConfigRecord {
    return {
      id: row?.id,
      config_tx_id: row?.config_tx_id,
      transaction_json: row?.transaction_json,
      cur1: row?.cur1,
      cur2: row?.cur2,
      config_json: row?.config_json,
      status: row?.status,
      name: row?.name,
    };
  }
}

export default new StockConfigModel();
