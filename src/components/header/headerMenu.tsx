import classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";
import { FaBars } from "react-icons/lib/fa";

import { MenuModel, menuModel } from "../menu";
import { Language, translations } from "../../utils/translations";

const css = require("./header.module.css");

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  lang: Language;
  otherLangs: Language[];
}

interface MenuItemProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  itemName: string;
  lang: Language;
}

const MenuItem = ({ itemName, lang }: MenuItemProp) => {
  const item: MenuModel = menuModel[itemName];
  const langRecord = item.langs[lang];

  return (
    <Link
      to={langRecord.path}
      key={langRecord.path}
      activeClassName={css.active}
      className={css.menuItem}
      partiallyActive={!item.exact}
    >
      {langRecord.title}
    </Link>
  );
};

interface LanguageLinkProp extends React.HTMLProps<HTMLDivElement> {
  fromLang: Language;
  toLang: Language;
  pathname: string;
}

const LanguageLink = ({ fromLang, toLang, pathname }: LanguageLinkProp) => {
  const to = pathname.replace(new RegExp(`/${fromLang}`), `/${toLang}`);
  return (
    <Link
      to={to}
      key={toLang}
      className={classNames(css.menuItem, css.languageLink)}
    >
      {translations[toLang]["lang"]}
    </Link>
  );
};

export default class HeaderMenu extends React.PureComponent<HeaderMenuProp> {
  public state: { showMobileMenu: boolean };

  constructor(props: HeaderMenuProp) {
    super(props);
    this.state = { showMobileMenu: false };
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
  }

  public render() {
    const otherLangs = this.props.otherLangs;
    const pathname = this.props.pathname;
    const lang = this.props.lang;
    return (
      <>
        <nav
          className={classNames(css.menu, {
            [css.mobileMenu]: this.state.showMobileMenu
          })}
        >
          <div className={css.menuItems}>
            {Object.keys(menuModel).map((key: string) => (
              <MenuItem
                key={key}
                pathname={pathname}
                itemName={key}
                lang={lang}
              />
            ))}
          </div>

          <div className={css.languages}>
            {otherLangs.map(otherLang => (
              <LanguageLink
                key={otherLang}
                fromLang={lang}
                toLang={otherLang}
                pathname={pathname}
              />
            ))}
          </div>
        </nav>

        <button
          name="menu"
          className={css.mobileMenuIcon}
          onClick={this.toggleMobileMenu}
        >
          <FaBars />
        </button>
      </>
    );
  }

  private toggleMobileMenu(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();

    this.setState({ showMobileMenu: !this.state.showMobileMenu });
  }
}
