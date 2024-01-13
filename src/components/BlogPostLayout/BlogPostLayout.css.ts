import { style } from "@vanilla-extract/css";

export const postMain = style({
  maxWidth: "950px",
});

export const postTitle = style({
  fontSize: "36px",
  lineHeight: "48px",
  fontWeight: 400,
  margin: "100px 0",
});

export const postInfo = style({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
  borderBottom: "1px solid #eee",
  paddingBottom: "4px",
});

export const tagList = style({
  display: "flex",
  listStyle: "none",
  padding: 0,
});

export const tagListItem = style({
  margin: "0.2em 0.5em 0.2em 0",
});

export const tagBox = style({
  padding: "0.4em 0.5em",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "10px",
  borderRadius: "0.28571429rem",
  color: "#fff",
  backgroundColor: "#2dabf9",
  ":hover": {
    backgroundColor: "#0688fa",
  },
});
