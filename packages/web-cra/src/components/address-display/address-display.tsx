import { currency } from "@ctocker/lib/build/main/src/types/stock";
import { Button as MUIButton, Link, Skeleton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { Box } from "@mui/system";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useDebouncedCallback } from "use-debounce";

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

const AddressLink = styled(Link)(
  ({ theme }) => `
    word-break: break-all;
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: pointer;
    color: ${theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.grey[600]};

    &:hover {
      color: ${theme.palette.mode === "dark" ? "white" : "inherit"};
    }

    .disabled & {
      text-decoration: none;
      color: ${theme.palette.grey[300]};

      &:hover {
        color: ${theme.palette.grey[300]};
      }
    }
`
);

export interface AddressDisplayProps {
  address?: string;
  amount?: string;
  hasError?: boolean;
  isLoading?: boolean;
  sendCur?: currency;
}

function Qr(props: { value: string; hide?: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current !== null) {
      QRCode.toCanvas(ref.current, props.value, {
        width: 128,
        margin: 1,
        ...(props.hide ? { color: { dark: grey[300], light: grey[300] } } : null),
      });
    }
  }, [ref.current, props.value]);

  return <canvas ref={ref} width={"128px"} height={"128px"} />;
}

function AddressDisplay(props: AddressDisplayProps) {
  const qrString = `${props.sendCur}://order/${props.amount || ""}/${props.address}/ctoker`;
  const [isOnCopyTooltipOpen, setIsOnCopyTooltipOpen] = useState(false);
  const debouncedSetIsOnCopyTooltipOpen = useDebouncedCallback((value) => {
    setIsOnCopyTooltipOpen(value);
  }, 1200);

  return (
    <Box>
      <Box sx={{ display: "flex", minHeight: 128 }} mt={1} mb={1}>
        <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mr={1}>
          {!props.isLoading && props.address && <Qr value={qrString} hide={props.hasError} />}
          {props.isLoading && <Skeleton variant="rectangular" width={128} height={128} />}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-start" className={props.hasError ? "disabled" : undefined}>
          {!props.isLoading && props.address && (
            <Box>
              {props.hasError ? (
                <AddressLink as="span">Address unavailable</AddressLink>
              ) : (
                <>
                  <CopyToClipboard
                    text={props.address}
                    onCopy={() => {
                      setIsOnCopyTooltipOpen(true);
                      debouncedSetIsOnCopyTooltipOpen(false);
                    }}
                  >
                    <Tooltip open={isOnCopyTooltipOpen} title="Copied!">
                      <AddressLink as="span">{props.address}</AddressLink>
                    </Tooltip>
                  </CopyToClipboard>
                  <Box mt={1}>
                    <Link href={qrString} target="_blank" underline="none">
                      {/* <Typography variant="button">Open in wallet</Typography> */}
                      <Button sx={{ pl: 0 }}>Open in wallet</Button>
                    </Link>
                  </Box>
                </>
              )}
            </Box>
          )}
          {props.isLoading && (
            <Box>
              <Skeleton variant="text" width={200} />
              <Skeleton variant="text" width={100} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AddressDisplay;
