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
      amount: '2000000000000',
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
    },
    {
      amount: '1000010100000',
      parent_coin_info: '0x50a14d7325afed427c1e4b21d300828cc443dbbea716184480fb7dfaf8be6e36',
      puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
    },
  ],
  amount: '2000000000000',
  confirmed: false,
  confirmed_at_height: 0,
  created_at_time: 1637279955,
  fee_amount: '0',
  name: '0xc708035e2b777bf06e6229e86ae75c7ec56e94c1698c0ad215db7cb8e8c607e9',
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
      '0xad94cc602018cb404ed53045734812414af4f0d0f79db7071dbb29707858500ac45d0fb19431bfb255f31606949a1a4c1804e35056f566a45aa0b0ba35bd6d00ae5cc2fe45fc25708706ed08f3390f66c72453cd4d54bea248785f78ae52b121',
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
          '0xff80ffff01ffff33ffa0e8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3ff8601d1a94a200080ffff33ffa0482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6fff8600e8d53f2d2080ffff3cffa06edc223bac20dccd5efd19289c294a10f16abff231971fc3ea1e0c475ccd9fff8080ff8080',
      },
      {
        coin: {
          amount: '1500010000000',
          parent_coin_info: '0xda28141d180aae731630008c8f07577b6ed539e7e36e2a648db84bcf18204b65',
          puzzle_hash: '0x482b16e9e14035c42a919dbccf4c268b5587f6633886671af3ac42eee1702d6f',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0b76dd4469c2ff141d74e7cc267bbb458048d8b26a2594b052920d8b2a98867bac884902cf90a047c0ed2b7734183d58aff018080',
        solution: '0xff80ffff01ffff3dffa0eef45dc86bb593d54409a4c7ea5349061fee54492f3bde409d5d88a2a83292258080ff8080',
      },
    ],
  },
  to_puzzle_hash: '0xe8f269f858e43dd3020aa11a20912d05402a48390742bd5a721029a4b42bf1a3',
  trade_id: undefined,
  type: 1,
  wallet_id: 1,
  change_tx_id: '0bb7ad85b6cfbb5ec14c1ded51c00e21903cd0df0c8e0ec27aa1c6c3047e5bc5',
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
