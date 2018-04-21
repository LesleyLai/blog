import Link from "gatsby-link";
import * as React from "react";

import { MenuModel, menuModel } from "../menu";

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
}

const style = require("./header.module.css");

function buildMenuItem(pathname: string, itemName: string) {
  const item: MenuModel = menuModel[itemName];
  const active: boolean = item.exact
    ? pathname === item.path
    : pathname.startsWith(item.path);

  return (
    <Link to={item.path} key={item.path} className={active ? "active" : ""}>
      {item.en}
    </Link>
  );
}

const HeaderMenu = (props: HeaderMenuProp) => {
  return (
    <nav className={style.menu}>
      {Object.keys(menuModel).map((key: string) =>
        buildMenuItem(props.pathname, key)
      )}
      {/* <Menu.Item
        as="button"
        icon="content"
        className="mobile only"
        position="right"
        size="large"
        />*/}
    </nav>
  );
};

export default HeaderMenu;
