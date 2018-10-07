import * as classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";

import { MenuModel, menuModel } from "../menu";

const css = require("./header.module.css");

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
}

interface MenuItemProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  itemName: string;
}

const MenuItem = ({ pathname, itemName }: MenuItemProp) => {
  const item: MenuModel = menuModel[itemName];

  return (
    <Link
      to={item.path}
      key={item.path}
      activeClassName={css.active}
      className={css.menuItem}
    >
      {item.en}
    </Link>
  );
};

const HeaderMenu = (props: HeaderMenuProp) => {
  return (
    <nav className={css.menu}>
      {Object.keys(menuModel).map((key: string) => (
        <MenuItem key={key} pathname={props.pathname} itemName={key} />
      ))}
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
