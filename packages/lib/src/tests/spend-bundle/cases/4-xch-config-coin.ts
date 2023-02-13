import { Coin, KeyStorage, TransactionRecord } from '@/types/blockchain';

const keyStorage: KeyStorage = {
  xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp: {
    sk: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    pk: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
  },
};

const coins: Coin[] = [
  {
    amount: '1500000100000',
    parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
    puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
  },
  {
    amount: '1500010000000',
    parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
    puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
  },
];

const amount = '2000000000000';
const phTo = '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3';
const phFrom = '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f';
const fee = '0';

const transactionRecord: TransactionRecord = {
  additions: [
    {
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
      amount: '1',
    },
    {
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
      amount: '3000010099999',
    },
  ],
  amount: '1',
  confirmed: false,
  confirmed_at_height: 0,
  created_at_time: 1637279955,
  fee_amount: '0',
  name: '0x324c89626ca16d74c15da005cc01957bc4e7a144b974760cf3bb901f26c3ffc5',
  removals: [
    {
      amount: '1500000100000',
      parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
    {
      amount: '1500010000000',
      parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
  ],
  sent: 0,
  sent_to: [],
  spend_bundle: {
    aggregated_signature:
      '0xb011aba9dd642c53b52d3be02024c166e7fdc28ff6fc4d33af0f8149a585935974ee287c867865f5d6be01ba7ba2c181109957e1cd38bad95847dea0ef25a692515f6237b4ff9cc92f50fff714719e921fec7a2800d172ff6b3da2d9f6c08c76',
    coin_spends: [
      {
        coin: {
          amount: '1500000100000',
          parent_coin_info: '0x1a90e8ad4b46c6eda78edc0112f80f009482ac08e44866149da3f4960c66c6d8',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution:
          '0xff80ffff01ffff33ffa0e8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3ff0180ffff33ffa0482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6fff8602ba7e894d1f80ffff3cffa0bb4a57bbe49ad3c11fcebd07a2eef753c48979428e962012ad2a1ce860d95b9a8080ff8080',
      },
      {
        coin: {
          amount: '1500010000000',
          parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution:
          '0xff80ffff01ffff3dffa07420f52f4e1394fe3dfef8a9b246a30b53990536c21c446c833246d638e5e4ff8080ff80ffffab7b2275726c223a22687474703a2f2f6c6f63616c686f73743a383030302f746573742d636f6e666967227d8080',
      },
    ],
  },
  to_puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
  trade_id: undefined,
  type: 1,
  wallet_id: 1,
  change_tx_id: 'c1e2c58e09a943503c4b875c730ea674774c86a6c95bb3470e5250be1dbce4c3',
  payout_tx_id: 'd1f1842a6f97b29b9ccab0572e422c7e4b034970b9ab1c12290d3958580d6687',
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
