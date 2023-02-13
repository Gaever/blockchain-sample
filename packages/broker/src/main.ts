// organize-imports-ignore

import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

import { currencies, service } from '@ctocker/lib/build/main/src/types/stock';
import { ArgumentParser } from 'argparse';
import bcDebug from '@/services/bc-debug';
import makeTransaction from '@/services/make-transaction';
import { runService } from './services/broker-service';
import { configBigNumber } from '@ctocker/lib/build/main/src/utils';
import configService from './services/config-service';
import bcSetHeight from './services/bc-set-height';
import { log } from '@ctocker/lib/build/main/src/log';
import { testCoin } from './services/test-coin';

log.debug('Start with DEBUG LOGS');

configBigNumber();

const argumentParser = new ArgumentParser();

argumentParser.add_argument('--service', { choices: ['collect', 'match', 'payout'] as service[] });

argumentParser.add_argument('--tx-cur', { choices: [...currencies] });
argumentParser.add_argument('--tx-from');
argumentParser.add_argument('--tx-to');
argumentParser.add_argument('--tx-amount');
argumentParser.add_argument('--tx-pk');
argumentParser.add_argument('--tx-sk');
argumentParser.add_argument('--tx-bc-fee');
argumentParser.add_argument('--tx-stock-config-url');

argumentParser.add_argument('--tx-test', { action: 'store_true' });

argumentParser.add_argument('--bc-debug', { action: 'store_true' });
argumentParser.add_argument('--bc-cur', { choices: [...currencies] });
argumentParser.add_argument('--bc-from');
argumentParser.add_argument('--bc-to');
argumentParser.add_argument('--bc-set-height');
argumentParser.add_argument('--bc-set-service-start-height');

argumentParser.add_argument('--config-show', { action: 'store_true' });
argumentParser.add_argument('--config-add');
argumentParser.add_argument('--config-set-status');
argumentParser.add_argument('--config-id');

const args = argumentParser.parse_args();

log.debug('args %O', args);

async function runBcDebug(args) {
  await bcDebug(args);
}

async function runMain(args) {
  const service = args.service as service;
  await runService({ service });
}

if (args.bc_debug) {
  runBcDebug(args)
    .catch(err => {
      log.error('runBcDebug error %O', err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else if (args.bc_set_height || args.bc_set_service_start_height) {
  bcSetHeight(args)
    .catch(err => {
      log.error('bcSetHeight error %O', err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else if (args.tx_cur) {
  makeTransaction(args)
    .catch(err => {
      log.error('makeTransaction error %O', err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else if (args.config_show || args.config_add || args.config_set_status) {
  configService(args)
    .catch(err => {
      log.error('configService error %O', err);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
} else if (args.tx_test) {
  testCoin()
    .catch(err => {
      log.error('test coin makeTransaction error %O', err);
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

  runMain(args).catch(err => {
    log.error('runMain error %O', err);
    process.exit(1);
  });
}

process.on('unhandledRejection', error => {
  log.error('unhandledRejection', error);
  process.exit(1);
});
