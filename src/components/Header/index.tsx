import * as React from "react";

import {
  headerContainer,
  title,
  header,
  menuUL,
  menuItem,
  menuItemLink,
  menuItemLinkActive,
} from "./Header.css";
import { Link } from "gatsby";

type HeaderMenuItem = {
  name: string;
  // The URL to link to
  to: string;
};

const headerMenuItems: Array<HeaderMenuItem> = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Writing",
    to: "/writing",
  },
  {
    name: "Portfolio",
    to: "/portfolio",
  },
  {
    name: "Talks",
    to: "/talks",
  },
  {
    name: "About",
    to: "/about",
  },
];

export default () => {
  return (
    <header className={header}>
      <div className={headerContainer}>
        <h2 className={title}>
          Lesley Lai <span lang="zh">赖思理</span>
        </h2>
        <nav>
          <ul className={menuUL}>
            {headerMenuItems.map((item) => (
              <li className={menuItem}>
                <Link
                  className={menuItemLink}
                  to={item.to}
                  activeClassName={menuItemLinkActive}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
