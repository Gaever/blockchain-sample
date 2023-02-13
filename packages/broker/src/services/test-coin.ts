import Blockchain from '@ctocker/lib/build/main/src/services/blockchain/blockchain';
import fullnodeEnviroment from '@ctocker/lib/build/main/src/services/blockchain/fullnode-enviroment';
import { currency } from '@ctocker/lib/build/main/src/types/stock';
import { addressToPuzzleHash } from '@ctocker/lib/build/main/src/utils';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import makeTransaction from './make-transaction';

function waitForOutTx(bcHeight: number, ph: string) {
  const timeout = 1000 * 60 * 15;
  const start = new Date();

  return new Promise((resolve, reject) => {
    const handler = setInterval(async () => {
      if (new Date().getTime() - start.getTime() >= timeout) {
        clearInterval(handler);
        reject('out tx not found in reasonable time');
      }

      try {
        const rows = await knex('outcome')
          .select('tx_id')
          .where('height', '>', bcHeight)
          .andWhere({ client_puzzle_hash: ph, status: 'done', cur: process.env.CUR });
        if (rows.length > 0) {
          clearInterval(handler);
          resolve(true);
        }
      } catch {}
    }, 5000);
  });
}

export async function testCoin() {
  const bc = new Blockchain(process.env.CUR as currency, []);
  await makeTransaction({
    tx_cur: process.env.CUR,
    tx_from: fullnodeEnviroment[process.env.CUR as currency].TEST_ADDRESS_FROM,
    tx_to: fullnodeEnviroment[process.env.CUR as currency].TEST_ADDRESS_TO,
    tx_pk: fullnodeEnviroment[process.env.CUR as currency].TEST_ADDRESS_FROM_PK,
    tx_sk: fullnodeEnviroment[process.env.CUR as currency].TEST_ADDRESS_FROM_SK,
    tx_amount: '10',
  });
  const bcHeight = (await bc.fullnode.instance.getBlockchainState())?.blockchain_state?.peak?.height;
  const ph = addressToPuzzleHash(fullnodeEnviroment[process.env.CUR as currency].TEST_ADDRESS_FROM);
  console.log('wait for out tx... It will take 3-5 minutes.');
  await waitForOutTx(bcHeight, ph);

  console.log(`Done! Test coin successfully paid back.`);
}
