import { convert } from "html-to-text";

export const generateExcerpt = (html: string) => {
  // See https://chenhuijing.com/blog/creating-excerpts-in-astro/

  const excerptLength = 300;

  const options = {
    wordwrap: null,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
      { selector: "figure", format: "skip" },
    ],
  };

  const text = convert(html, options);
  const distilled = convert(text, options);

  const excerpt = `${distilled.substring(0, excerptLength)}..`;

  return excerpt;
};
