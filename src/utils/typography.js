import Typography from "typography";
const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.666,
  bodyFontFamily: [
    "Lato",
    "Open Sans",
    "georgia",
    "Microsoft Yahei",
    "微软雅黑",
    "STXihei",
    "华文细黑"
  ],
  headerFontFamily: [
    "Avenir Next",
    "Open Sans",
    "georgia",
    "Microsoft Yahei",
    "微软雅黑",
    "STXihei",
    "华文细黑"
  ],
  includeNormalize: true,
  overrideStyles: ({ adjustFontSizeTo, rhythm }, options, styles) => ({
    'code[class*="language-"], pre[class*="language-"]': {
      fontFamily: [
        "Consolas",
        "Monaco",
        "Andale Mono",
        "Ubuntu Mono",
        "Microsoft Yahei",
        "微软雅黑",
        "monospace"
      ].join(",")
    }
  })
});

export default typography;
