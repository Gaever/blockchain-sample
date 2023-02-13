import { StockConfig, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';

export const _in: StockConfig = {
  fromHeight: '1',
  name: 'Test Stock',
  exchangeConfig: {
    cur1: 'xch',
    cur2: 'ach',
    xch: {
      orderLifetimeMs: '60000000',
      minInAmountFixed: '0',
      fees: {
        takerFee: {
          percent: '0.02',
          fixed: '0',
        },
        makerFee: {
          percent: '0.01',
          fixed: '0',
        },
        paybackFee: { percent: '0', fixed: '0' },
        transactionFee: '0',
      },
      addresses: {
        xch1rg220ddageql3sz2v26e77q5hkkw6v30c2shptkshqvqe34al5gs4phcay: '1',
        xch1e0va6r55t8yjylls3u3fj0ch7eqvyrzkk4tw5wljts03t8k3lygseue7pp: '1.5',
        xch1a0e290kzqhn3clg2lf8jqleltm7tz3aw6xfztacl06jvv0lfcykqgrcq97: '2',
      },
    },
    ach: {
      orderLifetimeMs: '60000000',
      minInAmountFixed: '0',
      fees: {
        takerFee: {
          percent: '0.02',
          fixed: '0',
        },
        makerFee: {
          percent: '0.01',
          fixed: '0',
        },
        paybackFee: { percent: '0', fixed: '0' },
        transactionFee: '0',
      },
      addresses: {
        ach1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lq0873za: '1',
        ach1ka7720ztyt2mrqjgluxkz7r7wnsqekvm7mg9xmackq3kgvzuf44sl2rlpv: '1.5',
        ach1wulwxj0mehzfahayxmfdgc3emwne0h0pkfge5alf58tg87mgvchqeckvrt: '2',
      },
    },
  },
};

const stockConfigRecord1: StockConfigRecord = {
  id: 1,
  config_tx_id: '1',
  transaction_json: '{"url": "http://localhost:3000/test-config"}',
  cur1: 'xch',
  cur2: 'ach',
  config_json: {
    name: 'Test Stock',
    fromHeight: '1',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: '1',
          xch1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3st93tf5: '1.5',
          xch1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49q5v4qq8: '2',
        },
      },
      ach: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna: '1',
          ach1arexn7zcus7axqs25ydzpyfdq4qz5jpeqapt6knjzq56fdpt7x3sjjqj2g: '1.5',
          ach1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49qdmyerm: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

const stockConfigRecord2: StockConfigRecord = {
  id: 2,
  config_tx_id: '1',
  transaction_json: '{"url": "http://localhost:3000/test-config"}',
  cur1: 'xch',
  cur2: 'ach',
  config_json: {
    fromHeight: '1',
    name: 'Test Stock',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          xch1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9qgr4pna: '1',
          xch1rqzu34weezuzadawpmn4n8x4h8939f77j33g9dd04f4ps0u0djjslnervt: '1.5',
          xch1qpmc02ayyd747p9l4vzqsw7apctmckhwth2alr642hcx0w5c6ykq6dmjy6: '2',
        },
      },
      ach: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          ach1ntywcc73n445269acsdxz55w0ptlpuelehytw3gnqvl6y6t9sp9q35ycsp: '1',
          ach1rqzu34weezuzadawpmn4n8x4h8939f77j33g9dd04f4ps0u0djjsxyg60h: '1.5',
          ach1qpmc02ayyd747p9l4vzqsw7apctmckhwth2alr642hcx0w5c6ykqr62t8x: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

export const noIntersection: [StockConfigRecord[], StockConfigRecord[]] = [[stockConfigRecord1], [stockConfigRecord2]];

const stockConfigRecord3: StockConfigRecord = {
  id: 4,
  config_tx_id: '1',
  transaction_json: '{"url": "http://localhost:3000/test-config"}',
  cur1: 'xch',
  cur2: 'ach',
  config_json: {
    fromHeight: '1',
    name: 'Test Stock',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          xch1vhdn42rq2nlntjuspfepk4jua4uc35tw6numssushtcw30tv83zq8mfpv8: '1',
          xch1lm2nrccxz7elq9vnl8qcsa3mmaa0jaeg0t4m64kdsd536qlnj4gsdj004x: '1.5',
          xch19cc7s4v47dfc0ta62sqhn3exaa4z9gus360efhyputzg3vt5ew2s2wwvs6: '2',
        },
      },
      ach: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          ach1ehxkn4khzpxfwtsc94qmnyzttr0ttzfq7a7v8m75vpzfv0cyzdpsdfh30x: '1',
          ach16q7erm9sa4lka25cjnjusaxrpnayhtksncg9e4nxe9s5z0p04jfsu95s5k: '1.5',
          ach1rg220ddageql3sz2v26e77q5hkkw6v30c2shptkshqvqe34al5gsvkxp7c: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

const stockConfigRecord4: StockConfigRecord = {
  id: 4,
  config_tx_id: '1',
  transaction_json: '{"url": "http://localhost:3000/test-config"}',
  cur1: 'xch',
  cur2: 'ach',
  config_json: {
    fromHeight: '1',
    name: 'Test Stock',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          xch1ehxkn4khzpxfwtsc94qmnyzttr0ttzfq7a7v8m75vpzfv0cyzdps57xgv6: '1',
          xch16q7erm9sa4lka25cjnjusaxrpnayhtksncg9e4nxe9s5z0p04jfs9j9fh2: '1.5',
          xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '2',
        },
      },
      ach: {
        orderLifetimeMs: '60000000',
        minInAmountFixed: '0',
        fees: {
          takerFee: {
            percent: '0.02',
            fixed: '0',
          },
          makerFee: {
            percent: '0.01',
            fixed: '0',
          },
          paybackFee: { percent: '0', fixed: '0' },
          transactionFee: '0',
        },
        addresses: {
          ach1up5l6yu5854tgwus6twyptmptzhcq6knx5mf7pzpvfe7dtu4mecqpafzrk: '1',
          ach1df9c86c8wrhcgcdn0p0pyewul64apnhj4c4jnfrrp2vj85jt7xjq5mu8mt: '1.5',
          ach1s2wpsak4n7hzvw6k3cxq79xzcxlq6wx4lu2ysjwuphedfm0cwk4qpxuvqu: '2',
        },
      },
    },
  },
  status: 'confirmed',
};

export const hasIntersection: [StockConfigRecord[], StockConfigRecord[]] = [[stockConfigRecord3], [stockConfigRecord4]];
