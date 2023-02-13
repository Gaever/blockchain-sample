import CloseIcon from "@/components/close-icon";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Divider, Icon, Menu, MenuItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { useContext, useState } from "react";
import { ColorModeContext } from "../App";
import BurgerDarkSvg from "../assets/burger-dark.svg";
import BurgerLightSvg from "../assets/burger-light.svg";
import LogoDarkSvg from "../assets/logo-dark.svg";
import LogoLightSvg from "../assets/logo-light.svg";
import useToolbar, { curs, langs } from "../hooks/use-toolbar";
import KeyValueList, { KeyValueListItem } from "./key-value-list";
import MenuDropdown from "./menu-dropdown";
import Toolbar from "./toolbar/toolbar";

export const pages = [
  { title: "Home", href: process.env.REACT_APP_HREF_ROOT || "/" },
  { title: "Market", href: process.env.REACT_APP_HREF_MARKET || "#" },
  { title: "Wallet", href: process.env.REACT_APP_HREF_WALLET || "#" },
  { title: "Explorer", href: process.env.REACT_APP_HREF_EXPLORER || "#" },
  { title: "Trades", href: process.env.REACT_APP_HREF_TRADES || "#" },
  { title: "News", href: process.env.REACT_APP_HREF_NEWS || "#" },
];

export default function HeaderToolbar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { curValue, langValue, changeCur, changeLang } = useToolbar();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <Toolbar BoxProps={{ sx: { height: "81px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Link href={process.env.REACT_APP_HREF_ROOT || "/"} underline="none" color="inherit">
              <IconButton
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: { md: "24px", xs: "20px" },
                  pb: { md: "24px", xs: "20px" },
                  pl: { md: "40px", xs: "20px" },
                  pr: { md: "40px", xs: "20px" },
                }}
                disableRipple
              >
                <Icon sx={{ width: "auto", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Box component="img" sx={{ width: "100%" }} src={theme.palette.mode === "dark" ? LogoDarkSvg : LogoLightSvg} />
                </Icon>
              </IconButton>
            </Link>
            <Divider sx={{ height: "40px", mr: "40px", display: { md: "flex", xs: "none" } }} orientation="vertical" />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link href={page.href} underline="none" color="inherit">
                  <Box
                    component="span"
                    sx={{
                      fontSize: "14px",
                      p: 0,
                      mr: "48px",
                      display: "block",
                      color: "#777E90",
                      "&:hover": {
                        color: theme.palette.mode === "dark" ? "white" : "#353945",
                      },
                      minWidth: "auto",
                      fontWeight: 700,
                    }}
                  >
                    {page.title}
                  </Box>
                </Link>
              ))}
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ mr: "40px" }}>
              <MenuDropdown items={curs} title={curValue} onSelect={(item) => changeCur(item.key)} />
            </Box>
            <Box sx={{ mr: "40px" }}>
              <MenuDropdown items={langs} title={langValue} onSelect={(item) => changeLang(item.key)} />
            </Box>
            <Box sx={{ mr: "40px" }}>
              <IconButton onClick={handleOpenSettings}>
                <SettingsOutlinedIcon />
              </IconButton>
            </Box>
          </Stack>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: "25px" }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit" disableRipple sx={{ p: 0 }}>
              <Icon sx={{ width: "auto", height: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box component="img" sx={{ width: "100%" }} src={theme.palette.mode === "dark" ? BurgerDarkSvg : BurgerLightSvg} />
              </Icon>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Link href={page.href} underline="none" color="inherit">
                    <Typography textAlign="center">{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
              <Stack alignItems="center" justifyContent="center">
                <IconButton
                  onClick={() => {
                    handleCloseNavMenu();
                    handleOpenSettings();
                  }}
                  sx={{
                    "& svg": {
                      fill: (theme) => (theme.palette.mode === "dark" ? "white" : "black"),
                    },
                  }}
                >
                  <SettingsOutlinedIcon />
                </IconButton>
              </Stack>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
      <Dialog onClose={handleCloseSettings} open={isSettingsOpen} fullWidth>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <DialogTitle sx={{ fontWeight: "bold" }}>Settings</DialogTitle>
          <Box sx={{ m: 3 }}>
            <CloseIcon onClick={handleCloseSettings} />
          </Box>
        </Stack>
        <Box
          sx={{
            m: 3,
            mt: 0,
            "& .MuiButton-root": {
              justifyContent: "flex-start",
              p: 0,
              height: "auto",
              fontWeight: 400,
              fontSize: "1rem",
            },
          }}
        >
          <KeyValueList>
            <KeyValueListItem label="Display currency" valueComponent={<MenuDropdown items={curs} title={curValue} onSelect={(item) => changeCur(item.key)} />} />
            <KeyValueListItem label="Language" valueComponent={<MenuDropdown items={langs} title={langValue} onSelect={(item) => changeLang(item.key)} />} />
            <KeyValueListItem
              label="Theme"
              valueComponent={
                <MenuDropdown
                  items={[
                    { key: "light", value: "Light" },
                    { key: "dark", value: "Dark" },
                  ]}
                  title={theme.palette.mode === "dark" ? "Dark" : "Light"}
                  onSelect={(item) => {
                    if (item.key !== theme.palette.mode) {
                      colorMode.toggleColorMode();
                    }
                  }}
                />
              }
            />
            <KeyValueListItem
              labelComponent={
                <Link
                  href={process.env.REACT_APP_HREF_TERMS || "#"}
                  underline="none"
                  sx={{ color: "inherit", "&:hover": { color: (theme) => (theme.palette.mode === "dark" ? "white" : "black") } }}
                >
                  Terms and privacy
                </Link>
              }
            />
          </KeyValueList>
        </Box>
      </Dialog>
    </>
  );
}
