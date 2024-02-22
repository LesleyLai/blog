/*eslint sort-keys: "warn"*/

const en = {
  about: "About",
  blog: "Blog",
  home: "Home",
  langName: "English",
  notes: "Notes",
  portfolio: "Portfolio",
  tags: "Tags",
  talks: "Talks",
  untranslated: "(untranslated)",
};

export type Translations = typeof en;

export type TranslationKey = keyof Translations;

const zh: Translations = {
  about: "关于",
  blog: "博客",
  home: "主页",
  langName: "中文",
  notes: "笔记",
  portfolio: "个人项目",
  tags: "标签",
  talks: "演讲",
  untranslated: "（未翻译）",
};

export const translations = {
  en: en,
  zh: zh,
};

export type Language = keyof typeof translations;

export const languages = Object.keys(translations) as Language[];
