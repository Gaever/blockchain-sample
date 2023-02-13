import { validateBrokerCollectEnv, validateBrokerMatchEnv, validateBrokerPayoutEnv } from '@/utils/validate-env';
import { log } from '@ctocker/lib/build/main/src/log';
import dealsModel from '@ctocker/lib/build/main/src/models/deals.model';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import BrokerCollect from '@ctocker/lib/build/main/src/services/broker/broker-collect';
import BrokerMatch from '@ctocker/lib/build/main/src/services/broker/broker-match';
import BrokerOutcomes from '@ctocker/lib/build/main/src/services/broker/broker-outcomes';
import BrokerPayout from '@ctocker/lib/build/main/src/services/broker/broker-payout';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { currency, service } from '@ctocker/lib/build/main/src/types/stock';
import { sleep } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import { readKeyStorage } from './read-configs';

export async function runService(params: { service: service }) {
  switch (params.service) {
    case 'collect': {
      const brokerCollect = await prepareCollectService();
      const exchangeConfigs = Object.values(brokerCollect.stocks).map(item => ({
        id: item.config.id,
        cur1: item.config.cur1,
        cur2: item.config.cur2,
      }));

      log.info('broker-collect started', { cur: brokerCollect.blockchain.fullnode.enviroment.currency });
      log.info('%s stock configs loaded: %O', exchangeConfigs.length, exchangeConfigs);

      while (true) {
        log.debug('job started');
        await runCollectJob(brokerCollect);
        log.debug('job done');

        await sleep(1000 * 10);
      }
    }

    case 'match': {
      const { brokerMatch, brokerOutcomes } = await prepareMatchService();

      log.info('broker-match started %O', { id: brokerMatch.stock.id, cur1: brokerMatch.stock.config.cur1, cur2: brokerMatch.stock.config.cur2 });

      while (true) {
        log.debug('job started');
        await runMatchJob(brokerMatch, brokerOutcomes);
        log.debug('job done');

        await sleep(1000 * 10);
      }
    }

    case 'payout': {
      const brokerPayout = await preparePayoutService();

      log.info('broker-payout started %O', { cur: brokerPayout.cur });
      log.debug('%s puzzle hashes in key storage', Object.keys(brokerPayout.blockchain.txManager.keyStorage).length);

      while (true) {
        log.debug('job started');

        await runPayoutJob(brokerPayout);

        log.debug('job done');
        await sleep(1000 * 10);
      }
    }
  }
}

export async function prepareCollectService(): Promise<BrokerCollect> {
  await validateBrokerCollectEnv();
  const cur = process.env.CUR as currency;

  const configRows = (await stockConfigModel.getConfigs()) || [];
  const exchangeConfigs = configRows
    .map(item => ({ ...item.config_json.exchangeConfig, id: item.id }))
    .filter(item => item.cur1 === cur || item.cur2 === cur);
  const brokerCollect = new BrokerCollect();
  brokerCollect.init(cur, exchangeConfigs);

  return brokerCollect;
}

export async function runCollectJob(brokerCollect: BrokerCollect) {
  // Собирает из блокчейна входящие платежи
  // и подтверждение исходящих платежей(outcomes)
  const txs = await brokerCollect.collectBlockchainTransactions();
  await knex.transaction(async trx => {
    // Сохраняет входящие платежи, устнавливает исходящим платежам (outcome) статус 'done',
    // "размораживает" заблокированные монеты (см. CoinCache),
    // сохраняет посдеднюю извествую высоту
    await brokerCollect.processCollectedTxRecords(txs, trx);
  });
  // "Размораживает" заблокированные монеты, у которых истек разумный срок блокировки (см. CoinCache)
  await brokerCollect.releaseExpiredFrozenCoins();
}

export async function prepareMatchService(): Promise<{ brokerMatch: BrokerMatch; brokerOutcomes: BrokerOutcomes }> {
  await validateBrokerMatchEnv();
  const id = +process.env.STOCK_CONFIG_ID;

  const configRow = await stockConfigModel.getConfig(id);
  if (!configRow) throw new Error(`no stock_config with id ${id} found`);
  const exchangeConfig = { ...configRow.config_json.exchangeConfig, id: configRow.id };

  if (!process.env.CUR1_STOCK_HOLDER_ADDRESS.toLowerCase().match(new RegExp(`^${exchangeConfig.cur1}`))) {
    throw new Error(`CUR1_STOCK_HOLDER_ADDRESS prefix must be ${exchangeConfig.cur1.toLowerCase()}`);
  }
  if (!process.env.CUR2_STOCK_HOLDER_ADDRESS.toLowerCase().match(new RegExp(`^${exchangeConfig.cur2}`))) {
    throw new Error(`CUR2_STOCK_HOLDER_ADDRESS prefix must be ${exchangeConfig.cur1.toLowerCase()}`);
  }

  const brokerMatch = new BrokerMatch();
  const brokerOutcomes = new BrokerOutcomes();

  brokerMatch.init(exchangeConfig);
  brokerOutcomes.init(exchangeConfig);

  return { brokerMatch, brokerOutcomes };
}

export async function runMatchJob(brokerMatch: BrokerMatch, brokerOutcomes: BrokerOutcomes) {
  const stockId = brokerMatch.stock.id;
  await knex.transaction(async trx => {
    // Собирает новые поступления (income),
    const newIncomes = await incomeModel.getNew([stockId], trx);

    // превращает их в ордера (order) и устанавливает обработанным income-ам статус 'proceded'
    await brokerMatch.saveNewIncomesToOrders(newIncomes, trx);
  });
  await knex.transaction(async trx => {
    // Собирает необработанные ордера (status = 'created'),
    const newOrders = await ordersModel.getCreated(stockId, trx);
    const existOrders = await ordersModel.getMarketDepth(stockId, trx);

    // проверяет их на факт просрочки, устанавливает просроченным статус 'expired'
    const freshExistOrders = await brokerMatch.expireStaleOrders(existOrders, trx);
    const freshNewOrders = await brokerMatch.expireStaleOrders(newOrders, trx);

    // и совершает матчинг новых ордеров с существующими
    await brokerMatch.match(freshNewOrders, freshExistOrders, trx);
  });
  await knex.transaction(async trx => {
    // Собирает новые сделки (status = 'new')
    const deals = await dealsModel.getNew([stockId], trx);

    // создает на их основе платежки (outcome) и устанавливает обработанным сделкам статус 'paid-out'
    await brokerOutcomes.dealsToOutcomes(deals, trx);
  });
  await knex.transaction(async trx => {
    // Собирает ордеры в статусе 'expired',
    const expiredOrders = await ordersModel.getExpired([stockId], trx);
    // создает на их основе платежки (outcome) и устанавливает обработанным ордерам статус 'expired-done'
    await brokerOutcomes.processExpiredOrders(expiredOrders, trx);
  });

  await knex.transaction(async trx => {
    // Ищет тестовую монету с stock_id = 0
    const testIncome = (await trx(incomeModel.tableName).select('*').where({ stock_id: 0, status: 'new' })).map(incomeModel.rowToEntity)?.[0];
    if (testIncome) {
      log.info(' *** TEST COIN IN MATCH SERVICE *** ');
      // создает на ее основе тестовый Outcome
      await brokerMatch.processTestIncome(testIncome, trx);
      await incomeModel.update(testIncome.id, { status: 'proceded' }, trx);
    }
  });
}

export async function preparePayoutService(): Promise<BrokerPayout> {
  await validateBrokerPayoutEnv();
  const cur = process.env.CUR as currency;

  const keyStoragePaths = process.env.KEY_STORAGE_PATH.split(' ');

  if (keyStoragePaths.length < 1) throw new Error('Key storage is empty. Set KEY_STORAGE_PATH');

  const keyStorage: KeyStorage = {
    [fullnodeEnviroment[cur].TEST_ADDRESS_TO]: {
      pk: fullnodeEnviroment[cur].TEST_ADDRESS_TO_PK,
      sk: fullnodeEnviroment[cur].TEST_ADDRESS_TO_SK,
    },
  };

  for (let keyStoragePath of keyStoragePaths) {
    Object.assign(keyStorage, await readKeyStorage(keyStoragePath));
  }

  const brokerPayout = new BrokerPayout();
  await brokerPayout.init(cur, keyStorage);

  return brokerPayout;
}

export async function runPayoutJob(brokerPayout: BrokerPayout) {
  // Собирает платежки, выставленные в очередь (status = 'payment-pending'),
  const pendingOutcomes = await outcomeModel.fetchByStatus('payment-pending', brokerPayout.cur);
  // производит попытку создать на их основе транзакцию в блокчейне
  await brokerPayout.payoutPaymentPendingOutcomes(pendingOutcomes);

  // Собирает новые платежки (status = 'created'),
  const createdOutcomes = await outcomeModel.fetchByStatus('created', brokerPayout.cur);
  // производит попытку создать на их основе транзакцию в блокчейне
  await brokerPayout.payoutCreatedOutcomes(createdOutcomes);
}
