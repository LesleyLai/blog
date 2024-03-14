import { style } from "@vanilla-extract/css";

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

export const postDate = style({
  color: "#797979",
  textTransform: "uppercase",
  letterSpacing: ".5px",
  fontSize: "11px",
  lineHeight: 3,
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

export const blogPostH2 = style({
  fontSize: "24px",
  padding: "24px 0 12px",
  fontWeight: 700,
  margin: 0,
});

export const blogPostH3 = style({
  fontStyle: "italic",
  fontSize: "19px",
  fontWeight: "normal",
  padding: "24px 0 12px 0",
  margin: 0,
});

export const blogPostH4 = style({
  padding: "8px 0 4px 0",
  margin: 0,
});

export const blogPostParagraph = style({
  padding: "8px 0",
  margin: 0,
  selectors: {
    "p + &": {
      padding: "12px 0",
    },
  },
});
