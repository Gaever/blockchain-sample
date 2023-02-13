import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export interface ToolbarProps {
  children?: React.ReactNode;
  BoxProps?: BoxProps;
}

const StyledBox = styled(Box)(
  ({ theme }) => `
  border-bottom: 1px solid ${theme.palette.divider};
  height: 46px;
  display: flex;
`
);

export default function Toolbar(props: ToolbarProps) {
  return <StyledBox {...props.BoxProps}>{props.children}</StyledBox>;
}
