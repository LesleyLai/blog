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
      zh: { path: "/zh" }
    },
    exact: true
  },
  archive: {
    langs: {
      en: { path: "/archive/en" },
      zh: { path: "/archive/zh" }
    },
    exact: false
  },
  projects: {
    langs: {
      en: { path: "/projects/en" },
      zh: { path: "/projects/zh" }
    },
    exact: false
  },
  talks: {
    langs: {
      en: { path: "/talks/en" },
      zh: { path: "/talks/zh" }
    },
    exact: true
  }
};
