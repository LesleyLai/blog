import * as React from "react";

import { translations, Language } from "../utils/translation";

type PageTitleProps = {
  title: string;
  lang: Language;
};

export const PageTitle = ({ title, lang }: PageTitleProps) => (
  <title>
    {title} | {translations[lang].myname}
  </title>
);
