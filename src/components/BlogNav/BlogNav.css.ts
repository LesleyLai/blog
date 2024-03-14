import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const blogNav = style({
  width: "250px",
  minWidth: "250px",
  padding: "1rem",
  fontSize: "13px",
  color: vars.colors.blogSidebar.color,
  backgroundColor: vars.colors.blogSidebar.background,
});

export const heading = style({
  fontSize: "13px",
  fontWeight: 400,
  margin: "24px 0 4px",
  color: "#655e54",
  textTransform: "uppercase",
  letterSpacing: "1px",
});

export const ul = style({
  margin: 0,
  padding: "0 0 0 1.666rem",
});

export const link = style({
  color: vars.colors.blogSidebar.link,
  textDecoration: "none",
  ":hover": {
    color: "#e18e18",
  },
});

export const postCount = style({
  backgroundColor: "#f2ede8",
  marginLeft: "6px",
  padding: "0 3px",
  borderRadius: "4px",
});

export const archive = style({
  fontStyle: "italic",
  paddingTop: "6px",
  paddingLeft: "24px",
});
