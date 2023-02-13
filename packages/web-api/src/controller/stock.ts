import mock from '@/mock/mock';
import { log } from '@ctocker/lib/build/main/src/log';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { StockListItem } from '@ctocker/lib/build/main/src/types/stock';
import { Request, Response } from 'express';

export async function fetchStockList(): Promise<StockListItem[]> {
  const availableStocks = await stockConfigModel.getStockList();
  const stocks: StockListItem[] = availableStocks.map(item => ({
    id: item.id!,
    title: item?.name || `${item.cur1?.toUpperCase?.()} / ${item.cur2?.toUpperCase?.()}`,
    cur1: item.cur1!,
    cur2: item.cur2!,
    mojosInCur1Coin: String(fullnodeEnviroment[item.cur1].MOJO_IN_COIN),
    mojosInCur2Coin: String(fullnodeEnviroment[item.cur2].MOJO_IN_COIN),
  }));

  return stocks;
}

export default async function handler(_req: Request, res: Response<StockListItem[]>) {
  try {
    if (process.env.MOCK) {
      res.status(200).json(mock['/api/stock/list']);
      return;
    }
    res.status(200).json(await fetchStockList());
  } catch (error) {
    log.error(error);
    res.status(200).json([]);
  }
}
