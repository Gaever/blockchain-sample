import ExchangeDrawer from "@/components/exchange-drawer/exchange-drawer";
import { currency, MarketDepthItemRow } from "@ctocker/lib/build/main/src/types/stock";
import { RatesRes, RateToAddressRes } from "@ctocker/lib/build/main/src/types/web-api";
import { useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { AxiosResponse } from "axios";
import BigNumber from "bignumber.js";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { http } from "../api";
import GroupStepTicker, { GroupStepTickerProps } from "../components/group-step-ticker";
import MarketDepth, { MarketDepthProps } from "../components/market-depth/market-depth";
import ExchangeCalc from "./exchange-calc/exchange-calc";
import { doExchangeCalc, toCoins } from "./exchange-calc/exchange-calc-functions";
import { getVisibleMarketDepthRows } from "./market-depth";

export interface MarketDepthColumnContainerProps {
  stockId: string | undefined;
  rootCur: currency | undefined;
  minorCur: currency | undefined;
  flip: boolean | undefined;
  marketDepthRows: MarketDepthItemRow[];
  mojosInRootCurCoin: string | undefined;
  mojosInMinorCurCoin: string | undefined;
  lastDealRate: MarketDepthProps["lastDealRate"];
  onGroupStepChange: GroupStepTickerProps["onGroupStepChange"];
  groupStep: GroupStepTickerProps["groupStep"];
}

interface State {
  amount: string;
  closestAvailableRate: string | undefined;
  closestAvailableRateIndex?: number;
  scrollOffsetTop: number;
  scrollOffsetBottom: number;
  sendCur: currency | undefined;
  selectedRate: string | undefined;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const drawerBleeding = 56;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function MarketDepthColumnContainer(props: MarketDepthColumnContainerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [state, setState] = useState<Partial<State>>({
    scrollOffsetTop: 0,
    scrollOffsetBottom: 0,
  });
  const marketDepthContainerRef = useRef<HTMLDivElement | null>(null);

  const marketDepthContainerHeight = +(marketDepthContainerRef.current?.clientHeight || 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const flip = Boolean(props?.flip);
  const stockId = props.stockId;

  const ratesQuery = useQuery<AxiosResponse<RatesRes>>(
    ["rates", stockId, flip],
    async () =>
      http({
        method: "get",
        url: "rate",
        params: { action: "list", stockId: props.stockId, flip },
      }),
    {
      enabled: Boolean(stockId),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const rateToAddressQuery = useQuery<AxiosResponse<RateToAddressRes>>(
    ["rate-to-address", props.stockId, state?.closestAvailableRateIndex, flip],
    async () =>
      http({
        method: "get",
        url: "rate",
        params: {
          action: "to-address",
          stockId,
          rate_index: state.closestAvailableRateIndex,
          flip,
        },
      }),
    {
      enabled: state.closestAvailableRateIndex !== undefined && state.closestAvailableRateIndex >= 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const rates = ratesQuery.data?.data || [];
  const selectedRate = state?.selectedRate || state?.closestAvailableRate || props?.lastDealRate || "1";

  const rootCur = props.rootCur;
  const minorCur = props.minorCur;
  const sendCur = state.sendCur || rootCur;

  const address1 = rateToAddressQuery.data?.data?.address1;
  const address2 = rateToAddressQuery.data?.data?.address2;

  const isSell = rootCur === sendCur;

  const addressToSendFunds = isSell ? address1 : address2;
  const addressConfig = rateToAddressQuery.data?.data?.addressConfig;

  const mojosInSendCurCoin = sendCur === rootCur ? props.mojosInRootCurCoin : props.mojosInMinorCurCoin;
  const minSendAmountInSendCurCoins = toCoins(new BigNumber(addressConfig?.stockConfig?.[sendCur!]?.minInAmountFixed || 0), new BigNumber(mojosInSendCurCoin || 0)).toString();
  const sendAmountInSendCurCoins = (state.amount === undefined && minSendAmountInSendCurCoins) || (state.amount === "" && "0") || state.amount;

  const exchangeResult = doExchangeCalc({
    sendAmountInSendCurCoins,
    addressConfig,
    mojosInRootCurCoin: (props.mojosInRootCurCoin && new BigNumber(props.mojosInRootCurCoin)) || undefined,
    mojosInMinorCurCoin: (props.mojosInMinorCurCoin && new BigNumber(props.mojosInMinorCurCoin)) || undefined,
    sendCur,
  });

  const lastPriceHeight = 40;
  const rowHeight = 20;
  const minHalfHeight = Math.floor((marketDepthContainerHeight - lastPriceHeight) / 2);
  const maxHalfRows = Math.floor(minHalfHeight / rowHeight);

  const zoomFactor = Math.ceil(Math.pow(2, props.groupStep));

  const [topOrders, bottomOrders, scrollOffsetTop, scrollOffsetBottom] = getVisibleMarketDepthRows(
    props.marketDepthRows,
    rates,
    props?.lastDealRate,
    zoomFactor,
    maxHalfRows,
    state.scrollOffsetTop,
    state.scrollOffsetBottom
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "stretch",
          flex: "1",
          overflow: "scroll",
        }}
      >
        <Box
          ref={marketDepthContainerRef}
          sx={{
            flex: "1",
            justifyContent: "center",
            flexDirection: "column",
            display: "flex",
            width: "100%",
          }}
        >
          <MarketDepth
            parentHeight={marketDepthContainerHeight}
            lastDealRate={props.lastDealRate}
            topRows={topOrders}
            bottomRows={bottomOrders}
            onRowClick={(item) => {
              setState((prev) => ({
                ...prev,
                sendCur: item.isTop ? rootCur : minorCur,
                selectedRate: String(item.rate),
              }));
              setIsDrawerOpen(true);
            }}
            minorCur={minorCur}
            onScrollTop={(direction) => {
              if (direction === "top") {
                setState((prev) => ({
                  ...prev,
                  scrollOffsetTop: scrollOffsetTop + 1,
                }));
              } else {
                const prevOffset = state.scrollOffsetTop || 0;
                const newOffset = prevOffset - 1 < 0 ? 0 : prevOffset - 1;
                setState((prev) => ({ ...prev, scrollOffsetTop: newOffset }));
              }
            }}
            onScrollBottom={(direction) => {
              if (direction === "bottom") {
                setState((prev) => ({
                  ...prev,
                  scrollOffsetBottom: scrollOffsetBottom + 1,
                }));
              } else {
                const prevOffset = state.scrollOffsetBottom || 0;
                const newOffset = prevOffset - 1 < 0 ? 0 : prevOffset - 1;
                setState((prev) => ({
                  ...prev,
                  scrollOffsetBottom: newOffset,
                }));
              }
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flex: 1, justifyContent: "center" }} m={1}>
            <Button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              variant="outlined"
              fullWidth
              color="info"
            >
              Sell / Buy
            </Button>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <GroupStepTicker
              groupStep={props.groupStep}
              onGroupStepChange={props.onGroupStepChange}
              isMaxGroupStep={topOrders.length <= 2 && bottomOrders.length <= 2}
              groupAmount={zoomFactor}
            />
          </Box>
        </Box>
      </Box>
      <ExchangeDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
      >
        <ExchangeCalc
          sendAmountInSendCurCoins={sendAmountInSendCurCoins}
          addressToSendFunds={addressToSendFunds}
          rootCur={rootCur}
          minorCur={minorCur}
          isSell={isSell}
          addressConfig={addressConfig}
          isLoading={rateToAddressQuery.isLoading}
          exchangeResult={exchangeResult}
          selectedRate={selectedRate}
          rates={rates}
          ratePickerScrollRows={11}
          onRateChange={(closestAvailableRate, index) => {
            setState((prev) => ({
              ...prev,
              closestAvailableRate,
              closestAvailableRateIndex: index >= 0 ? index : undefined,
              selectedRate: undefined,
            }));
          }}
          onTargetCurChange={(isSell) => {
            setState((prev) => ({ ...prev, sendCur: isSell ? rootCur : minorCur }));
          }}
          onAmountChange={(amount) => {
            setState((prev) => ({ ...prev, amount }));
          }}
        />
      </ExchangeDrawer>
    </>
  );
}
