import { style } from "@vanilla-extract/css";

export const header = style({
  color: "#fff",
  backgroundColor: "#000",
});

export const headerContainer = style({
  maxWidth: "1280px",
  display: "flex",
  padding: ".3rem 1.0875rem",
  margin: "0 auto",
});

export const title = style({
  margin: "auto 0",
  fontSize: "2em",
});

export const titleLink = style({
  color: "#fff",
  textDecoration: "none",
});

export const nav = style({
  display: "flex",
  flexGrow: "1",
  justifyContent: "space-between",
});

export const menuUL = style({
  listStyle: "none",
  display: "flex",
  margin: 0,
});

export const menuItem = style({
  display: "contents",
});

export const menuItemLink = style({
  color: "hsla(0,0%,100%,.8)",
  textDecoration: "none",
  padding: ".85714286em 1.14285714em",
  ":hover": {
    color: "#fff",
  },
});

export const menuItemLinkActive = style({
  color: "#fff",
  fontWeight: 700,
  borderBottom: "2px solid",
  borderColor: "#fff",
});
