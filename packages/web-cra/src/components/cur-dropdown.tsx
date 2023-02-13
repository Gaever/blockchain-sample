import { StockListItem } from "@ctocker/lib/build/main/src/types/stock";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import _upperCase from "lodash/upperCase";
import * as React from "react";

export interface CurDropdownProps {
  activeStock?: StockListItem;
  stocks: StockListItem[];
  onChangeStock: (stockId: string) => void;
}

export default function CurDropdown(props: CurDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button id="basic-button" aria-controls="basic-menu" aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleClick}>
        {props.activeStock?.title} ({[props?.activeStock?.cur1, props.activeStock?.cur2]?.map(_upperCase)?.join?.(" / ") || ""})
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props?.stocks?.map?.((stock) => (
          <MenuItem
            key={stock.id}
            onClick={() => {
              props.onChangeStock(`${stock.id}`);
              handleClose();
            }}
          >
            {stock?.title} ({[stock.cur1, stock.cur2].map(_upperCase).join(" / ")})
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
