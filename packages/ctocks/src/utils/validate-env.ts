import { currencies } from '@ctocker/lib/build/main/src/types/stock';
import { validateNetwork } from '@ctocker/lib/build/main/src/utils/validate-env';
import { cleanEnv, num, str } from 'envalid';

const ctocksCollectValidator = {
  NODE_ENV: str(),
  POSTGRES: str(),

  CUR: str({ choices: [...currencies] }),

  FULLNODE_URI: str(),
  SSL_CERT_PATH: str(),
  SSL_KEY_PATH: str(),
  STOCK_CONFIG_ADDRESS: str({ default: '' }),
  SKIP_NEW_STOCK_CONFIG_PH_INTERSECT_VALIDATION: str({ default: '' }),

  LOG_LEVEL: str({ default: 'info' }),

  SERVICE_NAME: str({ default: '' }),
};
const ctocksMatchValidator = {
  NODE_ENV: str(),
  POSTGRES: str(),

  STOCK_CONFIG_ID: num(),

  ORDER_MATCH_BATCH_LIMIT: num({ default: 100 }),
  INCOME_MATCH_BATCH_LIMIT: num({ default: 100 }),

  LOG_LEVEL: str({ default: 'info' }),

  SERVICE_NAME: str({ default: '' }),
};

export const validateCtocksCollectEnv = async () => {
  cleanEnv(process.env, ctocksCollectValidator);
  await validateNetwork();
  // if (process.env.STOCK_CONFIG_ADDRESS && process.env.CUR !== 'xch') throw new Error('STOCK_CONFIG_ADDRESS can only be set with CUR=xch');
  if (process.env.STOCK_CONFIG_ADDRESS && !process.env.STOCK_CONFIG_ADDRESS.toLowerCase().match(new RegExp(`^${process.env.STOCK_CONFIG_ADDRESS}`))) {
    throw new Error(`STOCK_CONFIG_ADDRESS prefix must be ${process.env.CUR.toLowerCase()}`);
  }
};

export const validateCtocksMatchEnv = async () => {
  cleanEnv(process.env, ctocksMatchValidator);
};
