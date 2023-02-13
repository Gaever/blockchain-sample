import { useTheme } from "@mui/material/styles";
import { BarData, createChart, HistogramData, IChartApi, ISeriesApi } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { Layout } from "../types";

export interface CandlesChartProps {
  candlesData: BarData[];
  volumeData: HistogramData[];
  layout: Layout;
  pricePrecision: number;
  volumePrecision: number;
}

function precisionToMinMove(precision?: number): number {
  if (!precision) return 0.01;
  let zeros = "";
  for (let i = 0; i < precision - 1; i++) {
    zeros += "0";
  }
  return Number(`0.${zeros}1`);
}

export default function CandlesChart(props: CandlesChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const histogramRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current || "", {
      layout: {
        background: { color: theme.palette.background.default },
        textColor: theme.palette.text.secondary,
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
        secondsVisible: false,
      },
      grid: {
        horzLines: {
          color: theme.palette.divider,
        },
        vertLines: {
          color: theme.palette.divider,
        },
      },
    });
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries?.({
      priceFormat: {
        precision: props.pricePrecision,
        minMove: precisionToMinMove(props.pricePrecision),
        type: "price",
      },
      upColor: "rgba(88, 189, 125, 1)",
      downColor: "rgba(255, 102, 56, 1)",
    });
    histogramRef.current = chartRef.current.addHistogramSeries?.({
      priceScaleId: "",
      priceFormat: { type: "volume", precision: 10 },
    });
    histogramRef.current?.priceScale?.()?.applyOptions?.({ scaleMargins: { top: 0.8, bottom: 0 } });
  }, []);

  useEffect(() => {
    candlestickSeriesRef.current?.setData?.(props?.candlesData);
  }, [props.candlesData]);

  useEffect(() => {
    histogramRef.current?.setData?.(props.volumeData);
  }, [props.volumeData]);

  useEffect(() => {
    chartRef.current?.applyOptions?.(props.layout);
  }, [props.layout]);

  useEffect(() => {
    candlestickSeriesRef.current?.applyOptions?.({
      priceFormat: {
        precision: props.pricePrecision,
        minMove: precisionToMinMove(props.pricePrecision),
      },
    });
  }, [props.pricePrecision]);

  useEffect(() => {
    histogramRef.current?.applyOptions?.({
      priceFormat: { precision: 10 },
    });
  }, [props.volumePrecision]);

  useEffect(() => {
    chartRef.current?.applyOptions?.({
      layout: {
        background: { color: theme.palette.background.default },
        textColor: theme.palette.text.secondary,
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
      },
      timeScale: {
        borderColor: theme.palette.divider,
      },
      grid: {
        horzLines: {
          color: theme.palette.divider,
        },
        vertLines: {
          color: theme.palette.divider,
        },
      },
    });
  }, [theme.palette.mode]);

  return <div ref={chartContainerRef}></div>;
}
