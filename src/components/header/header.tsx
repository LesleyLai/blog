import * as React from "react";
import Link from 'gatsby-link';

import NavMenu from "../menu";

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
            background: '#1b1c1d',
            marginBottom: '1.45rem',
        }}
    >

        <Container
            style={{
                margin: '0 auto',
                maxWidth: 1200,
                padding: '0.3rem 1.0875rem',
                display: 'flex',
            }}
        >
            <Logo />
            <NavMenu pathname={pathname} />
        </Container>
    </header>
);

export default Header;

