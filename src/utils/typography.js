import Typography from "typography";
const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.666,
  bodyFontFamily: ["PT Sans", "Noto Sans SC"],
  headerFontFamily: ["PT Serif", "Noto Serif SC"],
  includeNormalize: true,
  overrideStyles: ({ _adjustFontSizeTo, _rhythm }, _options, _styles) => ({
    'code[class*="language-"], pre[class*="language-"]': {
      fontFamily: ["PT Mono", "Noto Sans SC"].join(",")
    }
  })
});

export default typography;
