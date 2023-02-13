import mock from '@/mock/mock';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { ExchangeConfig } from '@ctocker/lib/build/main/src/types/stock';
import { Request, Response } from 'express';

export async function fetchAddresses(stockId: number) {
  const stock = await stockConfigModel.getConfig(stockId);
  if (!stock) return null;

  return stock.config_json?.exchangeConfig || null;
}

export default async function handler(req: Request, res: Response<ExchangeConfig | null>) {
  try {
    if (process.env.MOCK) {
      res.status(200).json(mock['/api/addresses']);
      return;
    }
    res.status(200).json(await fetchAddresses(+req.query.stockId));
  } catch {
    res.status(200).json(null);
  }
}
