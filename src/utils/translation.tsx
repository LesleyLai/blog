/*eslint sort-keys: "warn"*/

const en = {
  about: "About",
  blog: "Blog",
  home: "Home",
  langName: "English",
  portfolio: "Portfolio",
  talks: "Talks",
};

export type Translations = typeof en;

export type TranslationKey = keyof Translations;

const zh: Translations = {
  about: "关于",
  blog: "博客",
  home: "主页",
  langName: "中文",
  portfolio: "个人项目",
  talks: "演讲",
};

export const translations = {
  en: en,
  zh: zh,
};

export type Language = keyof typeof translations;

export const languages = Object.keys(translations) as Language[];
