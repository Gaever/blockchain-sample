import { rateToAddress } from '@ctocker/lib/build/main/src/tests/helpers';
import { currency } from '@ctocker/lib/build/main/src/types/stock';
import _cloneDeep from 'lodash/cloneDeep';
import _set from 'lodash/set';
import { TCase } from '../helpers';
import { cur1, cur2, testEnviroment } from '../test-enviroment';

const enviroment = _cloneDeep(testEnviroment);

_set(enviroment, 'stockConfigRecord.config_json.exchangeConfig.xch.orderLifetimeMs', 1000 * 10);
_set(enviroment, 'stockConfigRecord.config_json.exchangeConfig.ach.orderLifetimeMs', 1000 * 10);

function _rateToAddress(cur: currency, rate: string) {
  return rateToAddress(cur, rate, enviroment.stockConfigRecord.config_json.exchangeConfig);
}

const testCase: TCase = {
  title: 'payback expired unmatched orders',
  enviroment,
  in: {
    aggregatedCur1Amount: process.env.TEST_XCH_START_AMOUNT,
    aggregatedCur2Amount: process.env.TEST_ACH_START_AMOUNT,
    mainAddress1Amount: String(+process.env.TEST_XCH_START_AMOUNT - 50),
    mainAddress2Amount: String(+process.env.TEST_ACH_START_AMOUNT - 50),
    aggregatedStock1Amount: '0',
    aggregatedStock2Amount: '0',
    stock1Amounts: {
      xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '0',
      xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '0',
      xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '0',
    },
    stock2Amounts: {
      ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: '0',
      ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '0',
      ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '0',
    },
    feeStorage1Amount: '0',
    feeStorage2Amount: '0',
    clients: [
      {
        addressFrom: {
          cur: cur2,
          address: 'ach14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrswfke5s',
        },
        addressTo: {
          cur: cur1,
          address: 'xch14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrsh78qhv',
        },
        amountFrom: '50',
        amountTo: '0',
        stockAddress: _rateToAddress(cur2, '1'),
        orderAmount: '10',
      },

      {
        addressFrom: {
          cur: cur1,
          address: 'xch19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2s2wwvs6',
        },
        addressTo: {
          cur: cur2,
          address: 'ach19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2snel4nx',
        },
        amountFrom: '50',
        amountTo: '0',
        stockAddress: _rateToAddress(cur1, '2'),
        orderAmount: '10',
      },
    ],
  },

  loopExitCondition({ outcomes, coinCacheRows }) {
    return outcomes?.length > 0 && !outcomes.find(item => item.status !== 'done') && coinCacheRows?.length === 0;
  },

  out: {
    aggregatedCur1Amount: process.env.TEST_XCH_START_AMOUNT,
    aggregatedCur2Amount: process.env.TEST_ACH_START_AMOUNT,
    mainAddress1Amount: String(+process.env.TEST_XCH_START_AMOUNT - 50),
    mainAddress2Amount: String(+process.env.TEST_ACH_START_AMOUNT - 50),
    aggregatedStock1Amount: '0',
    aggregatedStock2Amount: '0',
    stock1Amounts: {
      xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '0',
      xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '0',
      xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '0',
    },
    stock2Amounts: {
      ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: '0',
      ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '0',
      ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '0',
    },
    feeStorage1Amount: '0',
    feeStorage2Amount: '0',
    clients: [
      {
        addressFrom: {
          cur: cur2,
          address: 'ach14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrswfke5s',
        },
        addressTo: {
          cur: cur1,
          address: 'xch14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrsh78qhv',
        },
        amountFrom: '50',
        amountTo: '0',
        stockAddress: _rateToAddress(cur2, '1'),
        orderAmount: '10',
      },

      {
        addressFrom: {
          cur: cur1,
          address: 'xch19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2s2wwvs6',
        },
        addressTo: {
          cur: cur2,
          address: 'ach19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2snel4nx',
        },
        amountFrom: '50',
        amountTo: '0',
        stockAddress: _rateToAddress(cur1, '2'),
        orderAmount: '10',
      },
    ],
  },
};

export default testCase;
