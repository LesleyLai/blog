import * as React from "react";

import {
  headerContainer,
  title,
  titleLink,
  nav,
  header,
  menuUL,
  menuItem,
  menuItemLink,
  menuItemLinkActive,
} from "./Header.css";
import { Link } from "gatsby";
import { Language, TranslationKey, languages, translations } from "../../utils/translation";

type HeaderMenuItem = {
  key: TranslationKey;
  // The URL to link to
  to: string;
};

const headerMenuItems: Array<HeaderMenuItem> = [
  {
    key: "home",
    to: "/",
  },
  {
    key: "blog",
    to: "/blog",
  },
  {
    key: "portfolio",
    to: "/portfolio",
  },
  {
    key: "talks",
    to: "/talks",
  },
  {
    key: "about",
    to: "/about",
  },
];

type HeaderProp = {
  path: string;
  lang: Language;
};

export default function Header({ path, lang }: HeaderProp) {
  const otherLanguages = languages.filter((otherLang) => otherLang != lang);

  return (
    <header className={header}>
      <div className={headerContainer}>
        <h2 className={title}>
          <Link to={"/"} className={titleLink}>
            Lesley Lai <span lang="zh">赖思理</span>
          </Link>
        </h2>
        <nav className={nav}>
          <ul className={menuUL}>
            {headerMenuItems.map((item) => (
              <li key={item.key} className={menuItem}>
                <Link className={menuItemLink} to={item.to} activeClassName={menuItemLinkActive}>
                  {translations[lang][item.key]}
                </Link>
              </li>
            ))}
          </ul>

          <ul className={menuUL}>
            {otherLanguages.map((otherLang) => {
              const localizedPath = (() => {
                if (path === "/") {
                  // main page of English
                  return `/${otherLang}`;
                }
                if (path === `/${lang}/` && otherLang === `en`) {
                  // main page of other languages
                  return "/";
                }

                return path.replace(new RegExp(`/${lang}`), `/${otherLang}`);
              })();

              return (
                <li key={otherLang}>
                  <Link className={menuItemLink} to={localizedPath}>
                    {translations[otherLang].langName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
