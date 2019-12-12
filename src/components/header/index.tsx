import Link from "gatsby-link";
import * as React from "react";

import HeaderMenu from "./headerMenu";

import { Language } from "../../utils/translations";
import { menuModel } from "../menu";

const style = require("./header.module.css");

interface HeaderProps {
  pathname: string;
  lang: Language;
  otherLangs: Language[];
}

const Logo = ({ lang }: { lang: Language }) => (
  <Link to={menuModel.home.langs[lang].path} className={style.logo}>
    <h2>Lesley Lai 赖思理</h2>
  </Link>
);

const Header = ({ pathname, lang, otherLangs }: HeaderProps) => {
  return (
    <header className={style.header}>
      <div className={style.headerContainer}>
        <Logo lang={lang} />
        <HeaderMenu pathname={pathname} lang={lang} otherLangs={otherLangs} />
      </div>
    </header>
  );
};

export default Header;
