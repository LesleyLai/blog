import * as React from "react";

import {
  headerContainer,
  title,
  titleLink,
  header,
  menuUL,
  menuItem,
  menuItemLink,
  menuItemLinkActive,
} from "./Header.css";
import { Link } from "gatsby";
import { Language, TranslationKey, translations } from "../../utils/translation";

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
  lang: Language;
};

export default function Header(props: HeaderProp) {
  return (
    <header className={header}>
      <div className={headerContainer}>
        <h2 className={title}>
          <Link to={"/"} className={titleLink}>
            Lesley Lai <span lang="zh">赖思理</span>
          </Link>
        </h2>
        <nav>
          <ul className={menuUL}>
            {headerMenuItems.map((item) => (
              <li key={item.key} className={menuItem}>
                <Link className={menuItemLink} to={item.to} activeClassName={menuItemLinkActive}>
                  {translations[props.lang][item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
