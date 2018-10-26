import * as classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";
import { FaBars } from "react-icons/lib/fa";

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

export default class HeaderMenu extends React.PureComponent<HeaderMenuProp> {
  public state: { showMobileMenu: boolean };

  constructor(props: HeaderMenuProp) {
    super(props);
    this.state = { showMobileMenu: false };
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
  }

  public render() {
    return (
      <>
        <nav
          className={classNames(css.menu, {
            [css.mobileMenu]: this.state.showMobileMenu
          })}
        >
          {Object.keys(menuModel).map((key: string) => (
            <MenuItem key={key} pathname={this.props.pathname} itemName={key} />
          ))}
        </nav>
        <button className={css.mobileMenuIcon} onClick={this.toggleMobileMenu}>
          <FaBars />
        </button>
      </>
    );
  }

  private toggleMobileMenu(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();

    this.setState({ showMobileMenu: !this.state.showMobileMenu });
  }
}
