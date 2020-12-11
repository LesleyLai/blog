import * as React from "react";

import { Language } from "../../utils/translations";

import { MdRssFeed as RssIcon } from "@react-icons/all-files/md/MdRssFeed";

import { TiSocialTwitter as TwitterIcon } from "@react-icons/all-files/ti/TiSocialTwitter";
import { TiSocialLinkedin as LinkedInIcon } from "@react-icons/all-files/ti/TiSocialLinkedin";

const css = require("./socials.module.css");

interface SocialsProps {
  lang: Language;
  shareInfo?: {
    title: string;
    url: string;
  };
}

const Socials = ({ lang, shareInfo }: SocialsProps) => {
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
      {shareInfo && lang !== "zh" && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          title="Share with Twitter"
          href={`https://twitter.com/intent/tweet?url=${shareInfo.url}&text="${shareInfo.title}"&via=LesleyLai6`}
        >
          <TwitterIcon className={css.icon} data-tip="Share with Twitter" size={25} />
        </a>
      )}
      {shareInfo && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          title="Share with LinkedIn"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareInfo.url}&title=${shareInfo.title}`}
        >
          <LinkedInIcon className={css.icon} data-tip="Share with LinkedIn" size={25} />
        </a>
      )}
      <a href={link} title="Rss Feed">
        <RssIcon className={css.icon} data-tip="Rss Feed" size={25} />
      </a>
    </div>
  );
};

export default Socials;
