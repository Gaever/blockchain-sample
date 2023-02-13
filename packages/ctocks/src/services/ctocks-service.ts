import { validateCtocksCollectEnv } from '@/utils/validate-env';
import { log } from '@ctocker/lib/build/main/src/log';
import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import ordersModel from '@ctocker/lib/build/main/src/models/orders.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { currency, service } from '@ctocker/lib/build/main/src/types/stock';
import { sleep } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import CtocksCollect from './ctocks-collect';
import CtocksCollectMock from './ctocks-collect-mock';
import CtocksMatch from './ctocks-match';

export async function runService(params: { service: service }) {
  switch (params.service) {
    case 'collect': {
      const ctocksCollect = await prepareCollectService();
      const exchangeConfigs = Object.values(ctocksCollect.stocks).map(item => ({
        id: item.config.id,
        cur1: item.config.cur1,
        cur2: item.config.cur2,
      }));

      log.info('ctocks-collect started', { cur: ctocksCollect.blockchain.fullnode.enviroment.currency });
      log.info('%s stock configs loaded %O', exchangeConfigs.length, exchangeConfigs);

      while (true) {
        log.debug('job started');
        await runCollectJob(ctocksCollect);
        log.debug('job done');
        await sleep(1000 * 10);
      }
    }

    case 'match': {
      const ctocksMatch = await prepareMatchService();

      log.info('ctocks-match started', { id: ctocksMatch.stock.id, cur1: ctocksMatch.stock.config.cur1, cur2: ctocksMatch.stock.config.cur2 });

      while (true) {
        log.debug('job started');
        await runMatchJob(ctocksMatch);
        log.debug('job done');
        await sleep(1000 * 10);
      }
    }

    case 'mock-collect': {
      if (process.env.NODE_ENV !== 'development') throw new Error('Mock service can be started under development enviroment only');
      const cur = process.env.CUR as currency;
      const configRows = await stockConfigModel.getConfigs();
      const configs = configRows
        .map(item => ({ ...item.config_json.exchangeConfig, id: item.id }))
        .filter(item => item.cur1 === cur || item.cur2 === cur);

      const ctocksCollectMock = new CtocksCollectMock();
      ctocksCollectMock.init(cur, configs);

      while (true) {
        log.debug('job started');
        await ctocksCollectMock.collect();
        log.debug('job done');
        await sleep(1000 * 10);
      }
    }
  }
}

export async function prepareCollectService(): Promise<CtocksCollect> {
  await validateCtocksCollectEnv();
  const cur = process.env.CUR as currency;

  const configRows = await stockConfigModel.getConfigs();
  const exchangeConfigs = configRows
    .map(item => ({ ...item.config_json.exchangeConfig, id: item.id }))
    .filter(item => item.cur1 === cur || item.cur2 === cur);

  const ctocksCollect = new CtocksCollect();
  ctocksCollect.init(cur, exchangeConfigs);

  return ctocksCollect;
}

export async function runCollectJob(ctocksCollect: CtocksCollect) {
  // Собирает из блокчейна входящие платежи
  // и подтверждение исходящих платежей(outcomes)
  const txs = await ctocksCollect.collectBlockchainTransactions();
  await knex.transaction(async trx => {
    // Сохраняет входящие платежи, исходящие платежи от бирж,
    // ссылки на файлы конфигурации новых бирж через специально созданные монеты
    // (создается новая запись в таблице stock_config со статусом 'new')
    // сохраняет посдеднюю извествую высоту
    await ctocksCollect.processCollectedTxRecords(txs, trx);
  });
  // Собирает необработанные записи со ссылками на файлы конфигурации новых бирж
  // и на их основе пытается создать новую биржу.
  // В случае успеха соответствующая запись в таблице stock_config
  // получит статус 'moderation' и в запись будет скачен json конфигурации по ссылке из монеты.
  await ctocksCollect.processNewConfigs();
}

export async function prepareMatchService(): Promise<CtocksMatch> {
  const id = +process.env.STOCK_CONFIG_ID;

  const configRow = await stockConfigModel.getConfig(id);
  if (!configRow) throw new Error(`no stock_config with id ${id} found`);
  const exchangeConfig = { ...configRow.config_json.exchangeConfig, id: configRow.id };

  const ctocksMatch = new CtocksMatch();
  ctocksMatch.init(exchangeConfig);

  return ctocksMatch;
}

export async function runMatchJob(ctocksMatch: CtocksMatch) {
  const id = ctocksMatch.stock.id;

  await knex.transaction(async trx => {
    // Собирает новые поступления (income),
    const newIncomes = await incomeModel.getNew([id], trx);

    // превращает их в ордера (order) и устанавливает обработанным income-ам статус 'proceded'
    await ctocksMatch.saveNewIncomesToOrders(newIncomes, trx);
  });
  await knex.transaction(async trx => {
    // Собирает необработанные ордера (status = 'created'),
    const newOrders = await ordersModel.getCreated(id, trx);
    const existOrders = await ordersModel.getMarketDepth(id, trx);

    // проверяет их на факт просрочки, устанавливает просроченным статус 'expired'
    const freshExistOrders = await ctocksMatch.expireStaleOrders(existOrders, trx);
    const freshNewOrders = await ctocksMatch.expireStaleOrders(newOrders, trx);

    // и совершает матчинг новых ордеров с существующими
    await ctocksMatch.match(freshNewOrders, freshExistOrders, trx);
  });

  await knex.transaction(async trx => {
    const testIncome = (await trx(incomeModel.tableName).select('*').where({ stock_id: 0, status: 'new' })).map(incomeModel.rowToEntity)?.[0];

    if (testIncome) {
      log.info('*** TEST COIN IN MATCH SERVICE ***');
      await incomeModel.update(testIncome.id, { status: 'proceded' }, trx);
    }
    // Ищет тестовую монету с stock_id = 0
  });
}
