import * as React from "react";
import { Menu } from "semantic-ui-react";

import { GenericMenu } from "../menu"

interface HeaderMenuProp extends React.HTMLProps<HTMLDivElement> {
    pathname: string;
}

const HeaderMenu = (props: HeaderMenuProp) => {
    const classes = "";
    //const classes = "mobile hidden";

    return (
        <GenericMenu pathname={props.pathname} itemClasses={classes} />
    );
}

export default HeaderMenu;
