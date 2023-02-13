import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export interface GroupStepTickerProps {
  maxVolumePrecision?: number;
  maxPricePrecision?: number;
  isMaxGroupStep: boolean;
  groupAmount?: number;
  groupStep: number;
  onGroupStepChange: (value: number) => void;
}

const StyledButton = styled(Box)(
  ({ theme }) => `
  height: 26px;
  width: 26px;
  line-height: 1px;
  font-weight: bold;
  border-radius: ${theme.shape.borderRadius}px;
  border-color: ${theme.palette.action.active};
  border-width: 2px;
  border-style: solid;
  margin: 3px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  &:hover {
    background-color: ${theme.palette.action.hover};
  }
`
);

interface GroupStepTickerItemProps {
  title: string;
  onPlus: () => void;
  onMinus: () => void;
}

function GroupStepTickerItem(props: GroupStepTickerItemProps) {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }} ml={1}>
      <Typography mr={1} variant="button" sx={{ width: "70px", textAlign: "right", lineHeight: "16px" }}>
        {props.title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <StyledButton
          onClick={() => {
            props.onPlus();
          }}
        >
          +
        </StyledButton>
        <StyledButton
          onClick={() => {
            props.onMinus();
          }}
        >
          –
        </StyledButton>
      </Box>
    </Stack>
  );
}

export default function GroupStepTicker(props: GroupStepTickerProps) {
  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <GroupStepTickerItem
        title={`Group${+(props.groupAmount || 0) > 1 ? ` by ${props.groupAmount?.toFixed?.(0)}` : ""}`}
        onPlus={() => {
          props.onGroupStepChange(props.isMaxGroupStep ? props.groupStep : props.groupStep + 1);
        }}
        onMinus={() => {
          props.onGroupStepChange(props.groupStep - 1 < 0 ? 0 : props.groupStep - 1);
        }}
      />
    </Stack>
  );
}
