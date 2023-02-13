import { ExchangeCalcResult } from "@/types";
import HelpIcon from "@mui/icons-material/Help";
import { ClickAwayListener, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/system";
import { useState } from "react";
import { isMobile } from "react-device-detect";

export interface PayoutDisplayProps {
  isLoading?: boolean;
  exchangeResult: ExchangeCalcResult | null;
}

function PayoutDisplay(props: PayoutDisplayProps) {
  const [isHelper1Displayed, setIsHelper1Displayed] = useState(false);
  const [isHelper2Displayed, setIsHelper2Displayed] = useState(false);
  const targetCur = props.exchangeResult?.targetCur?.toUpperCase?.();

  if (props.isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box mb={2} height={56}>
          <Skeleton variant="rectangular" height={56} width="100%" />
        </Box>
        <Box mb={1} height={56}>
          <Skeleton variant="text" height={56} />
        </Box>
      </Box>
    );
  }

  return (
    <Stack direction="column" spacing={2}>
      <Box>
        <TextField
          fullWidth
          disabled={!Boolean(props.exchangeResult)}
          sx={{ ".MuiInputBase-root": { pr: 1 } }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <ClickAwayListener
                  onClickAway={() => {
                    setIsHelper1Displayed(false);
                  }}
                >
                  <Tooltip
                    {...(isMobile ? { open: isHelper1Displayed } : null)}
                    placement="top-start"
                    title={'Maker is the one who places an order that goes on the order book. These orders "add" volume to the order book, helping to make the market.'}
                  >
                    <IconButton
                      onClick={() => {
                        setIsHelper1Displayed(true);
                      }}
                    >
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </InputAdornment>
            ),
          }}
          value={props.exchangeResult?.makerPayoutInTargetCurCoins || ""}
          label={`${targetCur ? `Get ${targetCur} (maker)` : ""} `}
        />
      </Box>
      <Box>
        <TextField
          fullWidth
          disabled={!Boolean(props.exchangeResult)}
          sx={{ ".MuiInputBase-root": { pr: 1 } }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <ClickAwayListener
                  onClickAway={() => {
                    setIsHelper2Displayed(false);
                  }}
                >
                  <Tooltip
                    placement="top-start"
                    {...(isMobile ? { open: isHelper2Displayed } : null)}
                    title={'Taker is the one who places an order that trades immediately before going on the order book. These trades are "taking" volume off of the order book.'}
                  >
                    <IconButton
                      onClick={() => {
                        setIsHelper2Displayed(true);
                      }}
                    >
                      <HelpIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </InputAdornment>
            ),
          }}
          value={props.exchangeResult?.takerPayoutInTargetCurCoins || ""}
          label={`${targetCur ? `Get ${targetCur} (taker)` : ""} `}
        />
      </Box>
    </Stack>
  );
}

export default PayoutDisplay;
