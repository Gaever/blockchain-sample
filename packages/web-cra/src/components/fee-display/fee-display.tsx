import { ExchangeCalcResult } from "@/types";
import { Link, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/system";

export interface FeeDisplayProps {
  exchangeResult: ExchangeCalcResult | null;
  isLoading: boolean;
}

function concat(arr: (string | undefined)[]) {
  return arr.filter(Boolean).join("");
}

function useFormattedFees(exchangeResult: FeeDisplayProps["exchangeResult"]) {
  const takerFeeEntries: (string | undefined)[] = [];
  const makerFeeEntries: (string | undefined)[] = [];
  const payoutBlockchainTransactionFeeEntries: (string | undefined)[] = [];
  const refundBlockchainTransactionFeeEntries: (string | undefined)[] = [];
  const minAmountEntries: (string | undefined)[] = [];
  const expiredOrderEntries: (string | undefined)[] = [];
  const targetCur = exchangeResult?.targetCur?.toUpperCase?.();
  const sendCur = exchangeResult?.sendCur?.toUpperCase?.();
  const nbsp = "\u00A0";

  if (exchangeResult?.takerStockFeeInTargetCurCoins) {
    takerFeeEntries.push(exchangeResult.takerStockFeeInTargetCurCoins, nbsp, targetCur);
  }

  if ((exchangeResult?.takerStockFeeInPercent || 0) > 0) {
    takerFeeEntries.push(" ", `(${exchangeResult!.takerStockFeeInPercent * 100}%)`);
  }

  if (exchangeResult?.makerStockFeeInTargetCurCoins) {
    makerFeeEntries.push(exchangeResult.makerStockFeeInTargetCurCoins, nbsp, targetCur);
  }

  if ((exchangeResult?.makerStockFeeInPercent || 0) > 0) {
    makerFeeEntries.push(" ", `(${exchangeResult!.makerStockFeeInPercent * 100}%)`);
  }

  payoutBlockchainTransactionFeeEntries.push(exchangeResult?.payoutBlockchainFeeInTargetCurCoins, nbsp, targetCur);
  refundBlockchainTransactionFeeEntries.push(exchangeResult?.refundBlockchainFeeInSendCurCoins, nbsp, sendCur);

  if (Number(exchangeResult?.minSendAmountInSendCurCoins || 0) > 0) {
    minAmountEntries.push(exchangeResult!.minSendAmountInSendCurCoins, nbsp, targetCur);
  }

  // expiredOrderEntries.push(exchangeResult?.refundAmountInSendCurInCoins, nbsp, sendCur);

  if (exchangeResult?.refundStockFeeInSendCurCoins) {
    // expiredOrderEntries.push(" (refund fee is ");
    if ((exchangeResult?.refundStockFeeInInPercent || 0) > 0) {
      // expiredOrderEntries.push(`${exchangeResult!.refundStockFeeInInPercent * 100}%`, " (", exchangeResult?.refundStockFeeInSendCurCoins, nbsp, sendCur, ")");
      expiredOrderEntries.push(`${exchangeResult!.refundStockFeeInInPercent * 100}%`);
    } else {
      expiredOrderEntries.push(exchangeResult?.refundStockFeeInSendCurCoins, nbsp, sendCur);
    }
    // expiredOrderEntries.push(")");
  }

  return {
    takerFeeString: concat(takerFeeEntries),
    makerFeeString: concat(makerFeeEntries),
    payoutBlockchainTransactionFeeString: concat(payoutBlockchainTransactionFeeEntries),
    refundBlockchainTransactionFeeString: concat(refundBlockchainTransactionFeeEntries),
    minAmountString: concat(minAmountEntries),
    expiredOrderString: concat(expiredOrderEntries),
  };
}

function FeeDisplay(props: FeeDisplayProps) {
  const { takerFeeString, makerFeeString, payoutBlockchainTransactionFeeString, minAmountString, expiredOrderString } = useFormattedFees(props.exchangeResult);

  if (props.isLoading)
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box height={190}>
          <Skeleton variant="text" width={168} />
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={200} />
        </Box>
      </Box>
    );

  if (!props?.exchangeResult) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "190px", "& .MuiTypography-root": { marginBottom: "10px" } }}>
      <Typography variant="subtitle1" component="p">
        Short rules and commissions: <br />
      </Typography>
      <Typography variant="subtitle1" component="ul" sx={{ pl: "15px" }}>
        <li>Taker fee is {takerFeeString}</li>
        <li>Maker fee is {makerFeeString}</li>
        <li>Blockchain transaction fee is {payoutBlockchainTransactionFeeString}</li>
        {minAmountString ? <li>Min. amount is {minAmountString}, less amount will be considered as donation.</li> : null}
      </Typography>
      <Typography variant="subtitle1" component="p">
        Maker is the one who places an order that goes on the order book. These orders "add" volume to the order book, helping to make the market.
      </Typography>
      <Typography variant="subtitle1" component="p">
        Taker is the one who places an order that trades immediately before going on the order book. These trades are "taking" volume off of the order book.
      </Typography>
      <Typography variant="subtitle1" component="p">
        If an order is not fully/partly filled it will be fully/partly refunded in {props.exchangeResult?.expiresIn} excluding {expiredOrderString} fee.
      </Typography>
      <Typography variant="subtitle1" component="p">
        Please do not mix up vanity address above, as each address corresponds to a specific exchange rate.
      </Typography>
      <Typography variant="subtitle1" component="p">
        <Link href={process.env.REACT_APP_HREF_TERMS || "/api/pdf/ctocker-terms.pdf"}>Terms of use</Link>
      </Typography>
    </Box>
  );
}

export default FeeDisplay;
