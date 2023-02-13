import {
	createChart,
	HistogramData,
	IChartApi,
	ISeriesApi,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import { Layout } from "../types";

export interface VolumeChartProps {
	data: HistogramData[];
	layout: Layout;
}

export default function VolumeChart(props: VolumeChartProps) {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const histogramRef = useRef<ISeriesApi<"Histogram"> | null>(null);

	useEffect(() => {
		chartRef.current = createChart(chartContainerRef.current || "", {});
		histogramRef.current = chartRef.current.addHistogramSeries();
	}, []);

	useEffect(() => {
		histogramRef.current?.setData(props.data);
	}, [props.data]);

	useEffect(() => {
		chartRef.current?.applyOptions?.(props.layout);
		chartContainerRef.current?.setAttribute?.(
			"clientWidth",
			`${props.layout.width}px`
		);
		chartContainerRef.current?.setAttribute?.(
			"clientHeight",
			`${props.layout.height}px`
		);
	}, [props.layout]);

	return <div ref={chartContainerRef}></div>;
}
