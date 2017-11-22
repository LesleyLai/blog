import * as React from "react";
import Link from 'gatsby-link';
import { Menu, Dropdown } from "semantic-ui-react";


interface MenuItem {
    en: string;
    path: string;
    exact: boolean;
    icon?: string;
    inverted?: boolean;
}

const itemsData: { [key: string]: MenuItem } = {
    home: { en: "Home", path: "/", exact: true, icon: "home", inverted: true },
    blog: { en: "Blog", path: "/archive/", exact: false, icon: "newspaper" },

    cv: { en: "CV", path: "/resume", exact: true, icon: "info circle" },
    portfolio: { en: "Portfolio", path: "/projects", exact: true, icon: "info circle" },
    mooc: { en: "Learning", path: "/mooc", exact: true, icon: "info circle" },
    teaching: { en: "Teaching", path: "/teaching", exact: true, icon: "info circle" },
};

function buildMenuItem(pathname: string, itemName: string, classes: string) {
    const item: MenuItem = itemsData[itemName];
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


interface NavMenuProp extends React.HTMLProps<HTMLDivElement> {
    pathname: string;
}

const NavMenu = (props: NavMenuProp) => {
    const classes = "mobile hidden";
    const navMenuItem = (itemName: string) =>
        buildMenuItem(props.pathname, itemName, classes);

    return (
        <Menu as="nav"
            secondary
            inverted
            pointing
            size="large"
            style={{
                marginTop: '0',
                marginLeft: '100px'
            }}>
            {
                Object.keys(itemsData).map((key: string) => navMenuItem(key))
            }
        </Menu >
    );
}

export default NavMenu;
