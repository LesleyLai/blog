import * as React from "react";
import { Sidebar, Segment, Menu, Container, Grid } from "semantic-ui-react";
import Helmet from "react-helmet";

import Header from '../components/header';
import SideMenu from '../components/sideMenu';
import AboutMe from '../components/about/aboutme';

import 'semantic-ui-css/semantic.min.css';
import '../style/responsive.css';

require('../style/highlight.css');

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
    const layout = require("./layout.module.css");

    const pathname = this.props.location.pathname;
    const visible = true;

    return (
      <div>
        <Helmet>
          <title>Lesley Lai</title>
          <html lang="en" />
        </Helmet>
        <Header pathname={pathname} />
        <Sidebar.Pushable>
          <SideMenu visible={visible} pathname={pathname} />
          <Sidebar.Pusher>
            <Grid container className={layout.grid}>
              <Grid.Column as="main" mobile={16} tablet={10} computer={12} largeScreen={13} className={layout.main}>
                {children}
              </Grid.Column>

              <Grid.Column mobile={16} tablet={6} computer={4} largeScreen={3}>
                <AboutMe />
              </Grid.Column>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
};
