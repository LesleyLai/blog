import * as React from "react";

import { Container } from "semantic-ui-react";

import Header from '../components/header/header';
import Head from '../components/head';
import AboutMe from '../components/about/aboutme';

import 'semantic-ui-css/semantic.min.css';
import '../style/responsive.css';

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
            <main>
                <Head />
                <Header pathname={this.props.location.pathname} />
                <Container style={{
                    margin: '0 auto',
                    padding: '0.3rem 1.0875rem',
                    display: 'flex',
                }}>
                    <Container fluid style={{ width: '1000px', fontSize: "16px" }}>
                        {children}
                    </Container>
                    <AboutMe />
                </Container>
            </main>
        );
    }
};
