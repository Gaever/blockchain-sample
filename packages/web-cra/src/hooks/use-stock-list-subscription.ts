import { eventsDict, StockListItem } from "@ctocker/lib/build/main/src/types/stock";
import { useEffect, useState } from "react";
import io from "./io";

export default function useStockListSubscription(): {
  stockList: StockListItem[];
  isLoading: boolean;
} {
  const [stockList, setStockList] = useState<StockListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    io.emit(eventsDict["subscribe-stock-list"]);
    io.on(eventsDict["stock-list"], (data: StockListItem[]) => {
      setStockList(data);
      setIsLoading(false);
    });
  }, []);

  return { stockList, isLoading };
}
