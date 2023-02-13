import AddressDisplay from "@/components/address-display/address-display";
import AmountTextField, { AmountTextFieldProps } from "@/components/amount-text-field/amount-text-field";
import ExchangeQuickInfoDisplay from "@/components/exchange-quick-info-display";
import FeeDisplay from "@/components/fee-display/fee-display";
import PayoutDisplay from "@/components/payout-display/payout-display";
import RatePicker, { RatePickerProps } from "@/components/rate-picker/rate-picker";
import SwtichDisplay, { SwitchDisplayProps } from "@/components/switch-display/switch-display";
import { ExchangeCalcResult } from "@/types";
import { AddressConfig, currency } from "@ctocker/lib/build/main/src/types/stock";
import { Box } from "@mui/system";
import { useState } from "react";

export interface TradeDrawerProps {
  sendAmountInSendCurCoins: string | undefined;
  addressToSendFunds: string | undefined;
  rootCur: currency | undefined;
  minorCur: currency | undefined;
  isSell: boolean;
  addressConfig: AddressConfig | undefined;
  isLoading: boolean;
  exchangeResult: ExchangeCalcResult | null;

  selectedRate: RatePickerProps["selectedRate"];
  rates: RatePickerProps["rates"];
  ratePickerScrollRows: RatePickerProps["scrollRows"];

  onTargetCurChange: SwitchDisplayProps["onChange"];
  onAmountChange: AmountTextFieldProps["onChange"];
  onRateChange: RatePickerProps["onRateChange"];
}

function ExchangeCalc(props: TradeDrawerProps) {
  const [hasError, setHasError] = useState(false);
  const amountTextFieldErrorLabel =
    Number(props?.sendAmountInSendCurCoins || 0) < Number(props?.exchangeResult?.minSendAmountInSendCurCoins || 0)
      ? `Min. exchange amount is ${props?.exchangeResult?.minSendAmountInSendCurCoins}`
      : "";
  const pair = `${props.rootCur?.toUpperCase?.()}/${props.minorCur?.toUpperCase?.()}`;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }} p={1}>
      <Box mb={2}>
        <ExchangeQuickInfoDisplay
          sendAmount={props.sendAmountInSendCurCoins}
          getAmount={props.exchangeResult?.payoutAmountInTargetCurCoins}
          sendCur={props.exchangeResult?.sendCur}
          getCur={props.exchangeResult?.targetCur}
          rate={props.selectedRate}
          pair={pair}
          isLoading={props.isLoading}
        />
      </Box>
      <Box mb={2}>
        <RatePicker
          selectedRate={props.selectedRate}
          rates={props.rates}
          scrollRows={props.ratePickerScrollRows}
          onRateChange={props.onRateChange}
          onSuggestedRate={(suggestedRate) => {
            setHasError(!!suggestedRate);
          }}
          isLoading={props.isLoading}
          pair={pair}
        />
      </Box>
      <Box mb={2}>
        <AmountTextField
          onChange={props.onAmountChange}
          sendCur={props.exchangeResult?.sendCur}
          minAmount={props.exchangeResult?.minSendAmountInSendCurCoins}
          value={props.sendAmountInSendCurCoins}
          errorLabel={amountTextFieldErrorLabel}
          mojosInSendCurCoin={props.exchangeResult?.mojosInSendCurCoin}
          isLoading={props.isLoading}
        />
      </Box>

      <Box mb={1}>
        <PayoutDisplay exchangeResult={props.exchangeResult} />
      </Box>
      <Box mb={1}>
        <AddressDisplay
          hasError={hasError}
          address={props.addressToSendFunds}
          amount={props.sendAmountInSendCurCoins}
          isLoading={props.isLoading}
          sendCur={props.exchangeResult?.sendCur}
        />
      </Box>
      <Box mb={2}>
        <SwtichDisplay isSell={props.isSell} onChange={props.onTargetCurChange} rootCur={props.rootCur} />
      </Box>
      <Box>
        <FeeDisplay isLoading={props.isLoading} exchangeResult={props.exchangeResult} />
      </Box>
    </Box>
  );
}

export default ExchangeCalc;
