import { log } from '@/log';
import coinCacheModel from '@/models/coin-cache.model';
import { getCoinName } from '@/services/blockchain/fullnode/puzzle/puzzle-utils';
import { Coin, CoinRecord, FrozenCoinRecord } from '@/types/blockchain';
import autoBind from 'auto-bind';
import { to_hexstr } from 'clvm';
import { Knex } from 'knex';

const min5 = 1000 * 60 * 5;
const frozenCoinLifetimeMs = min5;

/**
 * There are change coins falling back to stock address when spend transaction is performed.
 * These change coins are not available to spend while transaction is in mempool.
 * However there is no option to be sure if change coins are frozen and are not available for spend.
 *
 * CoinCache fulfils this functionality.
 * When spend transaction is performed you have to push spend_bundle.additions, having stock address (change address)
 * to CoinCache with CoinCache.freezeCoin method.
 *
 * Next, checkout blockchain for transaction confirmation. Now you can be sure change coins are available.
 * Release them with CoinCache.releaseCoin
 *
 * Still there is a chance that transaction is stuck in mempool because of low fee
 * and was thrown back with another transaction. Coins becomes spendable again but you don't now about it.
 * If spend transaction wasn't confirme in `frozenCoinLifetimeMs`, release the expired coins with `releaseExpiredFrozenCoins`
 */
class CoinCache {
  // public frozenCoins: FrozenCoins = {};

  constructor() {
    autoBind(this);
  }

  public async freezeCoin(coin: Coin, trx: Knex.Transaction): Promise<void> {
    log.debug('freezeCoin %O, name: %O', coin, to_hexstr(getCoinName(coin)));
    const coinName = to_hexstr(getCoinName(coin));
    const item: FrozenCoinRecord = {
      coin_name: coinName,
      expires_at: new Date(new Date().getTime() + frozenCoinLifetimeMs),
    };

    await coinCacheModel.add([item], trx);
  }

  public async releaseCoin(coin: Coin, trx: Knex.Transaction): Promise<void> {
    log.debug('releaseCoin %O, name: %O', coin, to_hexstr(getCoinName(coin)));
    const coinName = to_hexstr(getCoinName(coin));
    await coinCacheModel.delete(coinName, trx);
  }

  public async releaseExpiredFrozenCoins(): Promise<void> {
    const released = await coinCacheModel.deleteExpired();
    log.debug('released expired frozen coins: %O', released);
  }

  public async filterFrozenCoins(coinRecords: CoinRecord[]): Promise<CoinRecord[]> {
    const frozenCoinsRows = await coinCacheModel.fetch();
    log.debug('frozen coins %O', frozenCoinsRows);
    const frozenCoins: { [key: string]: string } = {};
    frozenCoinsRows.forEach((item) => {
      frozenCoins[item.coin_name] = item.coin_name;
    });
    return coinRecords.filter((coinRecord) => !frozenCoins[to_hexstr(getCoinName(coinRecord.coin))]);
  }
}

export default CoinCache;
