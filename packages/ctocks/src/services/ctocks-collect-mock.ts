import incomeModel from '@ctocker/lib/build/main/src/models/income.model';
import { Income } from '@ctocker/lib/build/main/src/types/stock';
import { addressToPuzzleHash, getRandomInt } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import { sha256 } from 'js-sha256';
import { v4 as uuid } from 'uuid';
import CtocksCollect from './ctocks-collect';

class CtocksCollectMock extends CtocksCollect {
  public async collect() {
    const [cur1Income, cur2Income] = this.createIncomes();

    await knex.transaction(async trx => {
      await incomeModel.add(cur1Income, trx);
      await incomeModel.add(cur2Income, trx);
    });
  }

  private createIncomes(): [Income[], Income[]] {
    const cur1Incomes: Income[] = [];
    const cur2Incomes: Income[] = [];

    const exchangeConfig = Object.values(this.stocks)[0].config;
    const minAmount1 = exchangeConfig[exchangeConfig.cur1].minInAmountFixed;
    const minAmount2 = exchangeConfig[exchangeConfig.cur1].minInAmountFixed;

    const stockAddresses1ToRate = Object.entries(exchangeConfig[exchangeConfig.cur1].addresses)
      .sort((entry1, entry2) => +entry2[1] - +entry1[1])
      .map(entry => entry[0]);
    const stockAddresses2ToRate = Object.entries(exchangeConfig[exchangeConfig.cur2].addresses)
      .sort((entry1, entry2) => +entry2[1] - +entry1[1])
      .map(entry => entry[0]);

    const stockAddresses1 = stockAddresses1ToRate.filter(
      (_item, index) => index >= 0 && index <= Math.floor(stockAddresses1ToRate.length / 2 + stockAddresses1ToRate.length * 0.3),
    );
    const stockAddresses2 = stockAddresses2ToRate.filter(
      (_item, index) => index >= Math.floor(stockAddresses2ToRate.length / 2 - stockAddresses2ToRate.length * 0.3),
    );

    const stockId = +Object.keys(this.stocks)[0];

    for (let i = 0; i < getRandomInt(1, 5); i++) {
      cur1Incomes.push({
        tx_id: `0x${sha256(uuid())}`,
        created_at: new Date(new Date().getTime() - i * 1000),
        client_puzzle_hash: `0x${sha256(uuid())}`,
        rate_puzzle_hash: addressToPuzzleHash([...stockAddresses1].sort(() => Math.random() - 0.5).find(() => Math.random() > 0.5)),
        cur: exchangeConfig.cur1,
        amount: getRandomInt(+minAmount1, +minAmount1 * 100).toString(),
        status: 'new',
        stock_id: stockId,
      });
    }

    for (let i = 0; i < getRandomInt(1, 5); i++) {
      cur2Incomes.push({
        tx_id: `0x${sha256(uuid())}`,
        created_at: new Date(new Date().getTime() - i * 1000),
        client_puzzle_hash: `0x${sha256(uuid())}`,
        rate_puzzle_hash: addressToPuzzleHash([...stockAddresses2].sort(() => Math.random() - 0.5).find(() => Math.random() > 0.5)),
        cur: exchangeConfig.cur2,
        amount: getRandomInt(+minAmount2, +minAmount2 * 100).toString(),
        status: 'new',
        stock_id: stockId,
      });
    }

    return [cur1Incomes, cur2Incomes];
  }
}

export default CtocksCollectMock;
