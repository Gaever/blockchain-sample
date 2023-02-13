import { eventsDict, ListenStockReq, StockChartData, TimeBucket } from "@ctocker/lib/build/main/src/types/stock";
import { useEffect, useState } from "react";
import io from "./io";

export default function useChartSubscription({
  stockId,
  timeBucket,
  flip,
  onStartLoading,
  onStopLoading,
}: {
  stockId: string;
  timeBucket: TimeBucket;
  flip?: boolean;
  onStartLoading: () => void;
  onStopLoading: () => void;
}): StockChartData {
  const [connectionId, setConnectionId] = useState(0);
  const [prevConnectionId, setPrevConnectionId] = useState(connectionId);

  const [chartData, setChartData] = useState<StockChartData>({
    candles: [],
    volume: [],
    marketDepth: [],
    lastDealRate: "1",
    pricePrecision: 10,
  });

  useEffect(() => {
    io.on("connect", () => {
      setConnectionId((prev) => prev + 1);
    });
  }, []);

  const emit = () => {
    io.emit(eventsDict["subscribe-stock"], {
      stockId,
      timeBucket,
      timezoneOffset: new Date().getTimezoneOffset(),
      flip,
    } as ListenStockReq);
  };

  useEffect(() => {
    if (connectionId !== prevConnectionId && stockId && timeBucket) {
      setPrevConnectionId(connectionId);
      emit();
    }
  }, [stockId, timeBucket, flip, connectionId, prevConnectionId]);

  useEffect(() => {
    emit();
  }, [stockId, timeBucket, flip]);

  useEffect(() => {
    if (stockId && timeBucket) {
      onStartLoading();
      io.on(eventsDict["app-data"], (data: StockChartData) => {
        setChartData(data);
        onStopLoading();
      });
    }

    return () => {
      io.off(eventsDict["app-data"]);
    };
  }, [stockId, timeBucket, flip]);

  return chartData;
}
