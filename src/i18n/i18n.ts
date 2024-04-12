export type Language = "en" | "zh";

export const languages = ["en", "zh"] as Language[];

export const isLanguage = (str: string): str is Language => (languages as string[]).includes(str);

export const oppositeLang: Record<Language, Language> = {
  en: "zh",
  zh: "en",
};

export const langName: Record<Language, string> = {
  en: "English",
  zh: "中文",
};
