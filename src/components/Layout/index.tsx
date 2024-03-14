import * as React from "react";

import "../../styles/global.css";

import Header from "../Header";
import { Language } from "../../utils/translation";

import { lightThemeClass } from "../../styles/theme.css";
import { layoutClass } from "./Layout.css";

type LayoutProps = {
  lang: Language;
  path: string;
  children?: React.ReactNode;
};

export default function Layout({ lang, path, children }: LayoutProps) {
  return (
    <div id="theme-wrapper" className={`${lightThemeClass} ${layoutClass}`}>
      <Header lang={lang} path={path} />
      {children}
    </div>
  );
}
