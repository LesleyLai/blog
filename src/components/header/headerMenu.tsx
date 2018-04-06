import Link from 'gatsby-link';
import * as React from "react";
import { Menu } from "semantic-ui-react";

import { MenuModel, menuModel } from "../menu";

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  toggleSideBar: any;
}

const style = require("./header.module.css");


function buildMenuItem(pathname: string, itemName: string, classes: string) {
  const item: MenuModel = menuModel[itemName];
  const active: Boolean = (item.exact) ?
    pathname === item.path :
    pathname.startsWith(item.path);

  return (
    <Menu.Item
      as={Link}
      active={active}
      name={item.en}
      to={item.path}
      key={item.path}
      className={classes} />
  );
}

const HeaderMenu = (props: HeaderMenuProp) => {
  const itemClasses = "mobile hidden";

  return (
    <Menu as="nav"
      secondary
      inverted
      pointing
      fluid
      className={style.menu}
      size="large">
      {
        Object.keys(menuModel).map((key: string) =>
          buildMenuItem(props.pathname, key, itemClasses)
        )
      }
      <Menu.Item as="button"
        icon="content"
        className="mobile only"
        position="right"
        size="large"
        onClick={props.toggleSideBar}
      />
    </Menu >
  );
}

export default HeaderMenu;
