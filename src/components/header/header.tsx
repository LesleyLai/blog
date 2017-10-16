import * as React from "react";
import Link from 'gatsby-link';
import { Menu, Icon, Container } from "semantic-ui-react";

import { MenuProps } from "../menu"

const NavBar = ({ items, pathname }: MenuProps) => (
    <nav>
        <Menu as="nav" secondary size="large">

            <Menu.Item as="a" className="mobile only" icon="sidebar" />

            {items.map((item) => {
                 const active: boolean = (item.exact) ? pathname === item.path : pathname.startsWith(item.path);
                 return <Menu.Item
                     as={Link}
                     name={item.name}
                     to={item.path}
                     key={item.path}
                     active={active}
                     className="mobile hidden"
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
                display: 'flex',
            }}
        >
            <Link
                to="/"
                style={{
                    color: 'white',
                    textDecoration: 'none',
                    marginRight: '15px',
                }}
            >
                <h1>Lesley Lai</h1>
            </Link>
            <NavBar items={items} pathname={pathname} />
        </div>
    </header>
);

export default Header;

