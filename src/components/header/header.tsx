import * as React from "react";
import Link from 'gatsby-link';

import NavMenu from "../menu"

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

        <section
            style={{
                margin: '0 auto',
                maxWidth: 1200,
                padding: '0.3rem 1.0875rem',
                display: 'flex',
            }}
        >
            <Logo />
            <NavMenu pathname={pathname} />
        </section>
    </header>
);

export default Header;

