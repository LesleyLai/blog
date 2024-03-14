import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const layoutClass = style({
  backgroundColor: vars.colors.background,
  fontFamily: vars.font.body,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});
