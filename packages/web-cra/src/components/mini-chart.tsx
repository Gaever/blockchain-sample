import { useTheme } from "@mui/material/styles";
import { createChart, IChartApi, ISeriesApi, LineData } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { Layout } from "../types";

export interface MiniChartProps {
  data: LineData[];
  layout: Layout;
}

export default function MiniChart(props: MiniChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current || "", {
      layout: {
        background: { color: theme.palette.background.paper },
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      overlayPriceScales: {},
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: false,
          labelVisible: false,
        },
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
      },
    });
    lineSeriesRef.current = chartRef.current.addAreaSeries({
      priceLineVisible: false,
    });
  }, []);

  useEffect(() => {
    lineSeriesRef.current?.setData?.(props.data);
    chartRef.current?.timeScale?.()?.fitContent?.();

    const prev = props.data?.[(props.data?.length || 0) - 2];
    const last = props.data?.[(props.data?.length || 0) - 1];

    const isUp = last?.value >= prev?.value;

    if (!isUp) {
      lineSeriesRef.current?.applyOptions({
        lineColor: "rgba(255, 102, 56, 1)",
        topColor: "rgba(255, 102, 56, 0.56)",
        bottomColor: "rgba(255, 102, 56, 0.04)",
      });
    } else {
      lineSeriesRef.current?.applyOptions({
        lineColor: "rgba(88, 189, 125, 1)",
        topColor: "rgba(88, 189, 125, 0.56)",
        bottomColor: "rgba(88, 189, 125, 0.04)",
      });
    }
  }, [props.data]);

  useEffect(() => {
    chartRef.current?.applyOptions?.(props.layout);
    chartContainerRef.current?.setAttribute?.("clientWidth", `${props.layout.width}px`);
    chartContainerRef.current?.setAttribute?.("clientHeight", `${props.layout.height}px`);
  }, [props.layout]);

  return <div ref={chartContainerRef}></div>;
}
