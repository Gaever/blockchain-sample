import { Coin, KeyStorage, TransactionRecord } from '@/types/blockchain';

const keyStorage: KeyStorage = {
  ach1hs74w4rfrm42pv3zdx6ngf87uhyk4uhstfy3xa6959zf08qerraswr2hky: {
    sk: '554506c68944ed2d27f7322191331e1368b64e43e70a7aecff9c41302460c4d6',
    pk: '821a8b64f3c2e6873cb0888043fe1a8684e18d25e4f9270f89e0d4b95a118b3a1367275e1eff64d8c950c14f48c43c15',
  },
};

const coins: Coin[] = [
  {
    amount: '1000000000000',
    parent_coin_info: '0x6f8a4048e1932b321acdf63563165f5b083f32a25aec605aa5e566f22953b606',
    puzzle_hash: '0xbc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fb',
  },
];

const amount = '10';
const phFrom = '0xbc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fb';
const phTo = '0x5091b53a624b17c64e32f56e9e4639ee0e43c11df7b3e451f76286f1d7cd7777';
const fee = '0';

const transactionRecord: TransactionRecord = {
  confirmed_at_height: 0,
  created_at_time: null,
  to_puzzle_hash: '0x5091b53a624b17c64e32f56e9e4639ee0e43c11df7b3e451f76286f1d7cd7777',
  amount: '10',
  fee_amount: '0',
  confirmed: false,
  sent: 0,
  spend_bundle: {
    aggregated_signature:
      '0xaf17d0d1945afc65de39eac2fda4b5ba9ebb5d1812f3182945e696633722a307b1896ee20c0203c3da0d3ad8fd590bce19c3b28d805837cceefdab3b5e2bd85cc8a130bff41c899e43eb4ec7ba5bfbbc4835f863ed9aafd69ff3e1714baa359f',
    coin_spends: [
      {
        coin: {
          amount: '1000000000000',
          parent_coin_info: '0x6f8a4048e1932b321acdf63563165f5b083f32a25aec605aa5e566f22953b606',
          puzzle_hash: '0xbc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fb',
        },
        puzzle_reveal:
          '0xff02ffff01ff02ffff01ff02ffff03ff0bffff01ff02ffff03ffff09ff05ffff1dff0bffff1effff0bff0bffff02ff06ffff04ff02ffff04ff17ff8080808080808080ffff01ff02ff17ff2f80ffff01ff088080ff0180ffff01ff04ffff04ff04ffff04ff05ffff04ffff02ff06ffff04ff02ffff04ff17ff80808080ff80808080ffff02ff17ff2f808080ff0180ffff04ffff01ff32ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff06ffff04ff02ffff04ff09ff80808080ffff02ff06ffff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080ffff04ffff01b0aa17bd7f3781849eb701fcc9e7b7b8a3877d36618a78b85b077c6dad028bd1241866e2741f1cf4a1fd9682afe154519dff018080',
        solution:
          '0xff80ffff01ffff33ffa05091b53a624b17c64e32f56e9e4639ee0e43c11df7b3e451f76286f1d7cd7777ff0a80ffff33ffa0bc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fbff8600e8d4a50ff680ffff3cffa08fb5a9f6adee6727bc40757e1beb9e8b8e1bf16927df5cd332316ce20ab12db78080ff8080',
      },
    ],
  },
  additions: [
    {
      parent_coin_info: '0x244f59b9adfcbe5ce2336d816bac6b7d5f6c99298d084d913c2c1540eafbdc41',
      puzzle_hash: '0x5091b53a624b17c64e32f56e9e4639ee0e43c11df7b3e451f76286f1d7cd7777',
      amount: '10',
    },
    {
      parent_coin_info: '0x244f59b9adfcbe5ce2336d816bac6b7d5f6c99298d084d913c2c1540eafbdc41',
      puzzle_hash: '0xbc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fb',
      amount: '999999999990',
    },
  ],
  removals: [
    {
      amount: '1000000000000',
      parent_coin_info: '0x6f8a4048e1932b321acdf63563165f5b083f32a25aec605aa5e566f22953b606',
      puzzle_hash: '0xbc3d5754691eeaa0b22269b53424fee5c96af2f05a49137745a144979c1918fb',
    },
  ],
  wallet_id: 1,
  sent_to: [],
  trade_id: undefined,
  type: 1,
  name: '0x14c34c369581d304ba36103262d5c97c9fc49bf1ff0ec1d4b96a82ae0200ffc0',
  change_tx_id: '02b1740bcbcbb372984099bb4f03805e7cff845eebc5138e689aceb7c9de5b81',
  payout_tx_id: 'd7c215993f7b97fd60284b4c328df14ed3f8e5e9f1dc5239b5841c90e3924205',
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
