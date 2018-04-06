import Link from 'gatsby-link';
import * as React from "react";

import { Menu, Sidebar } from "semantic-ui-react";
import { MenuModel, menuModel } from "../menu";

interface SideMenuProp {
  visible: boolean;
  pathname: string;
}

const css = require("./sideMenu.module.css");

export default class SideMenu extends React.Component<SideMenuProp> {
  public render() {
    const visible = this.props.visible;

    return (
      <Sidebar as={Menu}
        className={"mobile only " + css.sidebar}
        animation='push'
        width='thin'
        visible={visible}
        vertical inverted
      >
        {Object.keys(menuModel).map((key: string) =>
          buildMenuItem(this.props.pathname, key)
        )}
      </Sidebar >
    );
  }
}

function buildMenuItem(pathname: string, itemName: string) {
  const item: MenuModel = menuModel[itemName];
  const active: Boolean = (item.exact) ?
    pathname === item.path : pathname.startsWith(item.path);

  return (
    <Menu.Item
      as={Link}
      active={active}
      name={item.en}
      to={item.path}
      key={item.path}
      icon={item.icon}
    />
  );
}
