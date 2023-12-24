import type { GatsbyNode } from "gatsby";

import { Language, languages } from "./src/utils/translation";

const removeTrailingSlash = (path: string) => (path === `/` ? path : path.replace(/\/$/, ``));

export const onCreatePage: GatsbyNode["onCreatePage"] = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  //console.log(page.path);

  const path = removeTrailingSlash(page.path);

  // special page
  if (path.includes("dev-404-page")) {
    return;
  }

  // TODO: handle 404 pages?
  if (path.includes("404")) {
    return;
  }

  deletePage(page);

  const localizedRoot = (lang: Language) => (lang == "en" ? "/" : `/${lang}`);
  const getDateLocale = (lang: Language) => (lang === "zh" ? "ZH_CN" : lang);
  for (const lang of languages) {
    const localizedPath = page.path === "/" ? localizedRoot(lang) : `/${lang}${page.path}`;

    createPage({
      ...page,
      path: localizedPath,
      context: {
        lang: lang,
        dateLocale: getDateLocale(lang),
      },
    });
  }
};
