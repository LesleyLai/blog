import * as React from "react";

import Header from '../components/header';
import Head from '../components/head';

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


// Use `module.exports` to be compliante with `webpack-require` import method
export default class DefaultLayout
    extends React.PureComponent<DefaultLayoutProps, DefaultLayoutStates> {
    render() {
        const children = this.props.children();

        return (
            <html lang="en">
                <Head />
                <body>
                    <Header />
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
