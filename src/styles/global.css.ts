import { globalStyle } from "@vanilla-extract/css";

// CSS reset: https://www.joshwcomeau.com/css/custom-css-reset/

globalStyle(`*`, {
  // 1. Use a more-intuitive box-sizing model
  boxSizing: `border-box`,
  // 2. Remove default margin
  margin: 0,
});

globalStyle(`html, body`, {
  height: `100%`,
});

/*
  Typographic tweaks!
  3. Add accessible line-height
  4. Improve text rendering
*/
globalStyle(`body`, {
  lineHeight: 1.5,
  WebkitFontSmoothing: `antialiased`,
});

// 5. Improve media defaults
globalStyle(`img, picture, video, canvas, svg`, {
  display: `block`,
  maxWidth: `100%`,
});

// 6. Remove built-in form typography styles
globalStyle(`input, button, textarea, select`, {
  font: `inherit`,
});

// 7. Avoid text overflows
globalStyle(`p, h1, h2, h3, h4, h5, h6`, {
  overflowWrap: `break-word`,
});

// 8. Create a root stacking context
globalStyle(`#___gatsby`, {
  isolation: `isolate`,
});
