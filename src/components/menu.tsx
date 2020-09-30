interface MenuItemLang {
  path: string;
}

interface MenuItemLangs extends Record<string, MenuItemLang> {
  en: MenuItemLang;
  zh: MenuItemLang;
}

export interface MenuModel {
  langs: MenuItemLangs;
  exact: boolean;
  inverted?: boolean;
}

export const menuModel: { [key: string]: MenuModel } = {
  home: {
    langs: {
      en: { path: "/" },
      zh: { path: "/zh" },
    },
    exact: true,
  },
  archive: {
    langs: {
      en: { path: "/en/archive" },
      zh: { path: "/zh/archive" },
    },
    exact: false,
  },
  projects: {
    langs: {
      en: { path: "/en/projects" },
      zh: { path: "/zh/projects" },
    },
    exact: false,
  },
  talks: {
    langs: {
      en: { path: "/en/talks" },
      zh: { path: "/zh/talks" },
    },
    exact: true,
  },
};
