import * as React from "react";
import { Dispatch } from "redux";
import Link from 'gatsby-link';

import HeaderMenu from "./headerMenu";

import { Container } from "semantic-ui-react";


interface HeaderProps {
  pathname: string;
}

const Logo = () => (
  <Link
    to="/"
    style={{
      color: 'white',
      margin: 'auto 15px auto 0',
    }}
  >
    <h1>Lesley Lai 赖思理</h1>
  </Link>
);

const Header = ({ pathname }: HeaderProps) => (
  <header
    style={{
      background: '#1b1c1d'
    }}
  >

    <Container
      style={{
        margin: '0 auto',
        padding: '0.3rem 1.0875rem',
        display: 'flex',
      }}
    >
      <Logo />
      <HeaderMenu pathname={pathname} />
    </Container>
  </header>
);

export default Header;

