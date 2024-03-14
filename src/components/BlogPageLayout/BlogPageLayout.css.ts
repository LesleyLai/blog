import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/theme.css";
import { pageContainer } from "../../styles/container.css";

export const blogContainer = style([
  pageContainer,
  {
    display: "flex",
    flex: "1",
  },
]);

export const main = style({
  backgroundColor: vars.colors.contentBackground,
  padding: "1rem",
  width: "calc(100% - 250px)",
});
