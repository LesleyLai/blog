import * as React from "react";

const Footer = () => {
    const currentYear = (new Date()).getFullYear();
    return (
        <footer style={{
            textAlign: "center",
        }}>
            ©2015-{currentYear} Lesley Lai
        </footer>
    );
};

export default Footer;
