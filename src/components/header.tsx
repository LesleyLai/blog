import * as React from "react";
import Link from 'gatsby-link';

const NavButton = props => (
    <div style={{
        display: 'inline-block',
        magrin: 0,
        padding: '0 10px'
    }}>
        <Link to={props.to} >
            {props.text}
        </Link>
    </div>
);

const NavBar = () => (
    <nav style={{
        listStyle: 'none',
        display: 'inline-block',
        height: '25px',
        width: '700px',
    }}>
        <div style={{ display: 'inline' }}>
            <NavButton to="/" text="Home" />
            <NavButton to="/archive" text="Archive" />
            <NavButton to="/projects" text="Projects" />
            <NavButton to="/about" text="About" />
        </div>
        <div style={{ display: 'inline', float: 'right' }}>
            <NavButton to="/" text="English" />
            <NavButton to="/" text="中文" />
        </div>
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

