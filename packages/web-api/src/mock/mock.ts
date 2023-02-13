import stockConfig from '@ctocker/lib/build/main/src/sample-data/stock_config_1.json';
import { AddressConfig, ExchangeConfig, StockChartData, StockListItem } from '@ctocker/lib/build/main/src/types/stock';
import { RatesRes, RateToAddressRes } from '@ctocker/lib/build/main/src/types/web-api';
import { getRandomInt } from '@ctocker/lib/build/main/src/utils';
import _random from 'lodash/random';

const cur1 = stockConfig.exchangeConfig.cur1;
const cur2 = stockConfig.exchangeConfig.cur2;

const candles = [];
const volume = [];

for (let i = 1; i < 100; i++) {
  const v = getRandomInt(2, 100);
  const d = Math.floor(new Date(Date.now() + i * 60 * 1000).getTime() / 1000);
  // const d = i;

  const candle = {
    close: _random(true), // getRandomFloat(1, 10),
    high: _random(true), // getRandomFloat(1, 10),
    low: _random(true), // getRandomFloat(1, 10),
    open: _random(true), // getRandomFloat(1, 10),
    time: d,
  };

  volume.push({
    time: d,
    value: v,
    color: candle.open > candle.close ? 'rgba(255, 102, 56, 0.5)' : 'rgba(88, 189, 125, 0.5)',
  });
  candles.push(candle);
}

console.log(candles, volume);

export default {
  '/api/rate?action=list': [...Object.values(stockConfig.exchangeConfig.ach.addresses), '1', '0.9', '0.8', '0.7', '0.6'] as RatesRes,
  '/api/rate?action=to-address': {
    address1: Object.keys(stockConfig.exchangeConfig[cur1].addresses)[0],
    address2: Object.keys(stockConfig.exchangeConfig[cur2].addresses)[0],
    rate: Object.values(stockConfig.exchangeConfig[cur1].addresses)[0],
    flippedRate: '0.9009009009',
    addressConfig: {
      address: Object.keys(stockConfig.exchangeConfig[cur1].addresses)[0],
      cur1,
      cur2,
      rate: Object.values(stockConfig.exchangeConfig[cur1].addresses)[0],
      stockConfig: {
        ach: {
          fees: stockConfig.exchangeConfig.ach.fees,
          minInAmountFixed: stockConfig.exchangeConfig.ach.minInAmountFixed,
        },
        xch: {
          fees: stockConfig.exchangeConfig.xch.fees,
          minInAmountFixed: stockConfig.exchangeConfig.xch.minInAmountFixed,
        },
      },
    } as AddressConfig,
  } as RateToAddressRes,
  '/api/addresses': stockConfig as ExchangeConfig,
  '/api/stock/list': [
    {
      id: 1,
      title: 'title',
      cur1,
      cur2,
      mojosInCur1Coin: (1e12).toString(),
      mojosInCur2Coin: (1e9).toString(),
    },
  ] as StockListItem[],
  'ws:app-data': {
    candles,
    volume,

    // candles: [
    // {
    //   close: 1,
    //   high: 1,
    //   low: 1,
    //   open: 1,
    //   time: 1,
    // },
    //   {
    //     close: 2,
    //     high: 1,
    //     low: 0.1,
    //     open: 0.1,
    //     time: 2,
    //   },
    //   {
    //     close: 0.1,
    //     high: 1,
    //     low: 0.1,
    //     open: 1,
    //     time: 3,
    //   },
    // ],
    // volume: [
    //   {
    //     time: 1,
    //     value: 1,
    //     color: 'rgba(255, 102, 56, 0.5)',
    //   },
    //   {
    //     time: 2,
    //     value: 1,
    //     color: 'rgba(88, 189, 125, 0.5)',
    //   },
    // ],
    marketDepth: [
      {
        aggregatedVolume: '1',
        isTop: true,
        rate: '1',
        volume: '1',
      },
      {
        aggregatedVolume: '0.9',
        isTop: false,
        rate: '0.9',
        volume: '0.9',
      },
      {
        aggregatedVolume: '0.8',
        isTop: false,
        rate: '0.8',
        volume: '0.8',
      },
      {
        aggregatedVolume: '0.7',
        isTop: false,
        rate: '0.7',
        volume: '0.7',
      },
      {
        aggregatedVolume: '0.6',
        isTop: false,
        rate: '0.6',
        volume: '0.6',
      },
    ],
    lastDealRate: '1',
    pricePrecision: 1,
  } as StockChartData,
  'ws:stock-list': [
    {
      id: 1,
      title: 'title',
      cur1,
      cur2,
      mojosInCur1Coin: (1e12).toString(),
      mojosInCur2Coin: (1e9).toString(),
      chartData: [
        {
          time: 1,
          value: 1,
        },
        {
          time: 2,
          value: 2,
        },
        {
          time: 3,
          value: 1,
        },
      ],
    },
  ] as StockListItem[],
};
