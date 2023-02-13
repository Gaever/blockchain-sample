import { MarketDepthItemRow } from "@ctocker/lib/build/main/src/types/stock";

export const _in: {
  orders: MarketDepthItemRow[];
  rates: string[];
  lastPrice: string;
  zoomFactor: number;
  visibleRowsPerHalf: number;
  scrollOffsetTop: number;
  scrollOffsetBottom: number;
} = {
  orders: [
    {
      rate: "1.7",
      volume: "1000",
      aggregatedVolume: "5000",
      isTop: true,
    },
    {
      rate: "1.6",
      volume: "1000",
      aggregatedVolume: "4000",
      isTop: true,
    },
    {
      rate: "1.5",
      volume: "1000",
      aggregatedVolume: "3000",
      isTop: true,
    },
    {
      rate: "1.4",
      volume: "1000",
      aggregatedVolume: "2000",
      isTop: true,
    },
    {
      rate: "1.2",
      volume: "1000",
      aggregatedVolume: "1000",
      isTop: true,
    },

    {
      rate: "0.8",
      volume: "1000",
      aggregatedVolume: "1000",
      isTop: false,
    },
    {
      rate: "0.7",
      volume: "1000",
      aggregatedVolume: "2000",
      isTop: false,
    },
    {
      rate: "0.6",
      volume: "1000",
      aggregatedVolume: "3000",
      isTop: false,
    },
    {
      rate: "0.5",
      volume: "1000",
      aggregatedVolume: "4000",
      isTop: false,
    },
    {
      rate: "0.4",
      volume: "1000",
      aggregatedVolume: "5000",
      isTop: false,
    },
  ],
  rates: ["2", "1.9", "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1", "1", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"],
  lastPrice: "1.1",
  zoomFactor: 1,
  visibleRowsPerHalf: 4,
  scrollOffsetTop: 1,
  scrollOffsetBottom: 1,
};

export const _out: [MarketDepthItemRow[], MarketDepthItemRow[], number, number] = [
  [
    {
      rate: "1.7",
      volume: "1000",
      aggregatedVolume: "5000",
      isTop: true,
    },
    {
      rate: "1.6",
      volume: "1000",
      aggregatedVolume: "4000",
      isTop: true,
    },
    {
      rate: "1.5",
      volume: "1000",
      aggregatedVolume: "3000",
      isTop: true,
    },
    {
      rate: "1.4",
      volume: "1000",
      aggregatedVolume: "2000",
      isTop: true,
    },
  ],
  [
    {
      rate: "0.7",
      volume: "1000",
      aggregatedVolume: "2000",
      isTop: false,
    },
    {
      rate: "0.6",
      volume: "1000",
      aggregatedVolume: "3000",
      isTop: false,
    },
    {
      rate: "0.5",
      volume: "1000",
      aggregatedVolume: "4000",
      isTop: false,
    },
    {
      rate: "0.4",
      volume: "1000",
      aggregatedVolume: "5000",
      isTop: false,
    },
  ],
  1,
  1,
];
