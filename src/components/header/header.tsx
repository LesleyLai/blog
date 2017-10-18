import * as React from "react";
import Link from 'gatsby-link';

import NavMenu from "../menu"

/* 
 * const NavBar = ({ items, pathname }) => (
 *     <Menu as="nav" secondary inverted pointing size="large">
 * 
 *         <Menu.Item as="a" className="mobile only" icon="sidebar" />
 * 
 *         {items.map((item) => {
 *             const active: boolean = (item.exact) ?
 *                 pathname === item.path :
 *                 pathname.startsWith(item.path);
 * 
 *             return (<Menu.Item
 *                 as={Link}
 *                 name={item.name}
 *                 to={item.path}
 *                 key={item.path}
 *                 active={active}
 *                 className="mobile hidden"
 *             />);
 * 
 *         })}
 * 
 * 
 *     </Menu>
 * );
 * */

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
        <h1>Lesley Lai</h1>
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
                maxWidth: 960,
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

