import { log } from '@ctocker/lib/build/main/src/log';
import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import outcomeModel from '@ctocker/lib/build/main/src/models/outcome.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import BrokerCollect from '@ctocker/lib/build/main/src/services/broker/broker-collect';
import { BcWalk, StockConfigTxRecord, TxRecord } from '@ctocker/lib/build/main/src/types/blockchain';
import { AddressConfig, currency, Outcome } from '@ctocker/lib/build/main/src/types/stock';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import BigNumber from 'bignumber.js';
import { Knex } from 'knex';
import stockConfigManager from './stock-config-manager';

class CtocksCollect extends BrokerCollect {
  protected collectBlockchainMiddleware(txs: BcWalk, trx: Knex.Transaction): Promise<any>[] {
    return [
      this.saveIncomes(txs.inTxs, trx),
      this.createOutcomes(txs.outTxs, this.blockchain.fullnode.enviroment.currency, trx),
      this.saveStockConfig(txs.configTxs, trx),
      this.processTestCoin(txs.testCoinInTx, trx),
      blockchainConfigModel.updateLastKnownHeight(this.blockchain.fullnode.enviroment.currency, txs.lastHeight, trx),
    ];
  }

  public async processNewConfigs() {
    return stockConfigManager.processNewConfigs();
  }

  public async createOutcomes(outTxs: TxRecord[], cur: currency, trx: Knex.Transaction): Promise<Outcome[]> {
    log.debug('createOutcomes call');
    const outcomes: Outcome[] = outTxs.map(txRecord => {
      const config = this.puzzleHashToAddressConfig(txRecord.fromPuzzleHash, cur);

      const outcome: Outcome = {
        created_at: new Date(),
        amount: new BigNumber(txRecord.coinRecord.coin.amount),
        transaction_fee: new BigNumber(config?.[cur]?.fees?.transactionFee?.[cur] || 0),
        client_puzzle_hash: txRecord.toPuzzleHash,
        cur,
        status: 'done',
        deal_id: null,
        stock_id: config?.stockId,
        tx_id: txRecord.txId,
      };

      if (addressToPuzzleHash(fullnodeEnviroment[cur].TEST_ADDRESS_FROM) === outcome.client_puzzle_hash) {
        log.info('*** TEST COIN: PAYBACK OUTCOME CREATED ***');
      }
      return outcome;
    });
    await outcomeModel.add(outcomes, trx);
    log.info('%s outcomes found', outcomes.length);
    return outcomes;
  }

  private puzzleHashToAddressConfig(ph: string, cur: currency): AddressConfig {
    log.debug('puzzleHashToAddressConfig call');
    let config: AddressConfig = null;
    Object.values(this.stocks).find(stock => {
      const item = stock.puzzleHashToAddressConfig(ph, cur);
      config = item;
      return item;
    });
    return config;
  }

  private async saveStockConfig(configTxs: StockConfigTxRecord[], trx: Knex.Transaction) {
    log.debug('saveStockConfig call');
    if (configTxs.length) {
      await Promise.all(
        configTxs.map(async tx => {
          await stockConfigManager.addNewConfig(tx, trx);
        }),
      );
    }
  }
}

export default CtocksCollect;
