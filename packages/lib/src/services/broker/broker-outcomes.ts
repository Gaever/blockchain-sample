import { log } from '@/log';
import dealsModel from '@/models/deals.model';
import ordersModel from '@/models/orders.model';
import outcomeModel from '@/models/outcome.model';
import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import { currency, CurrencyMap, Deal, ExchangeConfig, FeeConfig, Order, Outcome } from '@/types/stock';
import { addressToPuzzleHash } from '@/utils';
import autoBind from 'auto-bind';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import _set from 'lodash/set';
import { formatOutcome } from '../report/report-formats';

class BrokerOutcomes {
  public feeConfigs: { [stockId: number]: CurrencyMap<FeeConfig> } = {};
  private cur1: currency;
  private cur2: currency;

  constructor() {
    autoBind(this);
  }

  public init(exchangeConfig: ExchangeConfig) {
    _set(this.feeConfigs, [exchangeConfig.id, exchangeConfig.cur1], exchangeConfig[exchangeConfig.cur1].fees);
    _set(this.feeConfigs, [exchangeConfig.id, exchangeConfig.cur2], exchangeConfig[exchangeConfig.cur2].fees);
    this.cur1 = exchangeConfig.cur1;
    this.cur2 = exchangeConfig.cur2;
  }

  public async dealsToOutcomes(deals: Deal[], trx: Knex.Transaction): Promise<void> {
    log.debug('dealsToOutcomes call');
    const createdOutcomesLength = (await Promise.all(deals.map(async (deal) => this.createDealOutcomes(deal, trx)))).reduce((a, b) => a + b, 0);
    log.info('created %s outcomes for %s deals', createdOutcomesLength, deals.length);
    if (deals.length) {
      log.info('%O', deals?.map?.((item) => item.id)?.join?.(', '));
    }
  }

  // Создание 4х outcome-ов на основании сделки.
  // - 2 outcome-а на клиентские адреса в соответствующие блокчейны
  // - 2 outcome-а на комиссионные адреса в соответствующие блокчейны
  //
  // Возвращает количество созданных outcome-ов.
  public async createDealOutcomes(deal: Deal, trx: Knex.Transaction): Promise<number> {
    log.debug('createDealOutcomes call');
    let createdOutcomesLength = 0;
    try {
      const clientsOutcomes = this.createOutcomesToClients(deal);
      const stockHolderOutcomes = this.createOutcomesToStockHolder(deal);

      const isTestCoin = deal.rate1_puzzle_hash === addressToPuzzleHash(fullnodeEnviroment[this.cur1].TEST_ADDRESS_TO);
      if (isTestCoin) {
        log.info('*** TEST COIN: OUTCOME CREATED %O', formatOutcome(clientsOutcomes.map(outcomeModel.entityToRow)));
        await outcomeModel.add([...clientsOutcomes], trx);
      } else {
        await outcomeModel.add([...clientsOutcomes, ...stockHolderOutcomes], trx);
      }
      await dealsModel.update(deal.id, { ...deal, status: 'paid-out' }, trx);
      createdOutcomesLength += clientsOutcomes.length + stockHolderOutcomes.length;
    } catch (error) {
      log.error('createDealOutcomes error %O', error);
      await dealsModel.update(deal.id, { ...deal, status: 'error' });
    }
    return createdOutcomesLength;
  }

  // Создание двух outcome-ов на основании сделки для выплаты в соответствующие блокчейны
  public createOutcomes(props: {
    deal: Deal;
    payoutAmount1InCur2: BigNumber;
    payoutAmount2InCur1: BigNumber;
    client1PuzzleHash?: string;
    stockHolderPuzzleHash1?: string;
    client2PuzzleHash?: string;
    stockHolderPuzzleHash2?: string;
  }): [Outcome, Outcome] {
    log.debug('createOutcomes call');
    const bc1FeeConfig = this.feeConfigs[props.deal.stock_id][props.deal.cur1];
    const bc2FeeConfig = this.feeConfigs[props.deal.stock_id][props.deal.cur2];

    log.debug('fee config for cur %s: %O', props.deal.cur1, bc1FeeConfig);
    log.debug('fee config for cur %s: %O', props.deal.cur2, bc2FeeConfig);

    const transactionFeeInCur1 = new BigNumber(bc1FeeConfig.transactionFee || '0');
    const transactionFeeInCur2 = new BigNumber(bc2FeeConfig.transactionFee || '0');

    // log.debug('transactionFeeInCur1 mojo %s', transactionFeeInCur1.toString());
    // log.debug('transactionFeeInCur1 mojo %s', transactionFeeInCur2.toString());

    const amount1InCur2MinusTransactionFee = props.payoutAmount1InCur2.minus(transactionFeeInCur2);
    const amount2InCur1MinusTransactionFee = props.payoutAmount2InCur1.minus(transactionFeeInCur1);

    // log.debug('amount1InCur2MinusTransactionFee mojo %s', amount1InCur2MinusTransactionFee.toString());
    // log.debug('amount2InCur1MinusTransactionFee mojo %s', amount2InCur1MinusTransactionFee.toString());

    const payoutAmount1InCur2 = amount1InCur2MinusTransactionFee.gt(0) ? amount1InCur2MinusTransactionFee : new BigNumber(0);
    const payoutAmount2InCur1 = amount2InCur1MinusTransactionFee.gt(0) ? amount2InCur1MinusTransactionFee : new BigNumber(0);

    // log.debug('payoutAmount1InCur2 mojo %s', payoutAmount1InCur2.toString());
    // log.debug('payoutAmount2InCur1 mojo %s', payoutAmount2InCur1.toString());

    const outcome1: Outcome = {
      created_at: new Date(),
      amount: payoutAmount1InCur2,
      transaction_fee: transactionFeeInCur2,
      client_puzzle_hash: props.client1PuzzleHash,
      stock_holder_puzzle_hash: props.stockHolderPuzzleHash2,
      cur: props.deal.cur2,
      status: payoutAmount1InCur2.gt(0) ? 'created' : 'done',
      deal_id: props.deal.id,
      stock_id: props.deal.stock_id,
    };
    const outcome2: Outcome = {
      created_at: new Date(),
      amount: payoutAmount2InCur1,
      transaction_fee: transactionFeeInCur1,
      client_puzzle_hash: props.client2PuzzleHash,
      stock_holder_puzzle_hash: props.stockHolderPuzzleHash1,
      cur: props.deal.cur1,
      status: payoutAmount2InCur1.gt(0) ? 'created' : 'done',
      deal_id: props.deal.id,
      stock_id: props.deal.stock_id,
    };

    [outcome1, outcome2].forEach((outcome) => {
      log.info('New outcome %O', formatOutcome(outcomeModel.entityToRow(outcome)));
      if (outcome.status === 'done') {
        log.info('Outcome status is "done" which means that fees amount are greater that payout amount. Payout will not be performed.');
      }
    });

    return [outcome1, outcome2];
  }

  // Создание outcome-ов для выплат клиентам
  public createOutcomesToClients(deal: Deal) {
    log.debug('createOutcomesToClients call');
    let payoutAmount1InCur2 = new BigNumber(deal.seller_amount_in_cur2).minus(deal.seller_fee_in_cur2);
    let payoutAmount2InCur1 = new BigNumber(deal.buyer_amount_in_cur1).minus(deal.buyer_fee_in_cur1);

    if (payoutAmount1InCur2.lte(0)) payoutAmount1InCur2 = new BigNumber(0);
    if (payoutAmount2InCur1.lte(0)) payoutAmount2InCur1 = new BigNumber(0);

    return this.createOutcomes({
      deal,
      payoutAmount1InCur2,
      payoutAmount2InCur1,
      client1PuzzleHash: deal.seller_puzzle_hash,
      client2PuzzleHash: deal.buyer_puzzle_hash,
    });
  }

  // Создание outcome-ов для выплат на комиссионные адресов
  public createOutcomesToStockHolder(deal: Deal) {
    log.debug('createOutcomesToStockHolder call');
    const addr1 = this.cur1 === deal.cur1 ? process.env.CUR1_STOCK_HOLDER_ADDRESS : process.env.CUR2_STOCK_HOLDER_ADDRESS;
    const addr2 = this.cur2 === deal.cur1 ? process.env.CUR1_STOCK_HOLDER_ADDRESS : process.env.CUR2_STOCK_HOLDER_ADDRESS;

    log.debug('stock holder addr for cur %s: %s', this.cur1, addr1);
    log.debug('stock holder addr for cur %s: %s', this.cur2, addr2);

    const amount1InCur2MinusStockFee = new BigNumber(deal.seller_amount_in_cur2).minus(deal.seller_fee_in_cur2);
    const amount2InCur1MinusStockFee = new BigNumber(deal.buyer_amount_in_cur1).minus(deal.buyer_fee_in_cur1);

    // log.debug('amount1InCur2MinusStockFee (mojo) %s', amount1InCur2MinusStockFee.toString());
    // log.debug('amount2InCur1MinusStockFee (mojo) %s', amount2InCur1MinusStockFee.toString());

    let payoutAmount1InCur2 = new BigNumber(deal.seller_fee_in_cur2);
    let payoutAmount2InCur1 = new BigNumber(deal.buyer_fee_in_cur1);

    if (amount1InCur2MinusStockFee.lte(0)) payoutAmount1InCur2 = deal.seller_amount_in_cur2;
    if (amount2InCur1MinusStockFee.lte(0)) payoutAmount2InCur1 = deal.buyer_amount_in_cur1;

    if (payoutAmount1InCur2.lte(0)) payoutAmount1InCur2 = new BigNumber(0);
    if (payoutAmount2InCur1.lte(0)) payoutAmount2InCur1 = new BigNumber(0);

    // log.debug('payoutAmount1InCur2 (mojo) %s', payoutAmount1InCur2.toString());
    // log.debug('payoutAmount2InCur1 (mojo) %s', payoutAmount2InCur1.toString());

    return this.createOutcomes({
      deal,
      payoutAmount1InCur2,
      payoutAmount2InCur1,
      stockHolderPuzzleHash1: addressToPuzzleHash(addr1),
      stockHolderPuzzleHash2: addressToPuzzleHash(addr2),
    });
  }

  // Расчет комиссии для обратной выплаты просроченного ордера
  public static calcPaybackStockFee(feeConfig: FeeConfig, amount: BigNumber): BigNumber {
    log.debug('calcPaybackStockFee call');
    let feeAmount: BigNumber = new BigNumber(0);

    if (feeConfig.paybackFee.percent && feeConfig.paybackFee.percent !== '0') {
      // Комиссия в процентах
      feeAmount = amount.multipliedBy(feeConfig.paybackFee.percent).integerValue(BigNumber.ROUND_UP);
    } else if (feeConfig.paybackFee.fixed && feeConfig.paybackFee.fixed !== '0') {
      // Фиксированная комиссия
      feeAmount = new BigNumber(feeConfig.paybackFee.fixed);
    }

    if (feeAmount.lte(0)) {
      feeAmount = new BigNumber(0);
    }

    return feeAmount;
  }

  // Создает outcome для одного просроченного ордера
  public createExpiredOrderPaybackOutcome(order: Order): Outcome {
    log.debug('createExpiredOrderPaybackOutcome call');
    const feeConfig = this.feeConfigs[order.stock_id][order.cur1];
    const transactionFee = new BigNumber(feeConfig.transactionFee || '0');
    const paybackFee = BrokerOutcomes.calcPaybackStockFee(feeConfig, order.amount);
    const payoutAmountMinusFees = order.amount.minus(paybackFee).minus(transactionFee);
    const payoutAmount = payoutAmountMinusFees.gt(0) ? payoutAmountMinusFees : new BigNumber(0);

    const outcome: Outcome = {
      created_at: new Date(),
      amount: payoutAmount,
      transaction_fee: transactionFee,
      payback_fee: paybackFee,
      client_puzzle_hash: order.client_puzzle_hash,
      cur: order.cur1,
      status: payoutAmount.gt(0) ? 'created' : 'done',
      order_id: order.id,
      stock_id: order.stock_id,
    };

    return outcome;
  }

  // Создает outcome-ы для ордеров в статусе "expired".
  // Устанавливает такие ордеры в статус "expired-done"
  // (предотвращает повторное создание outcome-ов для таких ордеров).
  public async processExpiredOrders(expiredOrders: Order[], trx: Knex.Transaction) {
    log.debug('processExpiredOrders call');
    if (expiredOrders?.length > 0) {
      const outcomes = expiredOrders.map(this.createExpiredOrderPaybackOutcome);
      const createdOutcomes = await outcomeModel.add(outcomes, trx);

      createdOutcomes.forEach((outcome) => {
        log.info('Saved payback outcome %O', formatOutcome(outcomeModel.entityToRow(outcome)));
        if (outcome.status === 'done') {
          log.info('Outcome status is "done" which means that fees amount are greater that payback amount. Payout will not be performed.');
        }
      });
      log.info('%s refund outcomes created', outcomes.length);

      const ids = expiredOrders.map((order) => order.id);
      await ordersModel.setExpiredDone(ids, trx);
      log.debug('expired orders set as done');
    }

    log.info('%s expired orders proceeded', expiredOrders.length);
  }
}

export default BrokerOutcomes;
