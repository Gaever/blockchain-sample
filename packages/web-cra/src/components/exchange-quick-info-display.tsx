import { currency } from "@ctocker/lib/build/main/src/types/stock";
import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";

export interface ExchangeQuickInfoDisplayProps {
  sendAmount: string | undefined;
  getAmount: string | undefined;
  sendCur: currency | undefined;
  getCur: currency | undefined;
  rate: string | undefined;
  pair: string | undefined;
  isLoading?: boolean;
}

function ExchangeQuickInfoDisplay(props: ExchangeQuickInfoDisplayProps) {
  if (props.isLoading)
    return (
      <Box sx={{ height: "148px" }}>
        <Skeleton variant="text" width={250} />
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={200} />
        <Skeleton variant="text" width={100} />
      </Box>
    );

  if (
    props.getAmount === undefined ||
    props.sendAmount === undefined ||
    props.sendCur === undefined ||
    props.getCur === undefined ||
    props.rate === undefined ||
    props.pair === undefined
  ) {
    return null;
  }

  const sendCur = props.sendCur?.toUpperCase?.();
  const getCur = props.getCur?.toUpperCase?.();

  return (
    <Box sx={{ minHeight: "110px" }}>
      <Box mb={1}>
        <Typography variant="body2">
          Send {props.sendAmount} {sendCur} to address below to get {props.getAmount} {getCur} by exchange rate
          <br /> {props.pair} = {props.rate}, excluding commission {"&"} transaction fee
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">
          Exchanged {getCur} coins will be sent to {getCur} wallet which has the same mnemonic as your {sendCur} sender wallet has
        </Typography>
      </Box>
    </Box>
  );
}

export default ExchangeQuickInfoDisplay;
