import fullnodeEnviroment from '@/services/blockchain/fullnode-enviroment';
import TransactionManager from '@/services/blockchain/fullnode/puzzle/transacton-manager';
import { Coin } from '@/types/blockchain';
import debug from 'debug';
// @ts-ignore
import keyStorage from '../../broker/config/key_storage.json';
// 2021-12-19T18:41:00.085Z ctocker:broker sendPayout4.1 '4' '0xe3a5e8aa63d6e2a4af9894628d075749e06c27629a3f6802c1ec03c97519d18f' '0x6c055b2e42186d061b03bd90f7980af77abd363186bf84c0264fc7335aab8916' [
//   {
//     amount: 5,
//     parent_coin_info: '0xa640a40a4e66fe61f727397f25f86551c266e05f4c1dc2a216ec34e1b0e93619',
//     puzzle_hash: '0xe3a5e8aa63d6e2a4af9894628d075749e06c27629a3f6802c1ec03c97519d18f'
//   }
// ] '0' {
//   currency: 'xch',
//   AGG_SIG_ME_ADDITIONAL_DATA: 'ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb',
//   GROUP_ORDER: '73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
//   MAX_BLOCK_COST_CLVM: 11000000000,
//   MOJO_ORDER: 1000000000000,
//   FULLNODE_URI: 'https://localhost:18555',
//   SSL_CERT_PATH: 'certs/XCH_SSL_CERT.crt',
//   SSL_KEY_PATH: 'certs/XCH_SSL_CERT.key',
//   STOCK_CONFIG_ADDRESS: undefined,
//   KEY_STORAGE_PATH: 'config/key_storage.json'
// }

const coins: Coin[] = [
  {
    // @ts-ignore
    amount: '5',
    parent_coin_info: '0x009a56eac8a7f1192dab2d635872b357d465f758822ed6064ffa2fb193b72d8a',
    puzzle_hash: '0xc2b06d40a638ca25168510c31f2df3c369658b45ee72575025307f0d9e48cb7e',
  },
];

async function main() {
  const m = new TransactionManager();
  await m.init(fullnodeEnviroment['xch'], keyStorage);
  const tx = await m.createTransaction(
    '4',
    '0xc2b06d40a638ca25168510c31f2df3c369658b45ee72575025307f0d9e48cb7e',
    '0x02dea9a5af6df941cc0395e8c4469e0e3a411150cc25c8a0761a7ed7c5be5e39',
    coins,
    '0'
  );
  debug('test')(tx);
}

main();
