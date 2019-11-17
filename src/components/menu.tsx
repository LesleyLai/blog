interface MenuItemLang {
  title: string;
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
      en: { title: "Home", path: "/" },
      zh: { title: "主页", path: "/zh" }
    },
    exact: true
  },
  archive: {
    langs: {
      en: { title: "Archive", path: "/archive/en" },
      zh: { title: "博文目录", path: "/archive/zh" }
    },
    exact: false
  },
  projects: {
    langs: {
      en: { title: "Projects", path: "/projects/en" },
      zh: { title: "个儿项目", path: "/projects/zh" }
    },
    exact: false
  },
  talks: {
    langs: {
      en: { title: "Talks", path: "/talks/en" },
      zh: { title: "演讲", path: "/talks/zh" }
    },
    exact: true
  }
};
