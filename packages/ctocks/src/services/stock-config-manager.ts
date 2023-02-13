import { up as createTimescaleTable } from '@/models/knex-cur-series-migration';
import { log } from '@ctocker/lib/build/main/src/log';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import stockConfigValidator from '@ctocker/lib/build/main/src/services/stock-config-validator';
import { StockConfigTxRecord } from '@ctocker/lib/build/main/src/types/blockchain';
import { StockConfig, StockConfigRecord, TransactionJson } from '@ctocker/lib/build/main/src/types/stock';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import autoBind from 'auto-bind';
import axios from 'axios';
import { Knex } from 'knex';

class StockConfigManager {
  constructor() {
    autoBind(this);
  }

  public async addNewConfig(tx: StockConfigTxRecord, trx: Knex.Transaction = null): Promise<void> {
    log.debug('addNewConfig call');
    const record: StockConfigRecord = {
      status: 'new',
      config_tx_id: tx.txId,
      transaction_json: tx.json,
    };
    await stockConfigModel.addConfig(record, trx);
  }

  public async processNewConfigs(): Promise<StockConfigRecord[]> {
    log.debug('processNewConfigs call');
    const newStockConfigRecords = (await stockConfigModel.getUnconfirmedConfigs()).filter(item => item.status === 'new');
    log.debug('newStockConfigRecords %O', newStockConfigRecords);
    return Promise.all(
      newStockConfigRecords.map(async stockConfigRecord => {
        try {
          log.info('process new config %O', stockConfigRecord);
          const stockConfig = await this.fetchStockConfig(stockConfigRecord);
          const finalizedStockConfigRecord = await this.finalizeNewConfig(stockConfigRecord, stockConfig);
          log.info('process new config: SUCCESS');
          return finalizedStockConfigRecord;
        } catch (error) {
          log.error('process new config: %O', error);
          return this.rejectStockConfig(stockConfigRecord);
        }
      }),
    );
  }

  public async finalizeNewConfig(stockConfigRecord: StockConfigRecord, stockConfig: StockConfig): Promise<StockConfigRecord> {
    log.debug('finalizeNewConfig call');
    const updated: StockConfigRecord = {
      ...stockConfigRecord,
      name: stockConfig.name || `${stockConfig.exchangeConfig.cur1?.toUpperCase?.()} / ${stockConfig.exchangeConfig.cur2?.toUpperCase?.()}`,
      cur1: stockConfig.exchangeConfig.cur1,
      cur2: stockConfig.exchangeConfig.cur2,
      config_json: stockConfig,
      status: 'moderation',
    };
    await knex.transaction(async trx => {
      await stockConfigModel.updateConfig(updated, trx);
      await createTimescaleTable(stockConfigRecord.id, trx);
    });

    return updated;
  }

  public async rejectStockConfig(config: StockConfigRecord): Promise<StockConfigRecord> {
    log.debug('rejectStockConfig call');
    const updated: StockConfigRecord = { ...config, status: 'error' };
    await stockConfigModel.updateConfig(updated);
    return updated;
  }

  public async fetchStockConfig(stockConfigRecord: StockConfigRecord): Promise<StockConfig> {
    const json = JSON.parse(stockConfigRecord?.transaction_json || '') as TransactionJson;
    log.info('fetchStockConfig; recieved data from coin %O', json);

    if (!json.url) throw new Error('transaction json has no url field');

    const remoteConfig = (await axios.get(json.url)).data as StockConfig;
    stockConfigValidator.validateRemoteStockConfig(remoteConfig);
    const existConfigs = await stockConfigValidator.fetchConfigsForAddressCrossingValidation(remoteConfig, stockConfigRecord?.id);
    stockConfigValidator.validateAddressCrossing(remoteConfig, existConfigs);

    return remoteConfig;
  }
}

export default new StockConfigManager();
