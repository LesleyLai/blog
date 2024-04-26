import type { AstroGlobal } from "astro";

export type Language = "en" | "zh";

export const languages = ["en", "zh"] as Language[];

// Check whether a string is a valid language code
export const isLanguage = (str: string): str is Language => (languages as string[]).includes(str);

// Get the language code for the current page
export const getCurrentLanguage = (astro: AstroGlobal): Language => {
  let lang = astro.currentLocale ?? "en";
  if (!isLanguage(lang)) {
    throw new Error(`${lang} is not a recognized language`);
  }
  return lang;
};
