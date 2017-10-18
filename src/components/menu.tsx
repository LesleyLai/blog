import * as React from "react";
import Link from 'gatsby-link';
import { Menu, Dropdown } from "semantic-ui-react";


interface MenuItem {
    path: string;
    exact: boolean;
    icon?: string;
    inverted?: boolean;
}

const itemsData: { [key: string]: MenuItem } = {
    Home: { path: "/", exact: true, icon: "home", inverted: true },
    Blog: { path: "/archive/", exact: false, icon: "newspaper" },
    Resume: { path: "/about/", exact: true, icon: "info circle" },
    Portfolio: { path: "/projects", exact: true, icon: "info circle" },
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
            name={itemName}
            to={item.path}
            key={item.path}
            className={classes} />
    );
}


interface NavMenuProp extends React.HTMLProps<HTMLDivElement> {
    pathname: string;
}

const NavMenu = (props: NavMenuProp) => {
    const classes = "";
    //const classes = "mobile hidden";
    const navMenuItem = (itemName: string) =>
        buildMenuItem(props.pathname, itemName, classes);

    return (
        <Menu as="nav"
            secondary
            inverted
            pointing
            size="large"
            style={{ marginTop: '0' }}>
            {navMenuItem("Home")}
            {navMenuItem("Blog")}

            <Dropdown item text='About' active="false">
                <Dropdown.Menu>
                    {navMenuItem("Resume")}
                    {navMenuItem("Portfolio")}
                    <Dropdown.Item>Contact</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Menu>
    );
}

export default NavMenu;
