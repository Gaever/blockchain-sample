import BlockchainService from '@ctocker/lib/build/main/src/services/blockchain/blockchain';
import { KeyStorage, TransactionRecord } from '@ctocker/lib/build/main/src/types/blockchain';
import { currency } from '@ctocker/lib/build/main/src/types/stock';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import Debug from 'debug';

const debug = Debug('ctocker:broker');

export default async function makeTransaction(
  args: { [key: string]: string | boolean },
  customBc: BlockchainService = null,
): Promise<TransactionRecord> {
  try {
    const cur = args.tx_cur as currency;
    const addressFrom = args.tx_from as string;
    const addressTo = args.tx_to as string;
    const amount = args.tx_amount as string;
    const pk = args.tx_pk as string;
    const sk = args.tx_sk as string;
    const transactionFee = args.tx_bc_fee as string;
    const url = args.tx_stock_config_url as string;
    const urlJson = { url };

    const phFrom = addressToPuzzleHash(addressFrom);
    const phTo = addressToPuzzleHash(addressTo);

    let keyStorage: KeyStorage = {};
    if (pk && sk) {
      keyStorage[addressFrom] = {
        sk,
        pk,
      };
    }

    const bc = customBc || new BlockchainService(cur, []);

    await bc.initPayout(keyStorage);
    await bc.coinCache.releaseExpiredFrozenCoins();
    let tx;
    if (url) {
      tx = await bc.sendStockConfigPayout(urlJson, amount, phFrom, phTo, transactionFee);
    } else {
      tx = await bc.sendPayout(amount, phFrom, phTo, transactionFee);
    }
    debug('%O', tx);

    if (tx?.payout_tx_id) {
      console.log('payout tx: ', tx?.payout_tx_id);
      debug('makeTransaction; cur', cur, 'tx', tx?.payout_tx_id);
    }

    return tx;
  } catch (err) {
    console.log(err);
  }
}
