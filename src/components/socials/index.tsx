import * as React from "react";

import { Language } from "../../utils/translations";

const RssIcon = require("react-icons/lib/md/rss-feed");

const css = require("./socials.module.css");

const Socials = (props: { lang: Language }) => {
  const lang = props.lang;
  const link = (() => {
    switch (lang) {
      case "en":
        return "http://lesleylai.info/rss.xml";
      case "zh":
        return "http://lesleylai.info/zh/rss.xml";
    }
  })();

  return (
    <div className={css.socials}>
      <a href={link}>
        <RssIcon className={css.icon} data-tip="Rss Feed" size={25} />
      </a>
    </div>
  );
};

export default Socials;
