import { Icon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import LogoDarkSvg from "../assets/logo-dark.svg";
import LogoLightSvg from "../assets/logo-light.svg";
import { pages } from "./header-toolbar";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTopColor: theme.palette.mode === "dark" ? "#23262F" : "#E6E8EC",
        borderTopWidth: 1,
        borderTopStyle: "solid",
      }}
    >
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1120px",
        }}
      >
        <Grid item md={2} xs={12} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Link href={process.env.REACT_APP_HREF_ROOT || "/"} underline="none" color="inherit">
            <IconButton
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pt: { md: "40px", xs: "33px" },
                pb: { md: "40px", xs: "33px" },
                pl: 0,
                pr: 0,
              }}
              disableRipple
            >
              <Icon sx={{ width: "auto", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box component="img" sx={{ width: "100%" }} src={theme.palette.mode === "dark" ? LogoDarkSvg : LogoLightSvg} />
              </Icon>
            </IconButton>
          </Link>
        </Grid>

        <Grid item md={8} xs={12} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: { xs: "280px", md: "100%" } }}>
            {pages.map((page) => (
              <Link href={page.href} underline="none" color="inherit">
                <Box
                  component="span"
                  sx={{
                    fontSize: "14px",
                    display: "block",
                    color: "#777E90",
                    "&:hover": { color: theme.palette.mode === "dark" ? "white" : "#353945" },
                    minWidth: "auto",
                    fontWeight: 700,
                    mr: { xs: "0px", md: "48px" },
                    pr: { xs: "12px", md: "0px" },
                    pl: { xs: "12px", md: "0px" },

                    pb: { xs: "32px", md: "0px" },
                    pt: 0,
                  }}
                >
                  {page.title}
                </Box>
              </Link>
            ))}
          </Box>
        </Grid>

        <Grid item md={2} xs={12} sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
          <Typography
            sx={{
              color: "#777E90",
              fontSize: "12px",
              pb: { xs: "52px", md: "0px" },
            }}
          >
            Copyright © {new Date().getFullYear()}
            <br /> All rights reserved
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
