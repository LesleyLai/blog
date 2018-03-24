import * as React from "react";
import Link from 'gatsby-link';
import { Menu } from "semantic-ui-react";

interface MenuItemData {
  en: string;
  path: string;
  exact: boolean;
  icon?: string;
  inverted?: boolean;
}

const itemsData: { [key: string]: MenuItemData } = {
  home: { en: "Home", path: "/", exact: true, icon: "home" },
  blog: { en: "Archive", path: "/archive/", exact: false, icon: "newspaper" },

  //cv: { en: "CV", path: "/resume", exact: true, icon: "info circle" },
  //portfolio: { en: "Portfolio", path: "/projects", exact: true, icon: "info circle" },
  //teaching: { en: "Teaching", path: "/teaching", exact: true, icon: "info circle" },
};

function buildMenuItem(pathname: string, itemName: string, classes: string) {
  const item: MenuItemData = itemsData[itemName];
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

interface GenericMenuProp extends React.HTMLProps<HTMLDivElement> {
  pathname: string;
  itemClasses: string;
}


export const GenericMenu = (props: GenericMenuProp) => {

  return (
    <Menu as="nav"
      secondary
      inverted
      pointing
      size="large">
      {
        Object.keys(itemsData).map((key: string) =>
          buildMenuItem(props.pathname, key, props.itemClasses)
        )
      }
    </Menu >
  );
}
