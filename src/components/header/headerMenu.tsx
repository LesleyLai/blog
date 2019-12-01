import Link from "gatsby-link";
import * as React from "react";

import { MenuModel, menuModel } from "../menu";
import { Language, Translations, translations } from "../../utils/translations";

const css = require("./header.module.css");

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  lang: Language;
  otherLangs: Language[];
}

interface MenuItemProp extends React.HTMLProps<HTMLDivElement> {
  itemName: keyof Translations;
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

const LanguageLink = ({ fromLang, toLang, pathname }: LanguageLinkProp) => {
  const to = (() => {
    if (pathname === "/zh" || pathname === "/zh/") {
      return "/";
    } else if (pathname === "/") {
      return "/zh";
    }

    return pathname.replace(new RegExp(`/${fromLang}`), `/${toLang}`);
  })();
  return (
    <Link to={to} key={toLang} className={css.menuItem}>
      {translations[toLang]["lang"]}
    </Link>
  );
};

export default class HeaderMenu extends React.PureComponent<HeaderMenuProp> {
  public state: { showMobileMenu: boolean };

  constructor(props: HeaderMenuProp) {
    super(props);
    this.state = { showMobileMenu: false };
  }

  public render() {
    const otherLangs = this.props.otherLangs;
    const pathname = this.props.pathname;
    const lang = this.props.lang;
    return (
      <>
        <input
          className={css.mobileMenuButton}
          id="mobileMenuButton"
          type="checkbox"
        />

        <label
          className={css.mobileMenuIconContainer}
          htmlFor="mobileMenuButton"
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

          {otherLangs.length !== 0 && (
            <ul className={css.menuItems}>
              {otherLangs.map(otherLang => (
                <li key={otherLang}>
                  <LanguageLink
                    fromLang={lang}
                    toLang={otherLang}
                    pathname={pathname}
                  />
                </li>
              ))}
            </ul>
          )}
        </nav>
      </>
    );
  }
}
