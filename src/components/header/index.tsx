import Link from "gatsby-link";
import * as React from "react";
import Helmet from "react-helmet";
import classnames from "classnames";

import { Language, Translations, translations } from "../../utils/translations";
import { MenuModel, menuModel } from "../menu";
import Search from "../search";

const css = require("./header.module.css");

const Logo = ({ lang }: { lang: Language }) => (
  <Link to={menuModel.home.langs[lang].path} className={css.logo}>
    <h2>
      Lesley Lai <span lang="zh">赖思理</span>
    </h2>
  </Link>
);

const searchIndices = (lang: Language) => [
  { name: `LesleyBlogPosts${lang}`, title: "Blog Posts", hitComp: "PostHit" },
];

interface MenuItemProp extends React.HTMLProps<HTMLDivElement> {
  itemName: keyof Translations;
  lang: Language;
}

const MenuItem: React.FunctionComponent<MenuItemProp> = ({ itemName, lang }) => {
  const item: MenuModel = menuModel[itemName];
  const langRecord = item.langs[lang];

  return (
    <Link
      to={langRecord.path}
      key={langRecord.path}
      activeClassName={css.active}
      partiallyActive={!item.exact}
      className={css.menuItem}
    >
      {translations[lang][itemName]}
    </Link>
  );
};

interface LanguageLinkProp extends React.HTMLProps<HTMLDivElement> {
  fromLang: Language;
  toLang: Language;
  pathname: string;
}

const LanguageLink: React.FunctionComponent<LanguageLinkProp> = ({
  fromLang,
  toLang,
  pathname,
}) => {
  const to = (() => {
    if (pathname === "/zh" || pathname === "/zh/") {
      return "/";
    } else if (pathname === "/") {
      return "/zh";
    }

    return pathname.replace(new RegExp(`/${fromLang}`), `/${toLang}`);
  })();
  return (
    <Link lang={toLang} to={to} key={toLang} className={css.menuItem}>
      <Helmet>
        <link rel="alternate" href={to} hrefLang={toLang} />
      </Helmet>
      {translations[toLang]["lang"]}
    </Link>
  );
};

interface HeaderProps {
  pathname: string;
  lang: Language;
  otherLangs: Language[];
}

type HeaderStates = {
  prevScrollpos: number;
  visible: boolean;
};

export default class Header extends React.Component<HeaderProps, HeaderStates> {
  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      prevScrollpos: typeof window !== `undefined` ? window.pageYOffset : 0,
      visible: true,
    };
  }

  handleScroll = () => {
    const { prevScrollpos } = this.state;

    const currentScrollPos = window.pageYOffset;
    const visible = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      visible,
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { pathname, lang, otherLangs } = this.props;
    return (
      <header
        className={classnames(css.header, {
          [css.headerHidden]: !this.state.visible,
        })}
      >
        <div className={css.headerContainer}>
          <Logo lang={lang} />
          <input
            className={css.mobileMenuButton}
            id="mobileMenuButton"
            type="checkbox"
            aria-hidden="true"
          />

          <label
            className={css.mobileMenuIconContainer}
            htmlFor="mobileMenuButton"
            aria-hidden="true"
          >
            <span className={css.mobileMenuIcon} />
          </label>

          <nav className={css.menu}>
            <ul className={css.menuItems}>
              {Object.keys(menuModel).map((key: keyof Translations) => (
                <li key={key}>
                  <MenuItem itemName={key} lang={lang} />
                </li>
              ))}
            </ul>
            <ul className={css.menuItems}>
              <li key="search">
                <Search collapse indices={searchIndices(lang)} />
              </li>
              {otherLangs.map(otherLang => (
                <li key={otherLang}>
                  <LanguageLink fromLang={lang} toLang={otherLang} pathname={pathname} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}
