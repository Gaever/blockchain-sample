import CloseIcon from "@/components/close-icon";
import { useMediaQuery } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled, useTheme } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box } from "@mui/system";

export interface ExchangeDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const borderRadius = "15px";

export default function ExchangeDrawer(props: ExchangeDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <SwipeableDrawer
      anchor={isMobile ? "bottom" : "right"}
      open={props.isOpen}
      sx={{
        "& .MuiDrawer-paperAnchorBottom": {
          top: { sm: "56px", xs: "56px", md: "auto" },
          borderTopLeftRadius: { sm: borderRadius, xs: borderRadius, md: "auto" },
          borderTopRightRadius: { sm: borderRadius, xs: borderRadius, md: "auto" },
        },
      }}
      onClose={props.onClose}
      onOpen={() => {}}
    >
      <Box sx={{ width: { sm: "100%", md: 400 } }} p={2}>
        <StyledBox
          sx={{
            display: { sm: "block", md: "none" },
            mb: 2,
          }}
        >
          <Puller />
        </StyledBox>
        <Box sx={{ display: { sm: "none", xs: "none", md: "flex" }, flexDirection: "column", alignItems: "flex-end" }}>
          <CloseIcon onClick={props.onClose} />
          {/* <IconButton onClick={props.onClose}>
            <CloseIcon fontSize="small" />
          </IconButton> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 325,
          }}
        >
          {props.children}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
}
