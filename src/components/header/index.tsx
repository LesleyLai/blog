import Link from "gatsby-link";
import * as React from "react";

import HeaderMenu from "./headerMenu";

const style = require("./header.module.css");

interface HeaderProps {
  pathname: string;
}

const Logo = () => (
  <Link to="/" className={style.logo}>
    <h2>Lesley Lai 赖思理</h2>
  </Link>
);

const Header = ({ pathname }: HeaderProps) => {
  return (
    <header className={style.header}>
      <div className={style["header-container"]}>
        <Logo />
        <HeaderMenu pathname={pathname} />
      </div>
    </header>
  );
};

export default Header;
