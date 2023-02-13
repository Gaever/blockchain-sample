import { currencies } from '@ctocker/lib/build/main/src/types/stock';
import { validateNetwork } from '@ctocker/lib/build/main/src/utils/validate-env';
import { cleanEnv, num, str } from 'envalid';

const brokerCollectValidator = {
  NODE_ENV: str(),
  POSTGRES: str(),

  CUR: str({ choices: [...currencies] }),

  FULLNODE_URI: str(),
  SSL_CERT_PATH: str(),
  SSL_KEY_PATH: str(),

  STOCK_HOLDER_ADDRESS: str(),

  LOG_LEVEL: str({ default: 'info' }),

  SERVICE_NAME: str({ default: '' }),
};

const brokerMatchValidator = {
  NODE_ENV: str(),
  POSTGRES: str(),

  STOCK_CONFIG_ID: num(),

  CUR1_STOCK_HOLDER_ADDRESS: str(),
  CUR2_STOCK_HOLDER_ADDRESS: str(),

  ORDER_MATCH_BATCH_LIMIT: num({ default: 1000 }),
  INCOME_MATCH_BATCH_LIMIT: num({ default: 1000 }),

  LOG_LEVEL: str({ default: 'info' }),

  SERVICE_NAME: str({ default: '' }),
};

const brokerPayoutValidator = {
  NODE_ENV: str(),
  POSTGRES: str(),

  CUR: str({ choices: [...currencies] }),

  FULLNODE_URI: str(),
  SSL_CERT_PATH: str(),
  SSL_KEY_PATH: str(),
  KEY_STORAGE_PATH: str(),

  LOG_LEVEL: str({ default: 'info' }),

  SERVICE_NAME: str({ default: '' }),
};

export const validateBrokerCollectEnv = async () => {
  cleanEnv(process.env, brokerCollectValidator);
  await validateNetwork();
  if (!process.env.STOCK_HOLDER_ADDRESS.toLowerCase().match(new RegExp(`^${process.env.CUR.toLowerCase()}`))) {
    throw new Error(`STOCK_HOLDER_ADDRESS prefix must be ${process.env.CUR.toLowerCase()}`);
  }
};

export const validateBrokerMatchEnv = async () => {
  cleanEnv(process.env, brokerMatchValidator);
};

export const validateBrokerPayoutEnv = async () => {
  cleanEnv(process.env, brokerPayoutValidator);
  await validateNetwork();
};
