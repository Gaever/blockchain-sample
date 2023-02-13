import { SpendBundlePlain, SpendBundlePlainAch } from '@/types/blockchain';
import _omit from 'lodash/omit';
import FullNodeChiaLike from './fullnode-chia-like';

class FullNodeAch extends FullNodeChiaLike {
  remapSpendBundle(spendBundle: SpendBundlePlain): any {
    const mappedSpendBundle: SpendBundlePlainAch = {
      ..._omit(spendBundle, 'coin_spends'),
      coin_solutions: spendBundle.coin_spends,
    };
    return mappedSpendBundle;
  }
}

export default FullNodeAch;
