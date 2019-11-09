import classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";
import { FaBars } from "react-icons/lib/fa";

import { MenuModel, menuModel } from "../menu";
import translations from "../../utils/translations";

const css = require("./header.module.css");

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
}

interface MenuItemProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  itemName: string;
  lang: string;
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
  lang: string;
}

const oppositeLang = (lang: string) => {
  if (lang === "en") {
    return "zh";
  } else if (lang === "zh") {
    return "en";
  }

  throw new Error("Invalid language");
};

const LanguageLink = ({ lang }: LanguageLinkProp) => {
  const to = `raii/${lang}`;
  return (
    <Link
      to={to}
      key={lang}
      className={classNames(css.menuItem, css.languageLink)}
    >
      {translations["lang"][lang]}
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
                pathname={this.props.pathname}
                itemName={key}
                lang={this.props.lang}
              />
            ))}
          </div>

          <div className={css.languages}>
            <LanguageLink lang={oppositeLang(this.props.lang)} />
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
