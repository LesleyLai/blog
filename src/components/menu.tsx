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
      en: { title: "Archive", path: "/archive" },
      zh: { title: "博文目录", path: "/zh/archive" }
    },
    exact: false
  },
  projects: {
    langs: {
      en: { title: "Projects", path: "/projects" },
      zh: { title: "个儿项目", path: "/zh/projects" }
    },
    exact: false
  },
  talks: {
    langs: {
      en: { title: "Talks", path: "/talks" },
      zh: { title: "演讲", path: "/zh/talks" }
    },
    exact: true
  }
};
