import { BlockchainConfig } from '@/types/blockchain';
import { currency, CurrencyMap } from '@/types/stock';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import { Knex } from 'knex';

export const tableName = 'blockchain_config';

class BlockchainConfigModel {
  public tableName = tableName;

  constructor() {
    autoBind(this);
  }

  private blockchainConfig: CurrencyMap<BlockchainConfig>;

  public async getConfig(cur: currency): Promise<BlockchainConfig> {
    if (!this.blockchainConfig) this.blockchainConfig = {};
    if (!this.blockchainConfig[cur]) {
      const row = await knex.select('*').from(tableName).where({ cur }).limit(1);
      if (!row?.[0]) throw new Error('!config');
      this.blockchainConfig[cur] = {
        cur: row[0]?.cur,
        service_start_height: row[0]?.service_start_height,
        last_known_height: row[0]?.last_known_height,
      };
    }

    return this.blockchainConfig[cur];
  }

  public async addConfig(config: BlockchainConfig): Promise<void> {
    await knex(tableName).insert(config);
  }

  public async getLastKnownHeight(cur: currency): Promise<number> {
    const config = await this.getConfig(cur);
    return config.last_known_height;
  }

  public async updateLastKnownHeight(cur: currency, height: number, trx: Knex.Transaction = null, allowLessKnownHeight: boolean = false): Promise<void> {
    if (!cur || !height) return;

    const lastKnownHeight = await this.getLastKnownHeight(cur);

    if (lastKnownHeight && height < lastKnownHeight && !allowLessKnownHeight) throw new Error('can not be less than last_known_height');
    await (trx || knex)(tableName).update({ last_known_height: height }).where({ cur });

    this.blockchainConfig[cur].last_known_height = height;
  }

  public async updateServiceStartHeight(cur: currency, height: number): Promise<void> {
    if (!cur || !height) return;

    await knex(tableName).update({ service_start_height: height }).where({ cur });
  }

  public clearCache() {
    this.blockchainConfig = undefined;
  }
}

export default new BlockchainConfigModel();
