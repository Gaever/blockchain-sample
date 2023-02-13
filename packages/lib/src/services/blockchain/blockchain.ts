import { log } from '@/log';
import blockchainConfigModel from '@/models/blockchain-config.model';
import CoinCache from '@/services/broker/coin-cache';
import NotificationService from '@/services/notification';
import { BcWalk, BlockchainConfig, BlockRecord, Coin, CoinRecord, KeyStorage, StockConfigTxRecord, TransactionRecord, TxRecord } from '@/types/blockchain';
import { currency, ExchangeConfig } from '@/types/stock';
import { puzzleHashToAddress } from '@/utils';
import autoBind from 'auto-bind';
import { to_hexstr } from 'clvm';
import { formatStockConfigTxRecord, formatTxRecord } from '../report/report-formats';
import FullNodeAdapter from './fullnode/fullnode-adapter';
import { extractJsonFromSolution, getCoinName } from './fullnode/puzzle/puzzle-utils';
import TransactionManager from './fullnode/puzzle/transacton-manager';

class Blockchain {
  public fullnode: FullNodeAdapter;
  public addressToStock: { [address: string]: { id: number; rate: string } } = {};
  public coinCache: CoinCache = new CoinCache();

  public txManager: TransactionManager;
  public notificationService = new NotificationService();

  private lock: boolean = false;

  constructor(currency: currency, configs: ExchangeConfig[] = []) {
    autoBind(this);

    this.fullnode = new FullNodeAdapter(currency);
    this.applyExchangeConfigs(configs);
  }

  public addConfig(config: ExchangeConfig) {
    this.applyExchangeConfigs([config]);
  }

  public async initPayout(keyStorage: KeyStorage = {}) {
    this.txManager = new TransactionManager();
    await this.txManager.init(this.fullnode.enviroment, keyStorage);
  }

  private applyExchangeConfigs(configs: ExchangeConfig[]) {
    const currency = this.fullnode.enviroment.currency;

    configs.forEach((config) => {
      for (const address of Object.keys(config[currency].addresses || {})) this.addressToStock[address] = { id: config.id, rate: config[currency].addresses[address] };
    });
  }

  private isGenesisCoin(coinName: string): boolean {
    const indexof1 = this.fullnode.enviroment.GENESIS_CHALLENGE.indexOf(coinName.slice(0, 34));
    const indexof2 = this.fullnode.enviroment.GENESIS_CHALLENGE.indexOf(coinName.slice(34));
    return indexof1 === 0 || indexof1 === 34 || indexof2 === 0 || indexof2 === 34;
  }

  private async getBlockchainConfig(from: number | null, peak: number) {
    let blockchainConfig: BlockchainConfig;

    let startHeight = from || peak;

    try {
      blockchainConfig = await blockchainConfigModel.getConfig(this.fullnode.enviroment.currency);

      if (!blockchainConfig?.last_known_height || !blockchainConfig?.service_start_height) {
        log.debug('found blockchian config, but blockchainConfig.last_known_height is empty. Going to save last known height to %s', startHeight);

        await blockchainConfigModel.updateLastKnownHeight(this.fullnode.enviroment.currency, startHeight);
        await blockchainConfigModel.updateServiceStartHeight(this.fullnode.enviroment.currency, startHeight);

        blockchainConfig = {
          cur: this.fullnode.enviroment.currency,
          last_known_height: startHeight,
          service_start_height: startHeight,
        };

        log.debug('blockchain config updated %O', blockchainConfig);
      }
    } catch (error) {
      if (error.message === '!config') {
        blockchainConfig = {
          cur: this.fullnode.enviroment.currency,
          last_known_height: startHeight,
          service_start_height: startHeight,
        };
        log.debug('there is no blockchain config in db. Save new %O', blockchainConfig);
        await blockchainConfigModel.addConfig(blockchainConfig);
      } else {
        throw error;
      }
    }

    log.debug('blockchain config %O', blockchainConfig);

    return blockchainConfig;
  }

  public async getTransactions(from: number = null, to: number = null): Promise<BcWalk | null> {
    log.debug('getTransactions call with params %O', { from, to });
    try {
      if (this.lock) {
        log.debug('Blockchain is busy. Skip getTransactions().');
        return null;
      }
      this.lock = true;

      const inTxs: TxRecord[] = [];
      const outTxs: TxRecord[] = [];
      const changeTxs: TxRecord[] = [];
      const confirmedRemovals: TxRecord[] = [];
      const configTxs: StockConfigTxRecord[] = [];

      let testCoinInTx: TxRecord = null;

      const peak = (await this.fullnode.instance.getBlockchainState())?.blockchain_state?.peak?.height;

      const safeDistance = 2;
      const batchLimit = 10;

      log.debug('peak %s, safeDistance before peak %s', peak, safeDistance);

      const blockchainConfig = await this.getBlockchainConfig(from, peak);

      const lastKnownHeight = blockchainConfig?.last_known_height;
      const fromHeight = from || lastKnownHeight + 1;
      let toHeight = to || peak - safeDistance;

      if (toHeight - fromHeight > batchLimit) toHeight = fromHeight + batchLimit;

      log.debug(
        'last known height %s. Script will try to inspect blockchain from height %s to height %s. Max %s blocks will be processed in this iteration',
        lastKnownHeight,
        fromHeight,
        toHeight,
        batchLimit
      );

      if (!fromHeight) throw new Error(`[${this.fullnode.enviroment.currency}] from height is undefiend`);

      if (toHeight <= fromHeight) {
        log.info('Wait until %s blocks will exist between start height (%s) and peak (%s)', safeDistance, fromHeight, peak);
        this.lock = false;
        return null;
      }

      log.info('[%s] walk from %d to %d. Peak: %s', this.fullnode.enviroment.currency, fromHeight, toHeight, peak);
      await this.walk(fromHeight, toHeight, async (blockRecord) => {
        const headerHash = blockRecord.header_hash;
        const height = blockRecord.height;
        const additionsAndRemovals = await this.fullnode.instance.getAdditionsAndRemovals(headerHash);

        log.debug('block record %O', blockRecord);

        const parentCoinsCache: { [key: string]: CoinRecord } = {};

        for (const coinRecord of additionsAndRemovals.additions || []) {
          try {
            const fromParentCoinInfo = coinRecord?.coin?.parent_coin_info;
            if (this.isGenesisCoin(fromParentCoinInfo)) {
              log.debug('skip genesis coin %s', fromParentCoinInfo);
              continue;
            }
            const parentCoin = parentCoinsCache[fromParentCoinInfo] || (await this.fullnode.instance.getCoinRecordByName(fromParentCoinInfo));
            log.debug('parentCoin %O', parentCoin);

            const toPuzzleHash = coinRecord?.coin?.puzzle_hash;
            const fromPuzzleHash = parentCoin?.coin?.puzzle_hash;

            const toAddress = toPuzzleHash && this.fullnode.instance.puzzleHashToAddress(toPuzzleHash);
            const fromAddress = this.parentCoinToFromAddress(parentCoin);

            const tx: TxRecord = {
              txId: to_hexstr(getCoinName(coinRecord.coin)),
              headerHash,
              coinRecord,
              fromPuzzleHash,
              toPuzzleHash,
              height,
              createdAtTime: +coinRecord?.timestamp,
              cur: this.fullnode.enviroment.currency,
            };

            if (this.addressToStock[toAddress] && this.addressToStock[fromAddress]) {
              log.info('[%s] change coin %O', this.fullnode.enviroment.currency, formatTxRecord(tx));
              changeTxs.push(tx);
              continue;
            }
            if (this.addressToStock[toAddress]) {
              const inTx = {
                ...tx,
                stock_id: this.addressToStock[toAddress].id,
                rate: this.addressToStock[toAddress].rate,
              };
              inTxs.push(inTx);
              log.info('[%s] income %O', this.fullnode.enviroment.currency, formatTxRecord(inTx));
              continue;
            }
            if (this.addressToStock[fromAddress] || (this.fullnode.enviroment.STOCK_HOLDER_ADDRESS && fromAddress === this.fullnode.enviroment.STOCK_HOLDER_ADDRESS)) {
              const outTx = {
                ...tx,
                stock_id: this.addressToStock[fromAddress].id,
              };
              log.info('[%s] outcome %O', this.fullnode.enviroment.currency, formatTxRecord(outTx));
              outTxs.push(outTx);
              continue;
            }

            if (toAddress === this.fullnode.enviroment.TEST_ADDRESS_TO) {
              testCoinInTx = {
                ...tx,
                stock_id: 0,
              };
              log.info('[%s] *** TEST COIN: RECIEVED *** %O', this.fullnode.enviroment.currency, formatTxRecord(testCoinInTx));
            }

            if (fromAddress === this.fullnode.enviroment.TEST_ADDRESS_TO) {
              const outTx = {
                ...tx,
                stock_id: 0,
              };
              outTxs.push(outTx);
              log.info('[%s] *** TEST COIN: TRANSACTION CONFIRMED *** %O', this.fullnode.enviroment.currency, formatTxRecord(outTx));
              continue;
            }

            const configTx = await this.getStockConfigTransaction(toAddress, tx);
            if (configTx) {
              log.info('[%s] config %O', this.fullnode.enviroment.currency, formatStockConfigTxRecord(configTx));
              configTxs.push(configTx);
              continue;
            }
          } catch (error) {
            if (!(error?.message || '')?.match?.(/Coin\srecord\s(.*)\snot\sfound/gim)) {
              log.error('[%s] %O', this.fullnode.enviroment.currency, error);
              throw error;
            }
          }
        }

        for (const coinRecord of additionsAndRemovals.removals || []) {
          const toPuzzleHash = coinRecord?.coin?.puzzle_hash;
          const toAddress = toPuzzleHash && this.fullnode.instance.puzzleHashToAddress(toPuzzleHash);
          if (this.addressToStock[toAddress]) {
            const fromParentCoinInfo = coinRecord?.coin?.parent_coin_info;
            const parentCoin = parentCoinsCache[fromParentCoinInfo] || (await this.fullnode.instance.getCoinRecordByName(fromParentCoinInfo));
            const fromPuzzleHash = parentCoin?.coin?.puzzle_hash;

            const tx: TxRecord = {
              txId: to_hexstr(getCoinName(coinRecord.coin)),
              headerHash,
              coinRecord,
              fromPuzzleHash,
              toPuzzleHash,
              height,
              createdAtTime: +coinRecord?.timestamp,
              cur: this.fullnode.enviroment.currency,
            };

            log.info('[%s] confirmed removal %s', this.fullnode.enviroment.currency, formatTxRecord(tx));

            confirmedRemovals.push(tx);
          }
        }
      });

      this.lock = false;

      log.info('%s blocks inspected. New last known height is %s', toHeight - fromHeight, toHeight);

      return {
        inTxs,
        outTxs,
        configTxs,
        changeTxs,
        confirmedRemovals,
        testCoinInTx,
        lastHeight: toHeight,
      };
    } catch (error) {
      log.error('[%s] %O', this.fullnode.enviroment.currency, error);
      throw error;
    }
  }

  private parentCoinToFromAddress(coinRecord: CoinRecord): string {
    if (!coinRecord?.coin?.puzzle_hash) return '';
    return puzzleHashToAddress(coinRecord.coin.puzzle_hash, this.fullnode.instance.prefix);
  }

  private async getStockConfigTransaction(toAddress: string, tx: TxRecord): Promise<StockConfigTxRecord | null> {
    if (this.fullnode.enviroment.STOCK_CONFIG_ADDRESS && toAddress === this.fullnode.enviroment.STOCK_CONFIG_ADDRESS) {
      const puzzleAndSolution = await this.fullnode.instance.getPuzzleAndSolution(tx.coinRecord.coin.parent_coin_info, tx.coinRecord.confirmed_block_index);
      const json = extractJsonFromSolution(puzzleAndSolution.coin_solution.solution);
      return {
        ...tx,
        json,
      };
    }
    return null;
  }

  private async walk(fromHeight: number, toHeight: number, fn: (blockRecord: BlockRecord) => Promise<any>): Promise<void> {
    for (let height = fromHeight; height <= toHeight; height++) {
      const blockRecordResponse = await this.fullnode.instance.getBlockRecordByHeight(height);
      await fn(blockRecordResponse.block_record);
    }
  }

  public async sendPayout(amount: string, fromPuzzleHash: string, toPuzzleHash: string, fee: string = '0'): Promise<TransactionRecord> {
    if (!this.txManager) throw new Error('key storage not configurated');
    const coins = await this.collectSpendableCoins(amount, fromPuzzleHash);
    log.debug('sendPayout; spendable and unfrozen coins: %O', coins);
    if (!coins.length) return null;
    const tx = await this.txManager.createTransaction(amount, fromPuzzleHash, toPuzzleHash, coins, fee);
    log.debug('sendPayout; transaction record %O', JSON.stringify(tx));
    const spendBundle = this.fullnode.instance.remapSpendBundle(tx.spend_bundle);
    log.debug('sendPayout; remapped to current blockchain spend bundle %O', JSON.stringify(spendBundle));
    const response = await this.fullnode.request.http('push_tx', { spend_bundle: spendBundle });
    log.debug('sendPayout api response %O', response);
    if (response?.status && response.status !== 'SUCCESS') throw new Error(`API_RESPONSE_NOT_SUCCESS`);
    if (!response?.status) throw new Error(`push_tx response status is not success. ${JSON.stringify(response)}`);
    return tx;
  }

  public async sendStockConfigPayout(json: any, amount: string, fromPuzzleHash: string, toPuzzleHash: string, fee: string = '0'): Promise<TransactionRecord> {
    if (!this.txManager) throw new Error('key storage not configurated');
    const coins = await this.collectSpendableCoins(amount, fromPuzzleHash);
    log.debug('sendStockConfigPayout; spendable and unfrozen coins: %O', coins);
    if (!coins.length) return null;
    const tx = await this.txManager.creatStockConfigTransaction(json, amount, fromPuzzleHash, toPuzzleHash, coins, fee);
    log.debug('sendStockConfigPayout; transaction record %O', JSON.stringify(tx));
    const spendBundle = this.fullnode.instance.remapSpendBundle(tx.spend_bundle);
    log.debug('sendStockConfigPayout; remapped to current blockchain spend bundle %O', JSON.stringify(spendBundle));
    const response = await this.fullnode.request.http('push_tx', { spend_bundle: spendBundle });
    log.debug('sendStockConfigPayout api response %O', response);
    if (response?.status !== 'SUCCESS') throw new Error(`push_tx response status is not success. ${JSON.stringify(response)}`);
    return tx;
  }

  private async collectSpendableCoins(amount: string, puzzleHash: string) {
    const coins: Coin[] = [];

    const coinRecords = await this.fullnode.instance.getUnspentCoinRecordsByPuzzleHash(puzzleHash);
    const spendableCoinRecords = await this.coinCache.filterFrozenCoins(coinRecords);

    (spendableCoinRecords || []).forEach((coinRecord) => {
      const isEnough = (coins || []).map((coin) => BigInt(coin.amount)).reduce((bank, value) => bank + value, 0n) >= BigInt(amount);
      if (!isEnough) {
        coins.push(coinRecord.coin);
      }
    });

    return coins.map((item) => ({ ...item, amount: String(item.amount) }));
  }
}

export default Blockchain;
