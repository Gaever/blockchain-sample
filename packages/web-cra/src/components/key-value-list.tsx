import Grid from "@mui/material/Grid";
import Typography, { TypographyProps } from "@mui/material/Typography";

export interface KeyValueListItemProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  labelTypographyProps?: TypographyProps;
  valueTypographyProps?: TypographyProps;
  labelComponent?: React.ReactNode;
  valueComponent?: React.ReactNode;
}

export function KeyValueListItem(props: KeyValueListItemProps) {
  return (
    <Grid
      container
      sx={{ borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.200"), pt: 1, pb: 1 }}
    >
      <Grid item xs={6}>
        {props.label ? <Typography {...props.labelTypographyProps}>{props.label}</Typography> : null}
        {props.labelComponent}
      </Grid>
      <Grid item xs={6}>
        {props.value ? (
          <Typography sx={{ color: (theme) => theme.palette.grey[700] }} {...props.valueTypographyProps}>
            {props.value}
          </Typography>
        ) : null}
        {props.valueComponent}
      </Grid>
    </Grid>
  );
}

export interface KeyValueListProps {
  children: React.ReactNode;
}

export default function KeyValueList(props: KeyValueListProps) {
  return (
    <Grid container>
      <Grid item xs={12}>
        {props.children}
      </Grid>
    </Grid>
  );
}
