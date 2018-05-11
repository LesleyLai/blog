import * as React from "react";

export interface MenuModel {
  en: string;
  path: string;
  exact: boolean;
  inverted?: boolean;
}

export const menuModel: { [key: string]: MenuModel } = {
  home: { en: "Home", path: "/", exact: true },
  blog: { en: "Archive", path: "/archive/", exact: false },
  portfolio: { en: "Portfolio", path: "/projects", exact: true }
};
