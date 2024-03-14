import { createThemeContract, createTheme } from "@vanilla-extract/css";

const SYSTEM_FONT_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export const colors = {
  black: "#000",
  white: "#fff",
  copper50: "#fbfaf7",
  copper100: "#e8e5e2",
  copper200: "#e9d1b6",
  copper300: "#d8b388",
  copper400: "#cfa471",
  copper500: "#c5955a",
  copper600: "#bb8744",
  copper700: "#b1792c",
  copper800: "#a15e00",
  copper900: "#704303",
};

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1200,
};

export const vars = createThemeContract({
  colors: {
    background: "",
    contentBackground: "",
    blogSidebar: {
      color: "",
      background: "",
      link: "",
    },
  },
  font: {
    body: "",
  },
});

const commonVars = {
  font: {
    body: SYSTEM_FONT_STACK,
  },
};

export const lightThemeClass = createTheme(vars, {
  colors: {
    background: colors.copper100,
    contentBackground: colors.white,
    blogSidebar: {
      color: colors.copper900,
      background: colors.copper50,
      link: colors.copper800,
    },
  },
  ...commonVars,
});
