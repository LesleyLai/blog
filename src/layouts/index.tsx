import * as React from "react";

import Header from '../components/header/header';
import Head from '../components/head';

import 'semantic-ui-css/semantic.min.css';
import '../style/responsive.css';

import { MenuProps } from "../components/menu"

try {
    require('../style/highlight.css');
} catch (e) {
    console.log(e)
}

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
    location: {
        pathname: string;
    };
    children: any;
}


interface DefaultLayoutStates {
    //sidebarVisible: boolean;
}

const menuItems = [
    { name: "Home", path: "/", exact: true, icon: "home", inverted: true },
    { name: "Blog", path: "/archive/", exact: false, icon: "newspaper" },
    { name: "Projects", path: "/projects/", exact: false, icon: "newspaper" },
    { name: "About", path: "/about/", exact: true, icon: "info circle" },
];

// Use `module.exports` to be compliante with `webpack-require` import method
export default class DefaultLayout
extends React.PureComponent<DefaultLayoutProps, DefaultLayoutStates> {
    render() {
        const children = this.props.children();

        return (
            <main lang="en">
                <Head />
                <Header items={menuItems} pathname={this.props.location.pathname} />
                <section style={{
                    margin: '0 auto',
                    maxWidth: 960,
                    padding: '0.3rem 1.0875rem',
                }}>
                    {children}
                </section>
            </main>
        );
    }
};
