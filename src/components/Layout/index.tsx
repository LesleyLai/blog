import * as React from "react";

import "../../styles/global.css";

import Header from "../Header";
import { Language } from "../../utils/translation";

type LayoutProps = {
  lang: Language;
  path: string;
  children?: React.ReactNode;
};

export default function Layout({ lang, path, children }: LayoutProps) {
  return (
    <>
      <Header lang={lang} path={path} />
      {children}
    </>
  );
}
