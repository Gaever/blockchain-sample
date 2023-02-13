// organize-imports-ignore

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { ArgumentParser } from 'argparse';
import { runService } from './services/ctocks-service';
import { currencies, service } from '@ctocker/lib/build/main/src/types/stock';
import { configBigNumber } from '@ctocker/lib/build/main/src/utils';
import configService from './services/config-service';
import bcSetHeight from './services/bc-set-height';
import { log } from '@ctocker/lib/build/main/src/log';

log.debug('Start with DEBUG LOGS');

configBigNumber();
const argumentParser = new ArgumentParser();
argumentParser.add_argument('--service', {
  choices: process.env.NODE_ENV === 'development' ? (['collect', 'match', 'mock-collect'] as service[]) : (['collect', 'match'] as service[]),
});
argumentParser.add_argument('--id');

argumentParser.add_argument('--config-show', { action: 'store_true' });
argumentParser.add_argument('--config-set-status');
argumentParser.add_argument('--config-id');

argumentParser.add_argument('--bc-cur', { choices: [...currencies] });
argumentParser.add_argument('--bc-set-height');
argumentParser.add_argument('--bc-set-service-start-height');

const args = argumentParser.parse_args();

log.debug('args %O', args);

async function main() {
  const service = args.service as service;

  await runService({ service });
}

if (args.config_show || args.config_add || args.config_set_status) {
  configService(args)
    .catch(err => {
      log.error('configService %O', err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else if (args.bc_set_height || args.bc_set_service_start_height) {
  bcSetHeight(args)
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else {
  process.on('exit', () => {
    // pm2 бесконечно перезапускает процесс он завершился без exit code или с exit code = 0.
    console.log('exit now');
    process.exit(1);
  });

  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
  process.exit(1);
});
