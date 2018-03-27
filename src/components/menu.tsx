import * as React from "react";

export interface MenuModel {
  en: string;
  path: string;
  exact: boolean;
  icon?: string;
  inverted?: boolean;
}

export const menuModel: { [key: string]: MenuModel } = {
  home: { en: "Home", path: "/", exact: true, icon: "home" },
  blog: { en: "Archive", path: "/archive/", exact: false, icon: "archive" },
  portfolio: { en: "Portfolio", path: "/projects", exact: true, icon: "image" }
  //cv: { en: "CV", path: "/resume", exact: true, icon: "info circle" },
  //teaching: { en: "Teaching", path: "/teaching", exact: true, icon: "info circle" },
};
