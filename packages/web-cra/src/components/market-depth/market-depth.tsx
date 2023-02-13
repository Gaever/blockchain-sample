import { currency, MarketDepthItemRow } from "@ctocker/lib/build/main/src/types/stock";
import { Box, styled } from "@mui/system";
import BigNumber from "bignumber.js";
import MarketDepthItem from "../market-depth-item/market-depth-item";

export interface MarketDepthProps {
  topRows: MarketDepthItemRow[];
  bottomRows: MarketDepthItemRow[];
  scale?: number;
  parentHeight: number;
  onRowClick?: (item: MarketDepthItemRow, event: React.SyntheticEvent) => void;
  lastDealRate: string;
  minorCur?: currency;
  rowHeight?: number;
  lastPriceHeight?: number;
  onScrollTop: (direction: "top" | "bottom") => void;
  onScrollBottom: (direction: "top" | "bottom") => void;
}

const StyledUl = styled(Box)`
  width: 100%;
  position: relative;
  z-index: 1;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LastDealBox = styled(Box)(
  ({ theme }) => `
  padding: 10px;
  text-align: center;
  &:hover {
    background-color: ${theme.palette.action.selected};
    cursor: pointer;
  }
`
);

function MarketDepth(props: MarketDepthProps) {
  const lastPriceHeight = props.lastPriceHeight || 40;
  const minHalfHeight = Math.floor((props.parentHeight - lastPriceHeight) / 2);

  const top = props.topRows;
  const bottom = props.bottomRows;

  const topMaxVolume = top[0]?.aggregatedVolume;
  const bottomMaxVolume = bottom[bottom.length - 1]?.aggregatedVolume;

  return (
    <Box>
      <StyledUl
        component="ul"
        sx={{ height: minHalfHeight - 4, justifyContent: "flex-end" }}
        onWheel={(event) => {
          props.onScrollTop(event.deltaY > 0 ? "bottom" : "top");
        }}
      >
        {top.map((item) => (
          <MarketDepthItem
            key={`market-depth-item-${item.rate}${item.volume}${item.aggregatedVolume}`}
            histogramHeight={new BigNumber(item.aggregatedVolume).div(topMaxVolume).toNumber()}
            onClick={(event) => {
              props?.onRowClick?.(item, event);
            }}
            {...item}
          />
        ))}
      </StyledUl>
      <LastDealBox
        onClick={(event) => {
          if (props.lastDealRate) {
            props?.onRowClick?.(
              {
                isTop: true,
                rate: props.lastDealRate,
                aggregatedVolume: "0",
                volume: "0",
              },
              event
            );
          }
        }}
      >
        {new BigNumber(props.lastDealRate).sd(10).toFormat()} {props.minorCur?.toUpperCase?.()}
      </LastDealBox>
      <StyledUl
        component="ul"
        sx={{ height: minHalfHeight }}
        onWheel={(event) => {
          props.onScrollBottom(event.deltaY > 0 ? "bottom" : "top");
        }}
      >
        {bottom.map((item) => (
          <MarketDepthItem
            key={`market-depth-item-${item.rate}${item.volume}${item.aggregatedVolume}`}
            histogramHeight={new BigNumber(item.aggregatedVolume).div(bottomMaxVolume).toNumber()}
            onClick={(event) => {
              props?.onRowClick?.(item, event);
            }}
            {...item}
          />
        ))}
      </StyledUl>
    </Box>
  );
}

export default MarketDepth;
