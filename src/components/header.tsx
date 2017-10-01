import * as React from "react";
import Link from 'gatsby-link';

const NavButton = props => (
    <li style={{
        display: 'inline-block',
        magrin: 0,
        padding: '0 10px'
    }}>
        <Link to={props.to} >
            {props.text}
        </Link>
    </li>
);

const NavBar = () => (
    <nav style={{
        listStyle: 'none',
        display: 'inline-block',
        height: '25px'
    }}>
        <ul>
            <NavButton to="/" text="Home" />
            <NavButton to="/archive" text="Archive" />
            <NavButton to="/projects" text="Projects" />
            <NavButton to="/about" text="About" />
            <NavButton to="/contact" text="Contact" />
        </ul>
    </nav>
);

const Header = () => (
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
            <NavBar />
        </div>
    </header>
);

export default Header;

