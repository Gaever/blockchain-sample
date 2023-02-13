import { log } from '@/log';
import blockchainConfigModel from '@/models/blockchain-config.model';
import incomeModel from '@/models/income.model';
import outcomeModel from '@/models/outcome.model';
import stockConfigModel from '@/models/stock-config.model';
import Blockchain from '@/services/blockchain/blockchain';
import Stock from '@/services/stock';
import { BcWalk, TxRecord } from '@/types/blockchain';
import { currency, ExchangeConfig, Income, Outcome } from '@/types/stock';
import autoBind from 'auto-bind';
import { Knex } from 'knex';
import { formatIncome } from '../report/report-formats';

class BrokerCollect {
  public stocks: { [stockId: number]: Stock } = {};
  public blockchain: Blockchain;

  constructor() {
    autoBind(this);
  }

  public async init(cur: currency, configs: ExchangeConfig[]) {
    this.blockchain = new Blockchain(cur, configs);
    configs.forEach((config) => {
      this.stocks[config.id] = new Stock(config);
    });
  }

  public async collectBlockchainTransactions(from?: number, to?: number): Promise<BcWalk> {
    log.debug('collectBlockchainTransactions call');
    const txs = await this.blockchain.getTransactions(from, to);
    log.debug('collectBlockchainTransactions result %O', txs);
    return txs;
  }

  public async processCollectedTxRecords(txs: BcWalk, trx: Knex.Transaction): Promise<void> {
    if (!txs) return;
    await Promise.all(this.collectBlockchainMiddleware(txs, trx));
  }

  protected collectBlockchainMiddleware(txs: BcWalk, trx: Knex.Transaction): Promise<any>[] {
    return [
      this.saveIncomes(txs.inTxs, trx),
      this.updateOutcomes(txs.outTxs, trx),
      this.releaseFrozenCoins(txs.outTxs, txs.changeTxs, txs.confirmedRemovals, trx),
      this.processTestCoin(txs.testCoinInTx, trx),
      blockchainConfigModel.updateLastKnownHeight(this.blockchain.fullnode.enviroment.currency, txs.lastHeight, trx),
    ];
  }

  public async releaseFrozenCoins(outTxs: TxRecord[], changeTxs: TxRecord[], confirmedRemovals: TxRecord[], trx: Knex.Transaction): Promise<void> {
    log.debug('releaseFrozenCoins call');
    await Promise.all([...outTxs, ...changeTxs, ...confirmedRemovals].map(async (tx) => this.blockchain.coinCache.releaseCoin(tx.coinRecord.coin, trx)));
  }

  public async releaseExpiredFrozenCoins() {
    log.debug('releaseExpiredFrozenCoins call');
    await this.blockchain.coinCache.releaseExpiredFrozenCoins();
  }

  public async updateOutcomes(outTxs: TxRecord[], trx: Knex.Transaction): Promise<void> {
    log.debug('updateOutcomes call');
    const outcomes: Outcome[] = outTxs.map((tx) => ({ tx_id: tx.txId, height: tx.height, header_hash: tx.headerHash, status: 'done' }));
    await outcomeModel.updateByTxIds(outcomes, trx);
    log.info('updated %s outcomes', outcomes?.length);
  }

  public async saveIncomes(inTxs: TxRecord[], trx: Knex.Transaction): Promise<Income[]> {
    log.debug('saveIncomes call');
    const newIncomes = Stock.txRecordsToIncomes(inTxs);
    const savedIncomes = await incomeModel.add(newIncomes, trx);
    savedIncomes.forEach((income) => {
      log.info('saved income: %O', formatIncome(incomeModel.entityToRow(income)));
    });
    log.info('saved %s incomes', savedIncomes?.length);
    return newIncomes;
  }

  protected async processTestCoin(txRecord: TxRecord | undefined, trx: Knex.Transaction) {
    const testStockConfigRow = await trx(stockConfigModel.tableName).where({ id: 0 });
    if (testStockConfigRow?.length < 1) {
      await trx(stockConfigModel.tableName).insert({ id: 0, config_tx_id: '0' });
    }

    if (!txRecord) return;
    const income: Income = {
      amount: txRecord.coinRecord.coin.amount,
      client_puzzle_hash: txRecord.fromPuzzleHash,
      created_at: new Date(+txRecord.coinRecord.timestamp * 1000),
      cur: txRecord.cur,
      height: txRecord.height,
      header_hash: txRecord.headerHash,
      rate: '1',
      rate_puzzle_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
      stock_id: 0,
      status: 'new',
      tx_id: txRecord.txId,
    };

    const savedIncome = await incomeModel.add([income], trx);
    log.info('test coin income %O', formatIncome(incomeModel.entityToRow(savedIncome?.[0])));
  }
}
export default BrokerCollect;
