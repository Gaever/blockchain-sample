import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import stockConfigValidator from '@ctocker/lib/build/main/src/services/stock-config-validator';
import { StockConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { readJson } from '@ctocker/lib/build/main/src/utils/index';
import { sha256 } from 'js-sha256';
import _omit from 'lodash/omit';

async function showConfig(id: string = null) {
  const prepare = (config: StockConfigRecord) => {
    const cur1 = config.cur1;
    const cur2 = config.cur2;
    return JSON.stringify(
      _omit(config, ['transaction_json', `config_json.exchangeConfig.${cur1}.addresses`, `config_json.exchangeConfig.${cur2}.addresses`]),
      null,
      2,
    );
  };
  if (id) {
    const config = await stockConfigModel.getConfig(+id, true);
    if (!config) throw new Error('not found');
    console.log('Status', config.status);
    console.log(prepare(config));
    console.log();
  } else {
    const configs = await stockConfigModel.getStockList(true);
    configs.forEach(config => {
      console.log('Status', config.status);
      console.log(prepare(config));
      console.log();
    });
    if (!configs.length) console.log('No configs');
  }
}

async function addConfig(path: string) {
  const stockConfig = await readJson<StockConfig>(path);
  stockConfigValidator.validateRemoteStockConfig(stockConfig);
  const data = await stockConfigValidator.fetchConfigsForAddressCrossingValidation(stockConfig);
  stockConfigValidator.validateAddressCrossing(stockConfig, data);

  const stockConfigRecord: StockConfigRecord = {
    config_tx_id: sha256(JSON.stringify(stockConfig)),
    transaction_json: '{}',
    name: stockConfig.name,
    cur1: stockConfig.exchangeConfig.cur1,
    cur2: stockConfig.exchangeConfig.cur2,
    config_json: stockConfig,
    status: 'confirmed',
  };

  await stockConfigModel.addConfig(stockConfigRecord);

  console.log('Config saved with status "confirmed". Change status with "yarn start --config-set-status new | moderation | confirmed | error".');
}

async function setStatus(id: string, status: StockConfigRecord['status']) {
  const config = await stockConfigModel.getConfig(+id, true);
  const validStatuses = ['new', 'moderation', 'confirmed', 'error'];
  if (!config) throw new Error('not found');
  if (!validStatuses.includes(status)) throw new Error(`valid statuses are: ${validStatuses.join(', ')}`);
  await stockConfigModel.updateConfig({ ...config, status });
  console.log('Done');
}

export default async function configService(args: { [key: string]: string }) {
  try {
    let action;
    const configId = args.config_id;

    if (args.config_show) action = 'show';
    if (args.config_add) action = 'add';
    if (args.config_set_status) action = 'set_status';

    switch (action) {
      case 'show':
        await showConfig(configId);
        break;
      case 'add':
        await addConfig(args.config_add);
        break;
      case 'set_status':
        const status = args.config_set_status as StockConfigRecord['status'];
        await setStatus(configId, status);
        break;
      default:
        console.log('unknown action');
    }
  } catch (error) {
    console.log(error.message);
  }
}
