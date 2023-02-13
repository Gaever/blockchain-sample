import { FeeConfig } from '@/types/stock';
import autoBind from 'auto-bind';

class FeeService {
  public feeConfig: FeeConfig;

  constructor(feeConfig) {
    autoBind(this);
    this.feeConfig = feeConfig;
  }
}

export default FeeService;
