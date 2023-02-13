import { MarketDepthItemRow } from "@ctocker/lib/build/main/src/types/stock";
import { Box, styled } from "@mui/system";
import BigNumber from "bignumber.js";
import classnames from "classnames";

interface MarketDepthItemProps extends MarketDepthItemRow {
  histogramHeight: number;
  onClick: (event: React.SyntheticEvent) => void;
}

const StyledUl = styled(Box)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 20px;
  position: relative;
  list-style: none;
  font-family: Trebuchet MS, roboto, ubuntu, sans-serif;
  font-size: 11px;



  &:hover {
    background: ${theme.palette.primary.main};
    cursor: pointer;
    color: white
  }

  &.is-top {
    i {
      background: ${theme.palette.error[300]};
    }

    &:hover {
      background: ${theme.palette.error.main};
      cursor: pointer;
      color: white
    }
  }

  i {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 100%;
    z-index: -1;
    background: ${theme.palette.primary[300]};
  }

  span {
    display: flex;
    height: 100%;
    flex: 1;
    line-height: 20px;
    flex-direction: row-reverse;
  }

  @media (${theme.breakpoints.down("md")}) {
    font-size: 12px;
    height: 20px;
 }
`
);

const format = {
  decimalSeparator: ".",
  groupSeparator: " ",
  groupSize: 3,
};

export default function MarketDepthItem(props: MarketDepthItemProps) {
  return (
    <StyledUl
      className={classnames([{ "is-top": props.isTop }])}
      onClick={props.onClick}
    >
      <i style={{ width: `${props.histogramHeight * 100}%` }}></i>
      <span>{new BigNumber(props.rate).precision(10).toFormat()}</span>
      <span>{new BigNumber(props.volume).precision(10).toFormat(format)}</span>
      <span>
        {new BigNumber(props.aggregatedVolume).precision(10).toFormat(format)}
      </span>
    </StyledUl>
  );
}
