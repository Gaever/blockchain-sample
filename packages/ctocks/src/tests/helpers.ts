import blockchainConfigModel from '@ctocker/lib/build/main/src/models/blockchain-config.model';
import FullNodeAdapter from '@ctocker/lib/build/main/src/services/blockchain/fullnode/fullnode-adapter';
import { waitForTransaction } from '@ctocker/lib/build/main/src/tests/helpers';
import { currency } from '@ctocker/lib/build/main/src/types/stock';

export async function getAddressAmount(address: string, cur: currency = 'xch') {
  const fullnode = new FullNodeAdapter(cur);
  return fullnode.instance.getSpendableAmountForAddress(address);
}

export async function sendAmountToAddress(amount: string, address: string, cur: currency = 'xch'): Promise<void> {
  const fullnode = new FullNodeAdapter(cur);
  const tx = await fullnode.request.walletHttp('send_transaction', {
    wallet_id: 1,
    amount: +amount,
    address: address,
    fee: 0,
  });

  await waitForTransaction(cur, tx?.transaction_id);
}

export async function setLastKnownHeight(height: number, cur: currency = 'xch') {
  await blockchainConfigModel.updateLastKnownHeight(cur, height);
}
