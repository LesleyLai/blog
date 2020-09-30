import * as React from "react";
import Helmet from "react-helmet";

import AboutMe from "../about/aboutme";
import Header from "../header";
import { TagItem } from "../../types/tags";

import { Language, languages } from "../../utils/translations";

import "../../style/global.css";
import "../../style/highlight.css";

interface DefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location: {
    pathname: string;
  };
  lang: Language;
  otherLangs?: Language[]; // Indicates if other language versions of the same page exist. If not provided, assume all other language pages exist
  tags: TagItem[];
  children: React.ReactNode;
  postsTotalCount: number;
}

// Use `module.exports` to be compliante with `webpack-require` import method
export default class Layout extends React.PureComponent<DefaultLayoutProps> {
  public render() {
    const children = this.props.children;
    const style = require("./layout.module.css");

    const pathname = this.props.location.pathname;
    const lang = this.props.lang;
    const tags = this.props.tags;

    const otherLangs = (() => {
      if (this.props.otherLangs) return this.props.otherLangs;

      return languages.filter(otherLang => otherLang !== lang);
    })();

    return (
      <div>
        <Helmet>
          <title>Lesley Lai</title>
          <html lang={lang} />
        </Helmet>
        <Header pathname={pathname} lang={lang} otherLangs={otherLangs} />
        <div className={style.layout}>
          <div className={style.grid}>
            <main className={style.main}>{children}</main>
            <nav className={style.about}>
              <AboutMe lang={lang} tags={tags} postsTotalCount={this.props.postsTotalCount} />
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
