import classNames from "classnames";
import * as React from "react";

const css = require("./footer.module.css");

const Footer = () => {
  return (
    <footer className={css.footer}>
      <a href="http://lesleylai.info/rss.xml">
        <span className={classNames("material-icons", css.icon)}>rss_feed</span>
      </a>
    </footer>
  );
};

export default Footer;
