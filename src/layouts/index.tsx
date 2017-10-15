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
            <html lang="en">
                <Head />
                <body>
                    <Header items={menuItems} pathname={this.props.location.pathname} />
                    <main style={{
                        margin: '0 auto',
                        maxWidth: 960,
                    }}>
                        {children}
                    </main>
                </body>
            </html>
        );
    }
};
