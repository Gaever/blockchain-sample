import FullNodeAdapter from '@/services/blockchain/fullnode/fullnode-adapter';
import { currency } from '@/types/stock';

export async function validateNetwork() {
  const fullnode = new FullNodeAdapter(process.env.CUR as currency);
  const networkInfoRes = await fullnode.instance.getNetworkInfo();

  if (process.env.CUR !== networkInfoRes.network_prefix) {
    throw new Error(`Env cur mismatch. ENV[CUR]=${process.env.CUR}; get_network_info.network_prefix=${networkInfoRes.network_prefix}`);
  }
}
