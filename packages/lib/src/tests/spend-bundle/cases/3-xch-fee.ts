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
const fee = '100';

const transactionRecord: TransactionRecord = {
  additions: [
    {
      amount: '2000000000000',
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
    },
    {
      amount: '1000010099900',
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
  ],
  amount: '2000000000000',
  confirmed: false,
  confirmed_at_height: 0,
  created_at_time: 1637280479,
  fee_amount: '100',
  name: '0x0b1243443e9425ef06146785d776df20af7779a8c851a00e8d1054948841a360',
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
      '0xa8d44686d9a5cdf1c23a617bb9b8162d6805cb9a9d0d55db37840ec1e8910cbce32a966ac6a9dde557553ee6ea3420dd023b87ee0447d3ef1a195e74a0cb5041735b5aaa3f7e47e49437c219aebb2cf02ca2a27a60600af4927613efd802e7ca',
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
          '0xff80ffff01ffff33ffa0e8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3ff8601d1a94a200080ffff33ffa0482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6fff8600e8d53f2cbc80ffff34ff6480ffff3cffa0593f47d897aa638a9c3ab672c4d02e241619f2740c54b2420cc19d91fd0cfed88080ff8080',
      },
      {
        coin: {
          amount: '1500010000000',
          parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution: '0xff80ffff01ffff3dffa0ce4251a5ca743e21d3de08fb1c05c04fc6e7698f3a7db8aa71a497057ab670aa8080ff8080',
      },
    ],
  },
  to_puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
  trade_id: undefined,
  type: 1,
  wallet_id: 1,
  change_tx_id: 'c302490da043f2c48883f7b2c458613857b9423014317a112c0c3954efb0668a',
  payout_tx_id: '214cb4269c06306a3bd8ef1b9084e12817bb4a1619c88f7c900113b1b8d793c8',
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
