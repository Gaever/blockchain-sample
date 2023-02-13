import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button, { ButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";

export type IMenuItem = { key: string; value: string };

export interface MenuDropdownProps {
  items: IMenuItem[];
  onSelect: (item: IMenuItem) => void;
  title: string;
  hideDropdownIcon?: boolean;
  ButtonSx?: ButtonProps["sx"];
}

function MenuDropdown(props: MenuDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (item?: IMenuItem) => {
    setAnchorEl(null);
    if (item) props.onSelect(item);
  };

  return (
    <div>
      <Button
        variant="text"
        disableElevation
        onClick={handleClick}
        endIcon={props.hideDropdownIcon ? null : <KeyboardArrowDownIcon />}
        sx={{
          color: (theme) => (theme.palette.mode === "dark" ? "#FCFCFD" : "#23262F"),
          ...props.ButtonSx,
        }}
      >
        {props.title}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        {props.items.map((item) => (
          <MenuItem onClick={() => handleClose(item)} disableRipple key={item.key}>
            {item.value}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default MenuDropdown;
