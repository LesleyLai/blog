import Link from "gatsby-link";
import * as React from "react";

import HeaderMenu from "./headerMenu";

import { Container } from "semantic-ui-react";

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
      <Container className={style["header-container"]}>
        <Logo />
        <HeaderMenu pathname={pathname} />
      </Container>
    </header>
  );
};

export default Header;
