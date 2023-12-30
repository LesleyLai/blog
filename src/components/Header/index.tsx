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
  to: Record<Language, string>;
};

const headerMenuItems: Array<HeaderMenuItem> = [
  {
    key: "home",
    to: {
      en: "/",
      zh: "/zh",
    },
  },
  {
    key: "blog",
    to: {
      en: "/en/blog",
      zh: "/zh/blog",
    },
  },
  {
    key: "portfolio",
    to: {
      en: "/en/portfolio",
      zh: "/zh/portfolio",
    },
  },
  {
    key: "talks",
    to: {
      en: "/en/talks",
      zh: "/zh/talks",
    },
  },
  {
    key: "about",
    to: {
      en: "/en/about",
      zh: "/zh/about",
    },
  },
];

type HeaderProp = {
  path: string;
  lang: Language;
};

const localizePath = (path: string, fromLang: Language, toLang: Language) => {
  if (path === "/") {
    // main page of English
    return `/${toLang}`;
  }
  if (path === `/${fromLang}/` && toLang === `en`) {
    // main page of other languages
    return "/";
  }

  return path.replace(new RegExp(`/${fromLang}`), `/${toLang}`);
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
                <Link
                  className={menuItemLink}
                  to={item.to[lang]}
                  activeClassName={menuItemLinkActive}
                >
                  {translations[lang][item.key]}
                </Link>
              </li>
            ))}
          </ul>

          <ul className={menuUL}>
            {otherLanguages.map((otherLang) => {
              return (
                <li key={otherLang}>
                  <Link className={menuItemLink} to={localizePath(path, lang, otherLang)}>
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
