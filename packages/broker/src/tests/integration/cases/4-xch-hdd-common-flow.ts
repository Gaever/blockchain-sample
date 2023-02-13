import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { rateToAddress } from '@ctocker/lib/build/main/src/tests/helpers';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { currency, ExchangeConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { TAddress, TCase, TestEnv } from '../helpers';

const exchangeConfig: ExchangeConfig = {
  cur1: 'xch',
  cur2: 'hdd',
  xch: {
    orderLifetimeMs: '60000000',
    minInAmountFixed: '0',
    fees: {
      takerFee: {
        percent: '0.5',
        fixed: '0',
      },
      makerFee: {
        percent: '0.1',
        fixed: '0',
      },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '1',
      xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '1.5',
      xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '2',
    },
  },
  hdd: {
    orderLifetimeMs: '60000000',
    minInAmountFixed: '0',
    fees: {
      takerFee: {
        percent: '0.5',
        fixed: '0',
      },
      makerFee: {
        percent: '0.1',
        fixed: '0',
      },
      paybackFee: { percent: '0', fixed: '0' },
      transactionFee: '0',
    },
    addresses: {
      hdd1hwzymaanl8rapdkwfx4kmn550tn3qkqteulvgzvct96r7easrejq0mczec: '1',
      hdd14awgwqzqgt7fvh0230aexaew4cjxh93tknukyezxzp2y8hrlq40stvxdth: '1.5',
      hdd19gl6mpjx26w3htexs97jmur53jr556qfxlqf8ezgq6akw6tlh8vsj825lv: '2',
    },
  },
};

const stockConfigRecord: StockConfigRecord = {
  ...defaultStockConfigRecord,
  cur1: 'xch',
  cur2: 'hdd',
  config_json: {
    exchangeConfig,
    name: 'XHC to HDD',
    fromHeight: '1',
  },
};

const keyStorage: KeyStorage = {
  xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: {
    sk: '39062119b7b84760f61157fd70a98aef6b26d231ae68dbb28cc66a52c1a29146',
    pk: '83199b1a369d3ecb5c186a34ba8448a215aba6c68e2ef70069f72ab217b75e16202a274c8268a696537ea330fb2091fb',
  },
  xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: {
    sk: '7324d4602f85c0f85e533e35919bec4371d17eafc71b69d0c643e12919d10015',
    pk: '93b301bce760b87eb67bca2fac3113e6a13d44a0bd9f951c82c14ce6151658e10e568d68c18a027a5493330b71a73e45',
  },
  xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: {
    sk: '5aaa556b4a5c47d60bcbb11fb2bac1a23c0cf02e06b60c65209da171644912f6',
    pk: 'a3c9dac2316f56871653734e2d74c2a24a762f7239689c9819deb917f5ad91b35991d6d8cba98ef7f3bd9a920b7890de',
  },
  hdd1hwzymaanl8rapdkwfx4kmn550tn3qkqteulvgzvct96r7easrejq0mczec: {
    sk: '0070ce9af6951c317cc910df6a827f5885852820fd10edb8396285c2af198643',
    pk: 'abe3f63d50924c6456000f614f84a83adfbdfef68a68f81b0259daa91a0e521c61ff6d9db789359cad99e5fe31c59822',
  },
  hdd14awgwqzqgt7fvh0230aexaew4cjxh93tknukyezxzp2y8hrlq40stvxdth: {
    sk: '069d96288ec2bc749f9ceb6e58b53f1e7ce8f102c723a8085819c6b5ef07997b',
    pk: 'adf49a2b612d4392f63dfc354948e82e8a2ba490e9966325e0a036df30fd69b22e2645a7fd9ea029215b5589d7e89d59',
  },
  hdd19gl6mpjx26w3htexs97jmur53jr556qfxlqf8ezgq6akw6tlh8vsj825lv: {
    sk: '46bcfafd567b04864c35cde63fad30311225f6cca158b92f65f31e265ab248d2',
    pk: 'a42409b2b17ad6cc147faff94a6e8c9458e33c24b4a8b62300869e59173e5ccfdf08b24d783b5cadb21069be6cc04d56',
  },
  xch14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrsh78qhv: {
    sk: '61360d55f9e5461b2bb040b97725e64c8831dc1caa9ca3ff243228b5723d41c5',
    pk: '80272d225b949893e8f43378c8092c55b44097b674910b5a46e28df95d562b02994f6059a7daae7122a61fcb76bd5a19',
  },
  xch19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2s2wwvs6: {
    sk: '538b1ad2e597efd88ebb2fa2db866b938c640e0bffa9cb24b8167f6db76be45e',
    pk: 'b9acb1ce5e5f3fe7160f241524967d5af16e187f9bebe442a0d53fe825e5076939062b461e63ac6ab8b6951f89a99e3d',
  },
  xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
    sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
  },
  hdd1kknpseak7crd8ekes7fyej900yrpj8q85lvflp4qhre8c7yw6l3scs2qrl: {
    sk: '53a65c658abe1abe64399df02881936b9f949c8a859911b02478eb5bbf537158',
    pk: 'a6a29863a55629bae7ee99f399118cda8c9552f3fd23ed57bfd51416b2d01ad9e43b331e1b89b6d618045214a0e65476',
  },
  xch1hzu98qg77h0ydwldlnduu8kmay0upjd9sa3n5mq0zjslqgu4prsqpjujam: {
    sk: '10262175a23a70f8dcda2c88abbd3a468608ac4a88e1735a768570eb50a217d7',
    pk: '919ca28ecffb534fa9c32c411a935c5e076bd9871b22cb581edf6596afc1fcdccb8898a65bbd15ba3231cb00b7d3dfae',
  },
};

export const cur1 = exchangeConfig.cur1;
export const cur2 = exchangeConfig.cur2;

const mainAddress1: TAddress = {
  cur: cur1,
  address: 'xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp',
};

const mainAddress2: TAddress = {
  cur: cur2,
  address: 'hdd1kknpseak7crd8ekes7fyej900yrpj8q85lvflp4qhre8c7yw6l3scs2qrl',
};

const stock1FeeAddress: TAddress = {
  cur: cur1,
  address: 'xch1hzu98qg77h0ydwldlnduu8kmay0upjd9sa3n5mq0zjslqgu4prsqpjujam',
};

const stock2FeeAddress: TAddress = {
  cur: cur2,
  address: 'hdd194632fpct96ejqqntxz4h4dn0kl34yksae2mpqs5uxadg8yjtysq9z5kaa',
};

function _rateToAddress(cur: currency, rate: string) {
  return rateToAddress(cur, rate, stockConfigRecord.config_json.exchangeConfig);
}

const testEnviroment: TestEnv = {
  stockConfigRecord,
  keyStorage,
  mainAddress1,
  mainAddress2,
  stock1FeeAddress,
  stock2FeeAddress,
};

const testCase: TCase = {
  title: '1 to 1 match and full payout',
  enviroment: testEnviroment,
  in: {
    aggregatedCur1Amount: process.env.TEST_XCH_START_AMOUNT,
    aggregatedCur2Amount: process.env.TEST_HDD_START_AMOUNT,
    mainAddress1Amount: String(+process.env.TEST_XCH_START_AMOUNT - 50),
    mainAddress2Amount: String(+process.env.TEST_HDD_START_AMOUNT - 50),
    aggregatedStock1Amount: '0',
    aggregatedStock2Amount: '0',
    stock1Amounts: {
      xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '0',
      xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '0',
      xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '0',
    },
    stock2Amounts: {
      hdd1hwzymaanl8rapdkwfx4kmn550tn3qkqteulvgzvct96r7easrejq0mczec: '0',
      hdd14awgwqzqgt7fvh0230aexaew4cjxh93tknukyezxzp2y8hrlq40stvxdth: '0',
      hdd19gl6mpjx26w3htexs97jmur53jr556qfxlqf8ezgq6akw6tlh8vsj825lv: '0',
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
        stockAddress: _rateToAddress(cur1, '1'),
        orderAmount: '10',
      },
    ],
  },

  out: {
    aggregatedCur1Amount: process.env.TEST_XCH_START_AMOUNT,
    aggregatedCur2Amount: process.env.TEST_HDD_START_AMOUNT,
    mainAddress1Amount: String(+process.env.TEST_XCH_START_AMOUNT - 50),
    mainAddress2Amount: String(+process.env.TEST_HDD_START_AMOUNT - 50),
    aggregatedStock1Amount: '0',
    aggregatedStock2Amount: '0',
    stock1Amounts: {
      xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '0',
      xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '0',
      xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '0',
    },
    stock2Amounts: {
      hdd1hwzymaanl8rapdkwfx4kmn550tn3qkqteulvgzvct96r7easrejq0mczec: '0',
      hdd14awgwqzqgt7fvh0230aexaew4cjxh93tknukyezxzp2y8hrlq40stvxdth: '0',
      hdd19gl6mpjx26w3htexs97jmur53jr556qfxlqf8ezgq6akw6tlh8vsj825lv: '0',
    },
    feeStorage1Amount: '1',
    feeStorage2Amount: '5',
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
        amountFrom: '40',
        amountTo: '9',
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
        amountFrom: '40',
        amountTo: '5',
        stockAddress: _rateToAddress(cur1, '1'),
        orderAmount: '10',
      },
    ],
  },
};

export default testCase;
