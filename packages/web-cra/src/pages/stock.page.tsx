import { http } from "@/api";
import ChartLayout from "@/components/layout/chart-layout";
import useChartSubscription from "@/hooks/use-chart-subscription";
import usePersist from "@/hooks/use-persist";
import { StockListItem, TimeBucket, timeBuckets } from "@ctocker/lib/build/main/src/types/stock";
import { AxiosResponse } from "axios";
import BigNumber from "bignumber.js";
import nprogress from "nprogress";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

function flipActiveStock(activeStock: StockListItem): StockListItem {
  return {
    ...activeStock,
    cur1: activeStock.cur2,
    cur2: activeStock.cur1,
    mojosInCur1Coin: activeStock.mojosInCur2Coin,
    mojosInCur2Coin: activeStock.mojosInCur1Coin,
  };
}

function StockPage() {
  const params = useParams();

  const persisted = usePersist(String(params?.id || ""));

  const persistedFlipped = persisted?.stockState?.flipped || false;
  const [flipState, setFlipState] = useState({
    isFlipped: persistedFlipped,
    prevIsFlipped: persistedFlipped,
  });
  const prevIsFlipped = flipState.prevIsFlipped;
  const isFlipped = flipState.isFlipped;

  const stockListQuery = useQuery<AxiosResponse<StockListItem[]>>(["stock-list"], async () => http({ method: "get", url: "stock/list" }));
  const stocks = stockListQuery.data?.data;
  let activeStock = stocks?.find?.((item) => item.id === +(params?.id || 0));
  if (prevIsFlipped && activeStock !== undefined) activeStock = flipActiveStock(activeStock);

  const [selectedInterval, setSelectedInterval] = useState<TimeBucket>(() => persisted?.stockState?.timeBucket || "1h");
  const [groupStep, setGroupStep] = useState(persisted.stockState?.groupStep || 0);

  const onStopLoading = useCallback(() => {
    setFlipState((prev) => ({
      ...prev,
      prevIsFlipped: prev.isFlipped,
    }));
  }, [isFlipped]);

  const chartData = useChartSubscription({
    stockId: activeStock?.id ? `${activeStock?.id}` : "",
    timeBucket: selectedInterval,
    flip: isFlipped,
    onStartLoading: () => {},
    onStopLoading,
  });

  const navigate = useNavigate();

  if (stockListQuery.isFetched && !activeStock) {
    navigate("/");
  }

  useEffect(() => {
    nprogress.start();
  }, []);

  useEffect(() => {
    nprogress.done();
  }, [chartData]);

  if (!activeStock || !stocks?.length) return null;

  return (
    <>
      <ChartLayout
        volume={chartData.volume}
        candles={chartData.candles}
        marketDepth={chartData.marketDepth}
        lastDealRate={chartData.lastDealRate}
        pricePrecision={chartData.pricePrecision}
        stocks={stocks || []}
        activeStock={activeStock}
        onChangeStock={(stockId: string) => {
          setFlipState({ prevIsFlipped: false, isFlipped: false });
          persisted.save(stockId, {
            ...persisted?.state?.[stockId],
            timeBucket: selectedInterval,
          });
          navigate(`/stock/${stockId}`);
          nprogress.start();
        }}
        selectedInterval={selectedInterval}
        onChangeIntervalClick={(timeBucket) => {
          setSelectedInterval(timeBucket);
          persisted.save(String(activeStock?.id), {
            ...persisted.stockState,
            timeBucket,
          });
          nprogress.start();
        }}
        intervals={[...timeBuckets]}
        onFlipClick={() => {
          const flipped = !isFlipped;
          setFlipState((prev) => ({ ...prev, isFlipped: flipped }));
          persisted.save(String(activeStock?.id), {
            ...persisted.stockState,
            flipped,
          });
          nprogress.start();
        }}
        isFlipped={prevIsFlipped}
        groupStep={groupStep}
        onGroupStepChange={(v) => {
          setGroupStep(v);
          persisted.save(String(activeStock?.id), {
            ...persisted.stockState,
            groupStep: v,
          });
        }}
      />
      {activeStock ? (
        <Helmet>
          <title>
            {chartData?.lastDealRate
              ? `${new BigNumber(chartData.lastDealRate).sd(10).toFormat()} - ${activeStock.cur1?.toUpperCase?.()}${activeStock.cur2?.toUpperCase?.()} Ctoker`
              : `Ctoker ${activeStock.cur1?.toUpperCase?.()}${activeStock.cur2?.toUpperCase?.()}`}
          </title>
        </Helmet>
      ) : null}
    </>
  );
}

export default StockPage;
