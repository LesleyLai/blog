import * as React from "react";
import Link from 'gatsby-link';
import { Menu, Icon, Container } from "semantic-ui-react";

import { MenuProps } from "../menu"

const NavBar = ({ items, pathname }: MenuProps) => (
    <nav>
        <Menu.Item as="a" className="mobile only" icon="sidebar" />

        <Menu size="large" className="mobile hidden">

            {items.map((item) => {
                const active: boolean = (item.exact) ? pathname === item.path : pathname.startsWith(item.path);
                return <Menu.Item
                    as={Link}
                    name={item.name}
                    to={item.path}
                    key={item.path}
                    active={active}
                />;
            })}
        </Menu>
    </nav >
);

const Header = ({ items, pathname }: MenuProps) => (
    <header
        style={{
            background: 'DarkGrey',
            marginBottom: '1.45rem',
        }}
    >

        <div
            style={{
                margin: '0 auto',
                maxWidth: 960,
                padding: '0.3rem 1.0875rem',
            }}
        >
            <h1 style={{
                margin: 0,
                display: 'inline'
            }}>
                <Link
                    to="/"
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                    }}
                >
                    Lesley Lai
                </Link>
            </h1>
            <NavBar items={items} pathname={pathname} />
        </div>
    </header>
);

export default Header;

