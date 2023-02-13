import { FullnodeEnv } from '@/types/blockchain';
import { currency } from '@/types/stock';
import fullnodeEnviroment from '../fullnode-enviroment';
import FullNodeAbstract from './fullnode-abstract';
import FullNodeAch from './fullnode-ach';
import FullNodeChiaLike from './fullnode-chia-like';
import FullNodeRequest from './fullnode-request';

class FullNodeAdapter {
  public instance: FullNodeAbstract;
  public request: FullNodeRequest;
  public enviroment: FullnodeEnv;

  constructor(currency: currency, enviroment?: FullnodeEnv) {
    this.enviroment = enviroment || fullnodeEnviroment[currency];
    if (!this.enviroment) throw new Error('UNKNOWN_CURRENCY');
    this.request = new FullNodeRequest(this.enviroment);
    switch (currency) {
      case 'ach':
        this.instance = new FullNodeAch(this.request, currency);
        break;
      default:
        this.instance = new FullNodeChiaLike(this.request, currency);
    }
  }
}

export default FullNodeAdapter;
