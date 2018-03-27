import * as React from "react";
import Link from 'gatsby-link';

import { Sidebar, Menu } from "semantic-ui-react";
import { MenuModel, menuModel } from "../menu";

interface SideMenuProp {
  visible: boolean;
  pathname: string;
}

export default class SideMenu extends React.Component<SideMenuProp> {
  render() {
    const visible = this.props.visible;

    return (
      <Sidebar as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
        {
          Object.keys(menuModel).map((key: string) =>
            buildMenuItem(this.props.pathname, key)
          )
        }
      </Sidebar>
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
      key={item.path} />
  );
}
