import * as React from "react";
import Helmet from "react-helmet";
import { Grid, Menu, Segment, Sidebar } from "semantic-ui-react";

import AboutMe from "../components/about/aboutme";
import Header from "../components/header";
import SideMenu from "../components/sideMenu";

import "../style/global.css";
import "../style/highlight.css";

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location: {
    pathname: string;
  };
  children: any;
}

// Use `module.exports` to be compliante with `webpack-require` import method
export default class DefaultLayout extends React.PureComponent<
  DefaultLayoutProps
> {
  public render() {
    const children = this.props.children();
    const layout = require("./layout.module.css");

    const pathname = this.props.location.pathname;

    return (
      <div>
        <Helmet>
          <title>Lesley Lai</title>
          <html lang="en" />
        </Helmet>
        <Header pathname={pathname} />
        <div className={layout.layout}>
          <div className={layout.grid}>
            <main className={layout.main}>{children}</main>

            <div className={layout.about}>
              <AboutMe />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
