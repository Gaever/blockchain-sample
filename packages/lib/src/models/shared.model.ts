import { HeightToUpdate } from '@/types/blockchain';
import { Deal, Income, Order } from '@/types/stock';
import knex from '@/utils/knex';
import autoBind from 'auto-bind';
import blockchainConfigModel from './blockchain-config.model';
import dealsModel from './deals.model';
import incomeModel from './income.model';
import ordersModel from './orders.model';

class SharedModel {
  constructor() {
    autoBind(this);
  }

  public async saveOnIncome(props: { incomes: Income[]; lastKnownCollectHeightsToUpdate: HeightToUpdate[] }): Promise<Income[]> {
    const newIncomesWithIds: Income[] = [];
    await knex.transaction(async (trx) => {
      newIncomesWithIds.push(...(await incomeModel.add(props.incomes, trx)));

      for (const item of props.lastKnownCollectHeightsToUpdate) {
        await blockchainConfigModel.updateLastKnownHeight(item.cur, item.height, trx);
      }
    });

    return newIncomesWithIds;
  }

  public async saveOnMatch(props: { orders: Order[]; deals: Deal[] }): Promise<Deal[]> {
    const newDealsWithIds: Deal[] = [];

    await knex.transaction(async (trx) => {
      newDealsWithIds.push(...(await dealsModel.add(props.deals, trx)));

      for (const order of props.orders) {
        await ordersModel.update(order.id, order, trx);
      }
    });

    return newDealsWithIds;
  }
}

export default new SharedModel();
