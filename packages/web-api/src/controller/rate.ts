import mock from '@/mock/mock';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import { flipRate } from '@ctocker/lib/build/main/src/services/lookup/matcher';
import { AddressConfig } from '@ctocker/lib/build/main/src/types/stock';
import { RatesRes, RateToAddressRes } from '@ctocker/lib/build/main/src/types/web-api';
import BigNumber from 'bignumber.js';
import { Request, Response } from 'express';

const sortRates = (a: string, b: string) => {
  const v = new BigNumber(b);
  if (v.gt(a)) return 1;
  if (v.eq(a)) return 0;
  return -1;
};

const ratesCache: { [key: string]: RatesRes } = {};

export async function fetchRates(stockId: number, flip: boolean = false): Promise<RatesRes> {
  const cacheKey = `${stockId}-${flip ? '1' : '0'}`;

  if (ratesCache[cacheKey]) return ratesCache[cacheKey];

  const stock = await stockConfigModel.getConfig(stockId);

  if (!stock?.config_json?.exchangeConfig) throw 'stock';
  const addresses = stock.config_json.exchangeConfig[stock.config_json.exchangeConfig.cur1!]!.addresses;

  let rates;

  if (flip) {
    rates = Object.values(addresses)
      .map(rate => flipRate(new BigNumber(rate)).toString())
      .sort(sortRates);
  } else {
    rates = Object.values(addresses).sort(sortRates);
  }
  const res = rates.map(item => new BigNumber(item).toFormat());

  ratesCache[cacheKey] = res;

  return res;
}

const rateToIndexAddressCache: { [key: string]: RateToAddressRes } = {};

export async function rateIndexToAddress(stockId: number, rateIndex: number, flip: boolean = false): Promise<RateToAddressRes> {
  const cacheKey = `${stockId}-${rateIndex}-${flip ? '1' : '0'}`;
  if (rateToIndexAddressCache[cacheKey]) return rateToIndexAddressCache[cacheKey];

  const stock = await stockConfigModel.getConfig(stockId);

  if (!stock?.config_json?.exchangeConfig) throw 'stock';

  const exchangeConfig = stock.config_json.exchangeConfig;

  const cur1 = exchangeConfig.cur1!;
  const cur2 = exchangeConfig.cur2!;

  const addressToRate1 = exchangeConfig[cur1]!.addresses;
  const addressToRate2 = exchangeConfig[cur2]!.addresses;

  const entries1 = Object.entries(addressToRate1 || {}).sort((a, b) => sortRates(a[1], b[1]));
  const entries2 = Object.entries(addressToRate2 || {});

  const [address1, rate] = flip ? entries1?.[entries1?.length - rateIndex - 1] : entries1?.[rateIndex] || [];
  const address2 = entries2?.find?.(entry => entry?.[1] === rate)?.[0];

  if (!address1 || !address2) throw 'address';

  const flippedRate = flipRate(new BigNumber(rate)).toString();

  let addressConfig: AddressConfig = {
    cur1,
    cur2,
    address: address1,
    rate,
    stockId,
    stockConfig: {
      [cur1]: {
        fees: exchangeConfig[cur1].fees,
        orderLifetimeMs: exchangeConfig[cur1].orderLifetimeMs,
        minInAmountFixed: exchangeConfig[cur1].minInAmountFixed,
      },
      [cur2]: {
        fees: exchangeConfig[cur2].fees,
        orderLifetimeMs: exchangeConfig[cur2].orderLifetimeMs,
        minInAmountFixed: exchangeConfig[cur2].minInAmountFixed,
      },
    },
  };

  if (flip) {
    addressConfig = {
      cur1: cur2,
      cur2: cur1,
      address: address2,
      rate: flippedRate,
      stockId,
      stockConfig: {
        [cur1]: {
          fees: exchangeConfig[cur1].fees,
          orderLifetimeMs: exchangeConfig[cur1].orderLifetimeMs,
          minInAmountFixed: exchangeConfig[cur1].minInAmountFixed,
        },
        [cur2]: {
          fees: exchangeConfig[cur2].fees,
          orderLifetimeMs: exchangeConfig[cur2].orderLifetimeMs,
          minInAmountFixed: exchangeConfig[cur2].minInAmountFixed,
        },
      },
    };
  }

  const res = { address1, address2, rate, flippedRate, addressConfig };

  rateToIndexAddressCache[cacheKey] = res;

  return res;
}

export default async function handler(req: Request, res: Response) {
  try {
    const action = req.query.action as string;
    const stockId = +req.query.stockId;
    const flip = req.query.flip === 'true';

    if (!action) throw 'action';
    if (!stockId) throw 'stockId';

    if (process.env.MOCK) {
      switch (action) {
        case 'list':
          res.status(200).json(mock['/api/rate?action=list']);
          break;
        case 'to-address':
          res.status(200).json(mock['/api/rate?action=to-address']);
          break;
      }
    } else {
      switch (action) {
        case 'list':
          res.status(200).json(await fetchRates(stockId, flip));
          break;
        case 'to-address':
          const rateIndex = req.query.rate_index as string;
          res.status(200).json(await rateIndexToAddress(stockId, +rateIndex, flip));
          break;
        default:
          throw 'action';
      }
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
