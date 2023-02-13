import makeTransaction from '@/services/make-transaction';
import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import stockConfigModel from '@ctocker/lib/build/main/src/models/stock-config.model';
import FullNodeAdapter from '@ctocker/lib/build/main/src/services/blockchain/fullnode/fullnode-adapter';
import { clearBrokerDb, waitForTransaction } from '@ctocker/lib/build/main/src/tests/helpers';
import { KeyStorage } from '@ctocker/lib/build/main/src/types/blockchain';
import { currency, StockConfigRecord } from '@ctocker/lib/build/main/src/types/stock';
import knex from '@ctocker/lib/build/main/src/utils/knex';
import Debug from 'debug';
import { sha256 } from 'js-sha256';
import _partition from 'lodash/partition';

const debug = Debug('ctocker:test');

export interface TestEnv {
  stockConfigRecord: StockConfigRecord;
  keyStorage: KeyStorage;
  mainAddress1: TAddress;
  mainAddress2: TAddress;
  stock1FeeAddress: TAddress;
  stock2FeeAddress: TAddress;
}

export interface TCase {
  title: string;
  skip?: boolean;
  only?: boolean;
  in: AmountState;
  out: AmountState;
  enviroment: TestEnv;
  loopExitCondition?: (data: { orders: any[]; deals: any[]; outcomes: any[]; coinCacheRows: any[] }) => boolean;
}

export interface TestFlowStorage {
  inTxs?: string[];
}

export interface TAddress {
  cur: currency;
  address: string;
  transactionFee?: string;
}

export interface TClient {
  addressFrom: TAddress;
  addressTo: TAddress;
  amountFrom: string;
  amountTo: string;
  stockAddress: string;
  orderAmount: string;
}

export interface TClientExpectation {
  outcome: string;
  balance1: string;
  balance2: string;
  client: TClient;
}

export interface AmountState {
  aggregatedCur1Amount: string;
  aggregatedCur2Amount: string;

  mainAddress1Amount: string;
  mainAddress2Amount: string;

  feeStorage1Amount: string;
  feeStorage2Amount: string;

  aggregatedStock1Amount: string;
  aggregatedStock2Amount: string;

  stock1Amounts: { [address: string]: string };
  stock2Amounts: { [address: string]: string };

  clients: TClient[];
}

export async function sendCoinsToMainAddress(mainAddress: TAddress, amount: string, customFullnode: FullNodeAdapter = null): Promise<void> {
  const cur = mainAddress.cur;

  const fullnode = customFullnode || new FullNodeAdapter(cur);
  const tx = await fullnode.request.walletHttp('send_transaction', {
    wallet_id: 1,
    amount: +amount,
    address: mainAddress.address,
    fee: 0,
  });
  debug('%O', tx);

  await waitForTransaction(mainAddress.cur, tx?.transaction_id, customFullnode);
}

function pickFullnode(cur: currency, fn1: FullNodeAdapter, fn2: FullNodeAdapter): FullNodeAdapter {
  return (fn1.enviroment.currency === cur && fn1) || (fn2.enviroment.currency === cur && fn2) || null;
}

export async function setLastKnownHeight(cur: currency, height: number) {
  await blockchainConfigModel.updateLastKnownHeight(cur, height);
}

async function resetClient(client: TClient, mainAddress: TAddress, keyStorage: KeyStorage) {
  const tx = await makeTransaction({
    tx_cur: mainAddress.cur,
    tx_from: mainAddress.address,
    tx_to: client.addressFrom.address,
    tx_amount: String(client.amountFrom),
    tx_pk: keyStorage[mainAddress.address].pk,
    tx_sk: keyStorage[mainAddress.address].sk,
    tx_bc_fee: mainAddress.transactionFee,
  });
  await waitForTransaction(mainAddress.cur, tx?.payout_tx_id);
}

async function resetClients(clients: TClient[], mainAddress: TAddress, keyStorage: KeyStorage) {
  for (const client of clients) {
    await resetClient(client, mainAddress, keyStorage);
  }
}

export async function getAmountState(testCase: TCase): Promise<AmountState> {
  const {
    enviroment: { stockConfigRecord, mainAddress1: mainAddressCur1, mainAddress2: mainAddressCur2, stock1FeeAddress, stock2FeeAddress },
    in: { clients },
  } = testCase;
  const exchangeConfig = stockConfigRecord.config_json.exchangeConfig;

  const fullnode1 = new FullNodeAdapter(exchangeConfig.cur1);
  const fullnode2 = new FullNodeAdapter(exchangeConfig.cur2);

  const mainAddress1Amount = await fullnode1.instance.getSpendableAmountForAddress(mainAddressCur1.address);
  const mainAddress2Amount = await fullnode2.instance.getSpendableAmountForAddress(mainAddressCur2.address);

  const feeStorage1Amount = await fullnode1.instance.getSpendableAmountForAddress(stock1FeeAddress.address);
  const feeStorage2Amount = await fullnode2.instance.getSpendableAmountForAddress(stock2FeeAddress.address);

  const clientsState: TClient[] = await Promise.all(
    clients.map(async client => ({
      ...client,
      amountFrom: await pickFullnode(client.addressFrom.cur, fullnode1, fullnode2).instance.getSpendableAmountForAddress(client.addressFrom.address),
      amountTo: await pickFullnode(client.addressTo.cur, fullnode1, fullnode2).instance.getSpendableAmountForAddress(client.addressTo.address),
    })),
  );

  const stock1Amounts: { [address: string]: string } = {};
  for (const address of Object.keys(exchangeConfig[exchangeConfig.cur1].addresses)) {
    stock1Amounts[address] = await fullnode1.instance.getSpendableAmountForAddress(address);
  }

  const stock2Amounts: { [address: string]: string } = {};
  for (const address of Object.keys(exchangeConfig[exchangeConfig.cur2].addresses)) {
    stock2Amounts[address] = await fullnode2.instance.getSpendableAmountForAddress(address);
  }

  const stock1Amount = Object.values(stock1Amounts).reduce((sum, v) => sum + +v, 0);
  const stock2Amount = Object.values(stock2Amounts).reduce((sum, v) => sum + +v, 0);

  let aggregatedCur1Amount = +feeStorage1Amount + +mainAddress1Amount + stock1Amount;
  let aggregatedCur2Amount = +feeStorage2Amount + +mainAddress2Amount + stock2Amount;

  clientsState.forEach(client => {
    if (client.addressFrom.cur === exchangeConfig.cur1) aggregatedCur1Amount += +client.amountFrom;
    if (client.addressFrom.cur === exchangeConfig.cur2) aggregatedCur2Amount += +client.amountFrom;

    if (client.addressTo.cur === exchangeConfig.cur1) aggregatedCur1Amount += +client.amountTo;
    if (client.addressTo.cur === exchangeConfig.cur2) aggregatedCur2Amount += +client.amountTo;
  });

  return {
    aggregatedCur1Amount: String(aggregatedCur1Amount),
    aggregatedCur2Amount: String(aggregatedCur2Amount),
    aggregatedStock1Amount: String(stock1Amount),
    aggregatedStock2Amount: String(stock2Amount),
    mainAddress1Amount,
    mainAddress2Amount,
    stock1Amounts,
    stock2Amounts,
    feeStorage1Amount,
    feeStorage2Amount,
    clients: clientsState,
  };
}

export function compareAmountState(state1: AmountState, state2: AmountState) {
  return sha256(JSON.stringify(state1)) === sha256(JSON.stringify(state2));
}

export async function resetAmountState(testCase: TCase) {
  const expectedState = testCase.in;
  const actualState = await getAmountState(testCase);
  const {
    enviroment: { mainAddress1, mainAddress2, stock1FeeAddress, stock2FeeAddress, keyStorage },
    in: { clients },
  } = testCase;

  if (compareAmountState(actualState, expectedState)) return;

  const [clients1, clients2] = _partition(clients, client => client.addressFrom.cur === mainAddress1.cur);

  await Promise.all([
    sendCoinsToMainAddress(mainAddress1, testCase.in.aggregatedCur1Amount),
    sendCoinsToMainAddress(mainAddress2, testCase.in.aggregatedCur2Amount),
  ]);

  await Promise.all([
    resetClients(clients1, mainAddress1, keyStorage),
    (async () => {
      const tx = await makeTransaction({
        tx_cur: mainAddress2.cur,
        tx_from: mainAddress2.address,
        tx_to: stock2FeeAddress.address,
        tx_amount: expectedState.feeStorage2Amount,
        tx_pk: keyStorage[mainAddress2.address].pk,
        tx_sk: keyStorage[mainAddress2.address].sk,
      });
      await waitForTransaction(mainAddress2.cur, tx?.payout_tx_id);
    })(),
  ]);

  await Promise.all([
    resetClients(clients2, mainAddress2, keyStorage),
    (async () => {
      const tx = await makeTransaction({
        tx_cur: mainAddress1.cur,
        tx_from: mainAddress1.address,
        tx_to: stock1FeeAddress.address,
        tx_amount: expectedState.feeStorage1Amount,
        tx_pk: keyStorage[mainAddress1.address].pk,
        tx_sk: keyStorage[mainAddress1.address].sk,
      });
      await waitForTransaction(mainAddress1.cur, tx?.payout_tx_id);
    })(),
  ]);
}

export async function resetStockConfig(testCase: TCase) {
  await clearBrokerDb();
  await knex(stockConfigModel.tableName).delete();
  const stockConfigRecord = testCase.enviroment.stockConfigRecord;
  const row = await knex(stockConfigModel.tableName).insert(stockConfigRecord).returning('id');
  const stockId = row?.[0];
  return stockId;
}
