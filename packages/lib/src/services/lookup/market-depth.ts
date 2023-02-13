import { Order } from '@/types/stock';

class MarketDepth {
  public sell: Order[] = [];
  public buy: Order[] = [];
}

export default MarketDepth;
