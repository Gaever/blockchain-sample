import { MarketDepthItemRow } from "@ctocker/lib/build/main/src/types/stock";

export const _in: { orders: MarketDepthItemRow[]; rates: string[]; lastPrice: string; zoomFactor: number; visibleRowsPerHalf: number } = {
  orders: [],
  rates: ["2", "1.9", "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1", "1", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"],
  lastPrice: "0.01",
  zoomFactor: 1,
  visibleRowsPerHalf: 4,
};

export const _out: [MarketDepthItemRow[], MarketDepthItemRow[], number, number] = [
  [
    {
      rate: "0.4",
      volume: "0",
      aggregatedVolume: "0",
      isTop: true,
    },
    {
      rate: "0.3",
      volume: "0",
      aggregatedVolume: "0",
      isTop: true,
    },
    {
      rate: "0.2",
      volume: "0",
      aggregatedVolume: "0",
      isTop: true,
    },
    {
      rate: "0.1",
      volume: "0",
      aggregatedVolume: "0",
      isTop: true,
    },
  ],
  [],
  -1,
  -1,
];
