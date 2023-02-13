import { log } from '@/log';
import stockConfigModel from '@/models/stock-config.model';
import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import { StockConfig, StockConfigRecord } from '@/types/stock';
import { addressToPuzzleHash } from '@/utils';
import autoBind from 'auto-bind';
import _intersection from 'lodash/intersection';

class StockConfigValidator {
  constructor() {
    autoBind(this);
  }

  public validateAddressCrossing(stockConfig: StockConfig, existConfigs: [StockConfigRecord[], StockConfigRecord[]]) {
    log.debug('validateAddressCrossing call');
    const cur1Configs = existConfigs?.[0] || [];
    const cur2Configs = existConfigs?.[1] || [];

    const intersectionValidation = (addresses1: { [key: string]: string }, addresses2: { [key: string]: string }) => {
      if (process.env.SKIP_NEW_STOCK_CONFIG_PH_INTERSECT_VALIDATION) return;
      const intersection = _intersection(Object.keys(addresses1).map(addressToPuzzleHash), Object.keys(addresses2).map(addressToPuzzleHash));
      if (intersection.length !== 0) throw new Error(`Duplicate puzzle hash for: ${intersection.join(', ')}`);
    };

    const forEachFn = (item) => {
      if (item.cur1 === stockConfig.exchangeConfig.cur1 || item.cur1 === stockConfig.exchangeConfig.cur2) {
        if (item.config_json.exchangeConfig[item.cur1]?.addresses !== undefined && stockConfig.exchangeConfig[item.cur1]?.addresses !== undefined) {
          intersectionValidation(item.config_json.exchangeConfig[item.cur1]?.addresses, stockConfig.exchangeConfig[item.cur1]?.addresses);
        }
        if (item.config_json.exchangeConfig[item.cur1]?.addresses !== undefined && stockConfig.exchangeConfig[item.cur2]?.addresses !== undefined) {
          intersectionValidation(item.config_json.exchangeConfig[item.cur1].addresses, stockConfig.exchangeConfig[item.cur2].addresses);
        }
      }
      if (item.cur2 === stockConfig.exchangeConfig.cur1 || item.cur2 === stockConfig.exchangeConfig.cur2) {
        if (item.config_json.exchangeConfig[item.cur2]?.addresses !== undefined && stockConfig.exchangeConfig[item.cur1]?.addresses !== undefined) {
          intersectionValidation(item.config_json.exchangeConfig[item.cur2]?.addresses, stockConfig.exchangeConfig[item.cur1]?.addresses);
        }
        if (item.config_json.exchangeConfig[item.cur2]?.addresses !== undefined && stockConfig.exchangeConfig[item.cur2]?.addresses !== undefined) {
          intersectionValidation(item.config_json.exchangeConfig[item.cur2].addresses, stockConfig.exchangeConfig[item.cur2].addresses);
        }
      }
    };
    log.debug('intersection addresses validation done');

    cur1Configs.forEach(forEachFn);
    cur2Configs.forEach(forEachFn);
  }

  public async fetchConfigsForAddressCrossingValidation(stockConfigRecord: StockConfig, omitId?: number): Promise<[StockConfigRecord[], StockConfigRecord[]]> {
    log.debug('fetchConfigsForAddressCrossingValidation call');
    const cur1Configs = await stockConfigModel.getConfigsByCur(stockConfigRecord.exchangeConfig.cur1, omitId);
    const cur2Configs = await stockConfigModel.getConfigsByCur(stockConfigRecord.exchangeConfig.cur2, omitId);
    return [cur1Configs, cur2Configs];
  }

  public validateRemoteStockConfig(data: StockConfig): void {
    log.debug('validateRemoteStockConfig call');
    if (!data?.name) throw new Error('name field is missing');
    if (typeof data.name === 'string' && !data.name.match(/[a-zA-Z0-9_-]/gim)) throw new Error('name must match [a-zA-Z0-9_-] pattern');
    if (!data?.exchangeConfig) throw new Error('exchangeConfig is missing');
    if (!data?.fromHeight) throw new Error('fromHeight is missing');
    if (typeof parseInt(data?.fromHeight) !== 'number') throw new Error('fromHeight must be string on integer');
    if (+data?.fromHeight < 1) throw new Error('fromHeight can not be negaive');
    const config = data.exchangeConfig;
    const availableCurs = Object.keys(fullnodeEnviroment);
    if (!availableCurs.includes(config.cur1)) throw new Error('cur1 field is missing');
    if (!availableCurs.includes(config.cur2)) throw new Error('cur2 field is missing');
    if (!config[config.cur1]) throw new Error('cur1 section is missing');
    if (!config[config.cur2]) throw new Error('cur2 section is missing');

    [config[config.cur1], config[config.cur2]].forEach((cur) => {
      if (!cur.addresses) throw new Error('addresses are missing');
      if (!cur.fees) throw new Error('fees are missing');

      if (!cur.orderLifetimeMs && cur.orderLifetimeMs !== '0') throw new Error(`orderLifetimeMs is missing`);
      if (typeof cur.orderLifetimeMs !== 'string') throw new Error('orderLifetimeMs must be string of integer');
      if (typeof parseInt(cur.orderLifetimeMs) !== 'number' || isNaN(parseInt(cur.orderLifetimeMs)) || !cur.orderLifetimeMs.match(/^\d+$/)) {
        throw new Error('orderLifetimeMs must be string of integer');
      }
      if (+cur.orderLifetimeMs < 0) throw new Error('orderLifetimeMs can not be negative');

      if (!cur.minInAmountFixed) throw new Error('minInAmountFixed is missing');
      if (typeof cur.minInAmountFixed !== 'string') throw new Error('orderLifetimeMs must be string of integer');
      if (typeof parseInt(cur.minInAmountFixed) !== 'number' || isNaN(parseInt(cur.minInAmountFixed)) || !cur.minInAmountFixed.match(/^\d+$/)) {
        throw new Error('minInAmountFixed must be string of integer');
      }
      if (+cur.minInAmountFixed < 0) throw new Error('negative minInAmountFixed');

      Object.keys(cur.addresses).forEach((address) => {
        try {
          const ph = addressToPuzzleHash(address);
          if (!ph) throw new Error(`address ${address} is incorrect`);
        } catch {
          throw new Error(`address ${address} is incorrect`);
        }
        if (typeof parseFloat(cur.addresses[address]) !== 'number' || isNaN(parseFloat(cur.addresses[address]))) {
          throw new Error(`address[${address}] value must be string of number`);
        }
      });

      if (!cur.fees.takerFee) throw new Error('fees.takerFee is missing');
      if (!cur.fees.makerFee) throw new Error('fees.makerFee is missing');
      if (!cur.fees.transactionFee) throw new Error('fees.transactionFee is missing');
      if (!cur.fees.paybackFee) throw new Error('fees.paybackFee is missing');

      Object.keys(cur.fees).forEach((feesKey) => {
        if (feesKey === 'transactionFee') {
          try {
            BigInt(cur.fees[feesKey]);
          } catch {
            throw new Error('fees.transactionFee must be string of integer');
          }
        } else {
          if (!cur.fees[feesKey].fixed && !cur.fees[feesKey].percent) {
            throw new Error(`fees.${feesKey} must have eather 'percent' or 'fixed' string value`);
          }

          if (cur.fees[feesKey].fixed !== undefined) {
            try {
              BigInt(cur.fees[feesKey].fixed);
            } catch {
              throw new Error(`fees.${feesKey}.fixed must be string of integer`);
            }
          }
          if (cur.fees[feesKey].percent !== undefined) {
            if (typeof parseFloat(cur.fees[feesKey].percent) !== 'number' || isNaN(parseFloat(cur.fees[feesKey].percent))) {
              throw new Error(`fees.${feesKey}.percent must be string of number`);
            }
          }
        }
      });
    });
  }
}

export default new StockConfigValidator();
