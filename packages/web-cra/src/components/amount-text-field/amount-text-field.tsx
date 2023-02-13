import { currency } from "@ctocker/lib/build/main/src/types/stock";
import { TextField } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";

export interface AmountTextFieldProps {
  onChange: (amount: string, event?: React.SyntheticEvent) => void;
  sendCur?: currency;
  minAmount?: string;
  value?: string;
  errorLabel?: string;
  mojosInSendCurCoin?: string;
  isLoading?: boolean;
}

function validate(str: string, minAmount: string, mojosInSendCurCoin?: string): string | undefined {
  if (!str) return;
  if (!str.match(/^(\d{1,}[.])?([0-9]+)?$/) || (str[0] === "0" && str.length > 1 && str[1] !== ".")) {
    return 'Must be number (separate point is ".")';
  }
  if (minAmount && new BigNumber(str).lt(minAmount)) {
    return `Min. exchange amount is ${minAmount}`;
  }

  const floatingV = str.split(".")?.[1];
  const decimalPrecision = Number(mojosInSendCurCoin?.length || 2) - 1;

  if (floatingV?.length > decimalPrecision) return `Mantissa can not be greater than ${decimalPrecision} digits`;
}

function AmountTextField(props: AmountTextFieldProps) {
  const [amount, setAmount] = useState(props.value || "0");
  const [errorLabel, setErrorLabel] = useState("");

  useEffect(() => {
    if (props.value) {
      setAmount(props.value);
      const error = validate(props.value, props.minAmount || "0", props.mojosInSendCurCoin);
      if (error) {
        setErrorLabel(error);
      } else {
        setErrorLabel("");
      }
    }
  }, [props.value]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setErrorLabel("");
      }}
    >
      <Tooltip open={!!errorLabel || !!props.errorLabel} title={errorLabel || props.errorLabel || ""}>
        <TextField
          disabled={props.isLoading}
          fullWidth
          error={!!errorLabel || !!props.errorLabel}
          label={`${props.sendCur ? `Send ${props.sendCur?.toUpperCase?.()}` : ""}`}
          value={amount}
          onChange={(event) => {
            const value = event.target.value;
            if (value && !value.match(/^(\d{1,}[.]{0,1})[0-9]{0,}$/)) {
              return;
            }

            const error = validate(value, props.minAmount || "0", props.mojosInSendCurCoin);
            if (error) {
              setErrorLabel(error);
            } else {
              if (!value || value.match(/^(\d{1,}[.])?[0-9]+$/)) {
                props.onChange(value, event);
              }
              setErrorLabel("");
            }
            setAmount(value);
          }}
        />
      </Tooltip>
    </ClickAwayListener>
  );
}

export default AmountTextField;
