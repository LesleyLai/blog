import * as React from "react";
import { Dispatch } from "redux";
import Link from 'gatsby-link';

import HeaderMenu from "./headerMenu";

import { Container } from "semantic-ui-react";

const style = require("./header.module.css");

interface HeaderProps {
  pathname: string;
  toggleSideBar: any;
}

const Logo = () => (
  <Link to="/" className={style.logo} >
    <h1>Lesley Lai 赖思理</h1>
  </Link>
);

const Header = ({ pathname, toggleSideBar }: HeaderProps) => {
  return (
    <header className={style.header} >
      <Container className={style.container}>
        <Logo />
        <HeaderMenu pathname={pathname} toggleSideBar={toggleSideBar} />
      </Container>
    </header>
  );
};

export default Header;

