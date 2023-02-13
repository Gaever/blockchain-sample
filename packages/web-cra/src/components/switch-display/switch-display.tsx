import { currency } from "@ctocker/lib/build/main/src/types/stock";
import { Button as MUIButton, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

const Button = styled(MUIButton)(
  ({ theme }) => `
    &.MuiButton-containedPrimary {
      background: ${theme.palette.primary.main};
    }
    &.MuiButton-containedSecondary {
      background: ${theme.palette.error.main};
    }
    &.MuiButton-outlined {
      border: 1px solid ${theme.palette.grey[500]};
      color: ${theme.palette.grey[500]};
    }
`
);
export interface SwitchDisplayProps {
  isSell: boolean;
  onChange: (sell: boolean) => void;
  rootCur: currency | undefined;
}

function SwitchDisplay(props: SwitchDisplayProps) {
  return (
    <Stack direction="row" spacing={1}>
      <Button onClick={() => props.onChange(true)} variant={props.isSell ? "contained" : "outlined"} color="secondary" fullWidth>
        Sell {props.rootCur?.toUpperCase?.()}
      </Button>
      <Button onClick={() => props.onChange(false)} variant={!props.isSell ? "contained" : "outlined"} color="primary" fullWidth>
        Buy {props.rootCur?.toUpperCase?.()}
      </Button>
    </Stack>
  );
}

export default SwitchDisplay;
