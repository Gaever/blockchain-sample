import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const lightModeFontColor = "#353945";

export default (mode) =>
  createTheme({
    typography: {
      fontFamily: "'DM Sans', sans-serif",
      subtitle1: {
        fontSize: 12,
        color: grey[500],
      },
      button: {
        fontWeight: 700,
        fontSize: 14,
        textTransform: "none",
        color: "white",
      },
    },
    palette: {
      mode,
      error: {
        main: "rgba(255, 102, 56, 1)",
        light: "#FFAC91",
        dark: "#CC471D",
        "200": "rgba(255, 102, 56, 0.05)",
        "300": "rgba(255, 102, 56, 0.1)",
      },
      primary: {
        main: "rgba(88, 189, 125, 1)",
        light: "rgba(88, 189, 125, 0.5)",
        dark: "#3a925a",
        "200": "rgba(88, 189, 125, 0.08)",
        "300": "rgba(88, 189, 125, 0.1)",
      },
      secondary: {
        main: "#FF6838",
        dark: "#CC471D",
        light: "#FFAC91",
      },
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            svg: {
              fill: "#777E90",
              "&:hover": {
                fill: mode === "dark" ? "#E6E8EC" : "#23262F",
              },
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#353945" : "#E6E8EC",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          button: {
            color: mode === "dark" ? "white !important" : `${lightModeFontColor} !important`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            "&.MuiButton-containedPrimary": {
              color: "white",
              "&:hover": {
                backgroundColor: "#3a925a !important",
              },
            },
          },
          outlined: {
            backgroundColor: "transparent",
            borderWidth: 0,
            textTransform: "unset",
            fontWeight: 700,
            "&.MuiButton-outlinedInfo": {
              border: "1px solid white !important",
              color: mode === "dark" ? "white !important" : `${lightModeFontColor} !important`,
              "&:hover": {
                backgroundColor: "white !important",
                color: "#353945 !important",
              },
            },
            "&.MuiButton-outlinedPrimary": {
              border: "1px solid rgba(88, 189, 125, 1) !important",
              color: "rgba(88, 189, 125, 1) !important",
              "&:hover": {
                backgroundColor: "rgba(88, 189, 125, 1) !important",
                color: "white !important",
              },
            },
            "&.MuiButton-outlinedSecondary": {
              border: "1px solid rgba(255, 102, 56, 1) !important",
              color: "rgba(255, 102, 56, 1) !important",
              "&:hover": {
                backgroundColor: "rgba(255, 102, 56, 1) !important",
                color: "white !important",
              },
            },
          },
          root: {
            boxShadow: "none",
            // backgroundColor: "#3772FF",
            borderRadius: 50,
            // color: "white",
            color: "#777E90",
            borderWidth: 0,
            height: 40,
            "&:hover": {
              // backgroundColor: "#2c56b8",
              backgroundColor: "transparent",

              color: mode === "dark" ? "#FCFCFD" : "#23262F",
              borderWidth: 0,
            },
            marginRight: "8px",
            "&.MuiButton-containedSecondary": {
              color: "white",
              "&:hover": {
                background: "#CC471D",
              },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderColor: mode === "dark" ? "#353945" : "#E6E8EC",
            borderRadius: "12px",
            marginTop: "24px",
            legend: {
              width: "0px",
            },
          },
          input: {
            padding: "12.5px 14px",
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          shrink: true,
          disableAnimation: true,
        },
        styleOverrides: {
          root: {
            transform: "translate(0px, -4px) scale(0.75)",
            fontWeight: "bold",
            textTransform: "uppercase",
          },
        },
      },
      MuiDialog: {
        defaultProps: {
          PaperProps: {
            sx: {
              borderRadius: "15px",
            },
          },
        },
      },
    },
  });
