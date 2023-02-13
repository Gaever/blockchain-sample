import { FullnodeEnv } from '@/types/blockchain';
import { currency, CurrencyMap } from '@/types/stock';

const activeCur = process.env.CUR as currency;

type FullnodeCommon = Pick<FullnodeEnv, 'FULLNODE_URI' | 'SSL_CERT_PATH' | 'SSL_KEY_PATH' | 'STOCK_CONFIG_ADDRESS' | 'KEY_STORAGE_PATH'>;

const commonKeys: FullnodeCommon = {
  FULLNODE_URI: process.env.FULLNODE_URI,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  STOCK_CONFIG_ADDRESS: process.env.STOCK_CONFIG_ADDRESS,
  KEY_STORAGE_PATH: process.env.KEY_STORAGE_PATH,
};

const commonKeyDummy: FullnodeCommon = {
  FULLNODE_URI: '',
  SSL_CERT_PATH: '',
  SSL_KEY_PATH: '',
  STOCK_CONFIG_ADDRESS: '',
  KEY_STORAGE_PATH: '',
};

const fullnodeEnviroment: CurrencyMap<FullnodeEnv> = {
  xch: {
    currency: 'xch',
    AGG_SIG_ME_ADDITIONAL_DATA: 'ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb',
    GROUP_ORDER: '73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
    MAX_BLOCK_COST_CLVM: 11000000000,
    MOJO_IN_COIN: 1e12,
    TEST_ADDRESS_TO: 'xch1menckx5a77k2e4ekw9c4jh52ery9c0a8qzffrden4cyfuw4za49q5v4qq8',
    TEST_ADDRESS_TO_SK: '0ac4aed8c24abaca4a0eb9575ed078d529b1c1a6adfc1b5e67f2929f51d476ec',
    TEST_ADDRESS_TO_PK: 'b20a470699623f880786e09bfe240f909574ad8a8d1877d23ce83b4d7593690048266071bd379d5bcfa6b9e7fd34ba58',
    TEST_ADDRESS_FROM: 'xch1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hsffhssp',
    TEST_ADDRESS_FROM_SK: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    TEST_ADDRESS_FROM_PK: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
    GENESIS_CHALLENGE: '0xccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb',
    ...(activeCur === 'xch' ? commonKeys : commonKeyDummy),
  },
  ach: {
    currency: 'ach',
    AGG_SIG_ME_ADDITIONAL_DATA: '7b9d58aae34f8ee1c8dc2fe5218660fb159dc64d7ecb4467c5d07d4ba2d6e04e',
    GROUP_ORDER: '73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
    MAX_BLOCK_COST_CLVM: 11000000000,
    MOJO_IN_COIN: 1e9,
    TEST_ADDRESS_TO: 'ach1rqzu34weezuzadawpmn4n8x4h8939f77j33g9dd04f4ps0u0djjsxyg60h',
    TEST_ADDRESS_TO_SK: '50b0ed5c13a3998d218694cc983c93630f8be7520fc4772c769a8c0752c9b837',
    TEST_ADDRESS_TO_PK: '8614be4eaa4d9a09c5ecaa7511e570d706c34bcd1f3efe2eb3e66815bab6a1e128e14f47d5ede6ee9f0da194c72102c8',
    TEST_ADDRESS_FROM: 'ach1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hss7xfna',
    TEST_ADDRESS_FROM_SK: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    TEST_ADDRESS_FROM_PK: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
    GENESIS_CHALLENGE: '40e3e98c35399af7c9c42dea45f14281ce14ac80a80748f246e72a505bc8a041',
    ...(activeCur === 'ach' ? commonKeys : commonKeyDummy),
  },
  hdd: {
    currency: 'hdd',
    AGG_SIG_ME_ADDITIONAL_DATA: '49f4afb189342858dba5c1bb6b50b0deaa706088474f0c5431d65b857d54ddb5',
    GROUP_ORDER: '73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001',
    MAX_BLOCK_COST_CLVM: 11000000000,
    MOJO_IN_COIN: 1e12,
    TEST_ADDRESS_TO: 'hdd1rqzu34weezuzadawpmn4n8x4h8939f77j33g9dd04f4ps0u0djjsphpmt9',
    TEST_ADDRESS_TO_SK: '50b0ed5c13a3998d218694cc983c93630f8be7520fc4772c769a8c0752c9b837',
    TEST_ADDRESS_TO_PK: '8614be4eaa4d9a09c5ecaa7511e570d706c34bcd1f3efe2eb3e66815bab6a1e128e14f47d5ede6ee9f0da194c72102c8',
    TEST_ADDRESS_FROM: 'hdd1fq43d60pgq6ug253nk7v7npx3d2c0anr8zrxwxhn43pwacts94hshd0gh0',
    TEST_ADDRESS_FROM_SK: '0fb33728fd2b545130b525cc6886f3cacd3dc122676ab12f9e013c5b5a1d9948',
    TEST_ADDRESS_FROM_PK: '9837f5e0f56ef3f49a48fcb3da20634f7ace17dd7b8b07f81116dc5a414d6fd08c9392e5a7c3b64f5a5634a14a38308a',
    GENESIS_CHALLENGE: 'f663a54192e4fc8832d62c5f914d1c3a15dd2a519c3ca23609a508f4641da23e',
    ...(activeCur === 'hdd' ? commonKeys : commonKeyDummy),
  },
};

export default fullnodeEnviroment;
