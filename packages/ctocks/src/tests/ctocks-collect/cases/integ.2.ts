import { rateToAddress } from '@ctocker/lib/build/main/src/tests/helpers';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';

const stockConfigRecord: StockConfigRecord = {
  config_tx_id: '1',
  transaction_json: '{}',
  cur1: 'xch',
  cur2: 'ach',
  config_json: {
    fromHeight: '1',
    name: 'Test Stock',
    exchangeConfig: {
      cur1: 'xch',
      cur2: 'ach',
      xch: {
        orderLifetimeMs: '5000',
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
          xch1ehxkn4khzpxfwtsc94qmnyzttr0ttzfq7a7v8m75vpzfv0cyzdps57xgv6: '1.1',
          xch16q7erm9sa4lka25cjnjusaxrpnayhtksncg9e4nxe9s5z0p04jfs9j9fh2: '1.2',
          xch128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aq0u4p03: '1.3',
          xch1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvsslswffj: '1.4',
          xch1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lqks0gpp: '1.5',
          xch1ka7720ztyt2mrqjgluxkz7r7wnsqekvm7mg9xmackq3kgvzuf44sxajxzs: '1.6',
          xch1wulwxj0mehzfahayxmfdgc3emwne0h0pkfge5alf58tg87mgvchqq084qh: '1.7',
          xch1vhwlgpz5dz7mav408q306zmxlcj7x6psu8ad4ayuxqlwehsxknfslset7f: '1.8',
          xch1eejwuqg6mcf63x23s9n6v97f50s4jshm78e0s3yc7ghtfn6haedqaff30n: '1.9',
          xch1r9ts6d8qx7ryytgaexqmpne0yam0hpj33hs3f9tzpq5l6gumd3xq9latp9: '2',
          xch14u43n05jnq5suw7408y5wpyfmhpw6hazjku2m9tac89qwj4439yqjtwfg0: '2.1',
          xch12e8xdk3j9wlz6hdahalu20tuza9hj7p98xmrp5v3kprqv0qdydjsh5gfav: '2.2',
          xch17kxh2vvjuydzpdvr3paeelywtghuafdrehqyze677nhdga8hshusvnm5ax: '2.3',
          xch1xq7xnnsve9g8ee3cx0lsezrk7dhapwk0gwaq2n2qgeatkncdfpxqkq5mcu: '2.4',
          xch1uwj732nr6m32ftucj33g6p6hf8sxcfmznglksqkpaspujage6x8s3p7w55: '2.5',
        },
      },
      ach: {
        orderLifetimeMs: '5000',
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
          ach128lswtaq5wz85ray5k2f5ys57kup9cr68utgy7vcd302rjdks3aqktycvd: '1.1',
          ach1wvctga8ec9mu5vl0f26jamlmkyv2d57xr9epjj9jgzap6xe2zvssx8ls2w: '1.2',
          ach1pjq9655degestrs56u7quuy2ypvl8euafysz9t9glv46u6etn3lq0873za: '1.3',
          ach1ka7720ztyt2mrqjgluxkz7r7wnsqekvm7mg9xmackq3kgvzuf44sl2rlpv: '1.4',
          ach1wulwxj0mehzfahayxmfdgc3emwne0h0pkfge5alf58tg87mgvchqeckvrt: '1.5',
          ach1vhwlgpz5dz7mav408q306zmxlcj7x6psu8ad4ayuxqlwehsxknfsx8gja4: '1.6',
          ach1eejwuqg6mcf63x23s9n6v97f50s4jshm78e0s3yc7ghtfn6haedqy7cgv0: '1.7',
          ach1r9ts6d8qx7ryytgaexqmpne0yam0hpj33hs3f9tzpq5l6gumd3xqugvjze: '1.8',
          ach14u43n05jnq5suw7408y5wpyfmhpw6hazjku2m9tac89qwj4439yqtulstn: '1.9',
          ach12e8xdk3j9wlz6hdahalu20tuza9hj7p98xmrp5v3kprqv0qdydjswres7s: '2',
          ach17kxh2vvjuydzpdvr3paeelywtghuafdrehqyze677nhdga8hshus4y2d76: '2.1',
          ach1xq7xnnsve9g8ee3cx0lsezrk7dhapwk0gwaq2n2qgeatkncdfpxq0h9zmq: '2.2',
          ach1uwj732nr6m32ftucj33g6p6hf8sxcfmznglksqkpaspujage6x8sgk0hhg: '2.3',
          ach1v0mswyssyy6csrl9sln3fe9csjlkfwevwzap8snymjgjrq4vlgzqhxdjrd: '2.4',
          ach1zgnnq0ecwy920q68cqvwuhljtatuprrevfjgrn4y3ada96fa9m6qwe8hh7: '2.5',
        },
      },
    },
  },
  status: 'confirmed',
};

const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;
const fromAddressCur1 = 'xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp';

const _in = {
  stockConfigRecord,
  fromAddressCur1,
  transactions: [
    {
      cur: exchangeConfig.cur1,
      fromAddress: fromAddressCur1,
      toAddress: rateToAddress(exchangeConfig.cur1, '1.2', exchangeConfig),
      amount: 10,
    },
  ],

  keyStorage: {
    xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
      sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
      pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
    },
  } as KeyStorage,
  necessaryAmountCur1: null,
  necessaryAmountCur2: null,
};

const necessaryAmountCur1 = _in.transactions.filter(item => item.cur === exchangeConfig.cur1).reduce((sum, item) => sum + item.amount, 0);

_in.necessaryAmountCur1 = necessaryAmountCur1;

const _out = {
  income: [{ amount: '10', cur: exchangeConfig.cur1, status: 'proceded' }],
  orders: [{ cur1: exchangeConfig.cur1, cur2: exchangeConfig.cur2, amount: '10', start_amount: '10', status: 'expired' }],
  deals: [],
  curSeries: [],
};

export { _in, _out };
