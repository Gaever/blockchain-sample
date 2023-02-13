import CandlesChart from "@/components/candles-chart";
import CurDropdown, { CurDropdownProps } from "@/components/cur-dropdown";
import { GroupStepTickerProps } from "@/components/group-step-ticker";
import LayoutBox from "@/components/layout-box";
import Toolbar from "@/components/toolbar/toolbar";
import MarketDepthColumnContainer from "@/containers/market-depth-column-container";
import Dropdown from "@/ui/dropdown/dropdown";
import { StockChartData, TimeBucket } from "@ctocker/lib/build/main/src/types/stock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HeaderToolbar from "../header-toolbar";

interface ResizableLayoutProps extends CurDropdownProps, StockChartData, Pick<GroupStepTickerProps, "onGroupStepChange" | "groupStep"> {
  onChangeIntervalClick: (value: TimeBucket) => void;
  selectedInterval: string;
  intervals: TimeBucket[];
  onFlipClick: () => void;
  isFlipped: boolean;
}

export default function ChartLayout(props: ResizableLayoutProps) {
  return (
    <>
      <HeaderToolbar />
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 82px)",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Box width="100%">
          <Toolbar BoxProps={{ sx: { height: "56px", pl: "8px" } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  "& button": {},
                }}
              >
                <CurDropdown stocks={props.stocks} activeStock={props.activeStock} onChangeStock={props.onChangeStock} />
                <Dropdown items={props.intervals} onItemClick={props.onChangeIntervalClick} activeItem={props.selectedInterval} />
                <Button onClick={props.onFlipClick}>Flip root</Button>
              </Box>
            </Box>
          </Toolbar>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              flex: { xs: 1, md: 3 },
              height: "100%",
              flexDirection: "row",
              borderRightWidth: "1px",
              borderRightStyle: "solid",
              borderRightColor: "divider",
            }}
          >
            <LayoutBox sx={{ flex: 1, width: "100%", height: "100%" }}>
              {(layout) => <CandlesChart candlesData={props.candles} volumeData={props.volume} layout={layout} pricePrecision={props.pricePrecision} volumePrecision={10} />}
            </LayoutBox>
          </Box>
          <Box
            sx={{
              flex: 1,
              height: "100%",
              display: "flex",
              alignItems: "stretch",
              flexDirection: "column",
              minWidth: "380px",
              maxWidth: "450px",
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "100%",
                display: "flex",
                alignItems: "stretch",
                flexDirection: "column",
              }}
            >
              <MarketDepthColumnContainer
                stockId={props.activeStock?.id?.toString?.()}
                marketDepthRows={props.marketDepth || []}
                lastDealRate={props.lastDealRate}
                rootCur={props.activeStock?.cur1}
                minorCur={props.activeStock?.cur2}
                groupStep={props.groupStep}
                flip={props.isFlipped}
                mojosInRootCurCoin={props.activeStock?.mojosInCur1Coin}
                mojosInMinorCurCoin={props.activeStock?.mojosInCur2Coin}
                onGroupStepChange={props.onGroupStepChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
