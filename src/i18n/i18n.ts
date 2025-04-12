import type { AstroGlobal } from "astro";
import { getRelativeLocaleUrl } from "astro:i18n";

export type Language = "en" | "zh";

export const languages = ["en", "zh"] as Language[];

// Check whether a string is a valid language code
export const isLanguage = (str: string): str is Language => (languages as string[]).includes(str);

// Get the language code for the current page
export const getCurrentLanguage = (astro: AstroGlobal): Language => {
  const lang = astro.currentLocale ?? "en";
  if (!isLanguage(lang)) {
    throw new Error(`${lang} is not a recognized language`);
  }
  return lang;
};

export const langFromSlug = (slug: string): Language => {
  const lang = slug.split("/")[1];
  if (!isLanguage(lang)) {
    throw new Error(`Unknown language contained in url ${slug}`);
  }

  return lang;
};

// Transform the slug from "id/lang" to "lang/id"
export const transformSlug = (slug: string): string => {
  const [id, lang] = slug.split("/");
  return `${lang}/${id}`;
};


// Given a slug (e.g. /en/hello-world), returns the version in the other language (e.g. /zh/hello-world)
export const getOtherLangSlug = (lang: Language, otherLang: Language, slug: string): string => {
  const path = slug.replace(`\/${lang}`, "");


  let otherLangSlug = getRelativeLocaleUrl(otherLang, path);
  if (otherLangSlug == "/en" || otherLangSlug == "/en/") {
    otherLangSlug = "/";
  }

  return otherLangSlug;
};