import { log } from '@/log';
import dealsModel from '@/models/deals.model';
import ordersModel from '@/models/orders.model';
import outcomeModel from '@/models/outcome.model';
import Blockchain from '@/services/blockchain/blockchain';
import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import { KeyStorage } from '@/types/blockchain';
import { currency, Outcome } from '@/types/stock';
import { addressToPuzzleHash, configBigNumber } from '@/utils';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import { formatOutcome } from '../report/report-formats';

configBigNumber();

class BrokerPayout {
  public blockchain: Blockchain;
  public cur: currency;

  constructor() {
    autoBind(this);
  }

  public async init(cur: currency, keyStorage: KeyStorage) {
    if (!keyStorage) throw new Error('Key storage not set. Define path to key storage in KEY_STORAGE_PATH env variable');

    this.cur = cur;
    this.blockchain = new Blockchain(cur);

    await this.blockchain.initPayout(keyStorage);
    await this.blockchain.coinCache.releaseExpiredFrozenCoins();
  }

  // Попытаться выплатить платеж в очереди
  public async payoutPaymentPendingOutcomes(outcomes: Outcome[]) {
    log.debug('payoutPaymentPendingOutcomes call');
    log.info('trying to payout %s pending outcomes', outcomes?.length);
    if (outcomes?.length) {
      log.info('%O', { ids: outcomes?.map?.((item) => item.id)?.join?.(', ') });
    }

    let created = 0;
    for (const outcome of outcomes) {
      if (await this.performOutcomePayout(outcome)) {
        created++;
      }
    }
    log.info('created %s blockchain transactions', created);
  }

  // Попытаться выплатить новый платеж.
  // Выбирает из базы outcome-ы со статусом "created", обновляет их со статусом "payment-pending"
  // И производит попытку выплатить
  public async payoutCreatedOutcomes(outcomes: Outcome[]) {
    log.debug('payoutCreatedOutcomes call');
    log.info('trying to payout %s ceated outcomes', outcomes?.length);
    if (outcomes.length) {
      log.info('%O', { ids: outcomes?.map?.((item) => item.id)?.join?.(', ') });
    }

    let created = 0;
    for (const outcome of outcomes) {
      await outcomeModel.update(outcome.id, { status: 'payment-pending' });
      log.debug('set created outcome to payment-pending, id %s', outcome?.id);
      if (await this.performOutcomePayout(outcome)) {
        created++;
      }
    }
    log.info('created %s blockchain transactions', created);
    log.info('%s transactions are pending', outcomes.length - created);
  }

  // Производит выплату на основании сделки (outcome.deal_id не пустой)
  // или обратную выплату в случае просроченного ордера (outcome.order_id не пустой)
  private async performOutcomePayout(outcome: Outcome): Promise<boolean> {
    log.debug('performOutcomePayout call');
    if (outcome.deal_id) {
      // выплата на основании сделки
      const deal = await dealsModel.getById(outcome.deal_id);
      log.debug('trying to payout deal with id %s', outcome.deal_id);
      let stockPh = outcome.cur === deal.cur1 ? deal.rate1_puzzle_hash : deal.rate2_puzzle_hash;
      return this.performBcTransaction(outcome, stockPh);
    } else if (outcome.order_id) {
      // обратная выплата просроченного ордера
      const order = await ordersModel.getById(outcome.order_id);
      log.debug('trying to payout expired order with id %s', outcome.order_id);
      const stockPh = order.rate_puzzle_hash;
      return this.performBcTransaction(outcome, stockPh);
    } else if (outcome.deal_id === 0) {
      // Тестовая монета
      return this.performBcTransaction(outcome, addressToPuzzleHash(fullnodeEnviroment[outcome.cur].TEST_ADDRESS_TO));
    }
  }

  // Создает транзакцию в блокчейне.
  // В случае успеха обновляет outcome в базе, назначив статус 'payment-process'.
  private async performBcTransaction(outcome: Outcome, stockPuzzleHash: string): Promise<boolean> {
    log.debug('performBcTransaction call; outcome %O, stockPuzzleHash %s', formatOutcome(outcomeModel.entityToRow(outcome)), stockPuzzleHash);
    try {
      // Отмечаем транзакцию как взятую в обработку оплаты.
      // В случае остановки сервиса после реальной выплаты в блокчейн и до обновления статуса в "payment-process"
      // данный outcome не попадет в повторную выплату.
      // Collector сервис при анализе блокчейна обнаружит данную транзакцию в штатном режиме,
      // установит статус 'done' и запишет высоту транзакции.
      //
      log.debug('set outcome status to "payment-before-process"');
      await outcomeModel.update(outcome.id, { status: 'payment-before-process' });

      // Если транзакция в блокчейн не была создана, а статус установлен в payment-before-process,
      // следует проверить логи на наличие проблем и убедиться что транзакция действительно не ушла в блокчейн.
      // Если транзакции не было, следует сменить статус у outcome-а на "created".
      const tx = await this.blockchain.sendPayout(
        outcome.amount.toString(),
        stockPuzzleHash,
        outcome.client_puzzle_hash || outcome.stock_holder_puzzle_hash,
        outcome.transaction_fee.toString()
      );

      if (!tx) {
        // Нет свободных монет.
        // Нужно дождаться выполнения предыдущей транзакции
        // и создания монеты сдачи.
        log.debug('Transaction not created. Set outcome status to "payment-before-process"');
        await outcomeModel.update(outcome.id, { status: 'payment-pending' });
        return false;
      }

      // "Замораживаем" потраченную монету и монету сдачи
      // чтобы их нельзя было использовать в последующих транзакциях
      // до подтверждения в блокчейне
      const changeAdditions = tx.additions.filter((item) => item.puzzle_hash === stockPuzzleHash);
      log.debug('changeAdditions %O', JSON.stringify(changeAdditions));

      await knex.transaction(async (trx) => {
        await Promise.all([
          ...changeAdditions.map(async (coin) => this.blockchain.coinCache.freezeCoin(coin, trx)),
          ...tx.removals.map(async (coin) => this.blockchain.coinCache.freezeCoin(coin, trx)),
        ]);
        await outcomeModel.update(outcome.id, { created_at: new Date(tx.created_at_time * 1000), status: 'payment-process', tx_id: tx.payout_tx_id }, trx);
      });
      log.debug('Transaction created. Set outcome status to "payment-process"');

      if (
        Object.keys(fullnodeEnviroment)
          .map((cur: currency) => addressToPuzzleHash(fullnodeEnviroment[cur].TEST_ADDRESS_FROM))
          .includes(outcome.client_puzzle_hash)
      ) {
        log.info('*** TEST COIN: PAYOUT TRANSACTION CREATED ***');
      }

      log.info('processed outcome %O', outcomeModel.entityToRow(outcome));
      log.info('payout tx id %s', tx.payout_tx_id);

      return true;
    } catch (error) {
      log.debug('performBcTransaction error %O', error);
      if (error.message !== 'CHANGE_LESS_ZERO') {
        log.error('performBcTransaction error %O', error);
        await outcomeModel.update(outcome.id, { status: 'error' });
        log.debug('Set outcome status to "error"');
        throw error;
      } else {
        await outcomeModel.update(outcome.id, { status: 'payment-process' });
      }
    }
    return false;
  }
}

export default BrokerPayout;
