import { Coin, KeyStorage, TransactionRecord } from '@/types/blockchain';

const keyStorage: KeyStorage = {
  xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
    sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
  },
};

const coins: Coin[] = [
  {
    amount: '77',
    parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
    puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
  },
  {
    amount: '127',
    parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
    puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
  },
];

const amount = '200';
const phTo = '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3';
const phFrom = '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f';
const fee = '0';

const transactionRecord: TransactionRecord = {
  additions: [
    {
      amount: '200',
      parent_coin_info: '0x0ece09452cdc886ace72410ffde60520035da1ee9f04be1542f592231ec0d3c6',
      puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
    },
    {
      amount: '4',
      parent_coin_info: '0x0ece09452cdc886ace72410ffde60520035da1ee9f04be1542f592231ec0d3c6',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
  ],
  amount: '200',
  confirmed: false,
  confirmed_at_height: 0,
  created_at_time: null,
  fee_amount: '0',
  name: '0x771ee997627f37a275654da57767e791310c4ce98655a934d4cdcb11641dc576',
  removals: [
    {
      amount: '77',
      parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
    {
      amount: '127',
      parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
  ],
  sent: 0,
  sent_to: [],
  spend_bundle: {
    aggregated_signature:
      '0x8b00f9ce0be8dcafca7176a9261738cea527ab22ccdd7cbbb28e8b8e3d8cc74b06e474251ce61f2e776ac3e8569ec81c08858abcac39b0048942ed71603a6b8e1b0846a493ead6c89705f5177b50e793a4d81be5c2c52c2db18c28308789d4ba',
    coin_spends: [
      {
        coin: {
          amount: '77',
          parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution:
          '0xff80ffff01ffff33ffa0e8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3ff8200c880ffff33ffa0482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6fff0480ffff3cffa0d84e76724ebefbeac0072119502c30184d41cf23ac6de31631db768f55b7069d8080ff8080',
      },
      {
        coin: {
          amount: '127',
          parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution: '0xff80ffff01ffff3dffa0421deff7016ce6da755da4fe667cd26eb37aa9919c8673f97aaef363ba28f8888080ff8080',
      },
    ],
  },
  to_puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
  trade_id: undefined,
  type: 1,
  wallet_id: 1,
  payout_tx_id: 'dd4ef9918423bea1f4247714cc84cf1477552fb696a21246106d5aaeba835f49',
  change_tx_id: 'ddbc5236bce701a1ed77ab73cad169a1ed6ea888dc6da1a69f54bc75159d65d9',
};

export default {
  _in: {
    keyStorage,
    coins,
    phFrom,
    phTo,
    fee,
    amount,
  },
  _out: transactionRecord,
};
