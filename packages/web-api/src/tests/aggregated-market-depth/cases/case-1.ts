import BigNumber from 'bignumber.js';
import { TestCase } from '../orders-to-aggregated-market-depth.test';

const testCase: TestCase = {
  in: [[], 'xch', new BigNumber(1e12), new BigNumber(1e9)],
  out: { marketDepth: [], maxBuyRate: undefined, minSellRate: undefined, maxRatePrecision: 1 },
};

export default testCase;
