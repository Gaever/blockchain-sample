import defaultStockConfigRecord from '@ctocker/lib/build/main/src/tests/default-stock-config-record';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { ExchangeConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import { TAddress, TestEnv } from './helpers';

const exchangeConfig: ExchangeConfig = {
  cur1: 'xch',
  cur2: 'ach',
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
  ach: {
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
      ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: '1',
      ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: '1.5',
      ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '2',
    },
  },
};

const stockConfigRecord: StockConfigRecord = {
  ...defaultStockConfigRecord,
  cur1: exchangeConfig.cur1,
  cur2: exchangeConfig.cur2,
  config_json: {
    name: defaultStockConfigRecord.config_json.name,
    exchangeConfig: exchangeConfig,
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
  ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: {
    sk: '0ac4aed8c24abaca4a0eb9575ed078d529b1c1a6adfc1b5e67f2929f51d476ec',
    pk: 'b20a470699623f880786e09bfe240f909574ad8a8d1877d23ce83b4d7593690048266071bd379d5bcfa6b9e7fd34ba58',
  },
  ach1t7a97c0tenhpk323sq0sfssg78gmqef6ue4zn4u9hcggkq00d30sqdc7ku: {
    sk: '146c0525534a1fce32a2390280247a5373d8bcd828c43e37945ec11c7b8e89ce',
    pk: '8e4eefc28c50a459b8c5432b749d8e870c6ba344a339fc1339a6e193a72c7fa56602610d54782b8145fb3a065a98ac03',
  },
  ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: {
    sk: '45f96ca1c9102d4aacc565badb376c0d62083791ae44f22d564a00e7aca80cbb',
    pk: '8aea424c425ee79a0138ffd6525a809b7231aff0d613f8142d315e210540e3946a42e90c0d71ddecc9af28a5bae4a7df',
  },
  ach14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrswfke5s: {
    sk: '61360d55f9e5461b2bb040b97725e64c8831dc1caa9ca3ff243228b5723d41c5',
    pk: '80272d225b949893e8f43378c8092c55b44097b674910b5a46e28df95d562b02994f6059a7daae7122a61fcb76bd5a19',
  },
  xch14nlu9l73wtpd00c7r0ge7pv8xp87t3jk8qg3zud3usqnfdewzwrsh78qhv: {
    sk: '61360d55f9e5461b2bb040b97725e64c8831dc1caa9ca3ff243228b5723d41c5',
    pk: '80272d225b949893e8f43378c8092c55b44097b674910b5a46e28df95d562b02994f6059a7daae7122a61fcb76bd5a19',
  },
  xch19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2s2wwvs6: {
    sk: '538b1ad2e597efd88ebb2fa2db866b938c640e0bffa9cb24b8167f6db76be45e',
    pk: 'b9acb1ce5e5f3fe7160f241524967d5af16e187f9bebe442a0d53fe825e5076939062b461e63ac6ab8b6951f89a99e3d',
  },
  ach19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2snel4nx: {
    sk: '538b1ad2e597efd88ebb2fa2db866b938c640e0bffa9cb24b8167f6db76be45e',
    pk: 'b9acb1ce5e5f3fe7160f241524967d5af16e187f9bebe442a0d53fe825e5076939062b461e63ac6ab8b6951f89a99e3d',
  },
  xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
    sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
  },
  ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna: {
    sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
  },
  xch1hzu98qg77h0ydwldlnduu8kmay0upjd9sa3n5mq0zjslqgu4prsqpjujam: {
    sk: '10262175a23a70f8dcda2c88abbd3a468608ac4a88e1735a768570eb50a217d7',
    pk: '919ca28ecffb534fa9c32c411a935c5e076bd9871b22cb581edf6596afc1fcdccb8898a65bbd15ba3231cb00b7d3dfae',
  },
  ach1vhwlgpz5dz7mav408q306zmxlcj7x6psu8ad4ayuxqlwehsxknfsx8gja4: {
    sk: '5f6a96f534cb7b0a4a7d5a51f8b16721406c23533c589ea84230a091306f74d8',
    pk: 'a32eae39ef2dbf4e22be0c81755a1de1522b297bbf45045a60e4d6f3acf3b3c0283279f332b515b43b2202a82a2af465',
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
  address: 'ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna',
};

const stock1FeeAddress: TAddress = {
  cur: cur1,
  address: 'xch1hzu98qg77h0ydwldlnduu8kmay0upjd9sa3n5mq0zjslqgu4prsqpjujam',
};

const stock2FeeAddress: TAddress = {
  cur: cur2,
  address: 'ach1vhwlgpz5dz7mav408q306zmxlcj7x6psu8ad4ayuxqlwehsxknfsx8gja4',
};

export const testEnviroment: TestEnv = {
  stockConfigRecord,
  keyStorage,
  mainAddress1,
  mainAddress2,
  stock1FeeAddress,
  stock2FeeAddress,
};
