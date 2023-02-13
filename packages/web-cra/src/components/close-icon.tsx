import MuiCloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

function CloseIcon(props: { onClick: () => void }) {
  return (
    <IconButton
      onClick={props.onClick}
      sx={{
        borderRadius: 9999,
        borderStyle: "solid",
        borderColor: (theme) => (theme.palette.mode === "dark" ? "#777E90" : "#e6e6e6"),
        borderWidth: "1px",
        padding: "2px",
        svg: {
          fill: (theme) => (theme.palette.mode === "dark" ? "#E6E8EC" : "#353945"),
          fontSize: "1.3rem",
        },
      }}
    >
      <MuiCloseIcon />
    </IconButton>
  );
}

export default CloseIcon;
