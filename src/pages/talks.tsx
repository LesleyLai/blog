import { graphql, Link } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";
import { Language, translations } from "../utils/translations";

interface TalkProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly date: string;
}

const Talk = (props: TalkProps) => {
  const Date = styled.p`
    margin: 0 0 10px 0;
  `;

  const H2 = styled.h2`
    display: inline;
    font-size: 20px;
    margin: 5px 0 5px 0;
    font-weight: 500;
  `;

  const Hr = styled.hr`
    height: 2px;
    background: hsla(0, 0%, 0%, 0.5);
    margin-bottom: 0;
  `;

  return (
    <section>
      <H2>{props.title}</H2>
      {props.children}
      <Hr />
      <Date>Date: {props.date}</Date>
    </section>
  );
};

interface TalksProps {
  data: {
    posts: {
      tags: TagItem[];
    };
  };
  location: {
    pathname: string;
  };
  pageContext: { lang: Language };
}

const TalksPage = ({ data, location, pageContext }: TalksProps) => {
  const P = styled.p`
    margin: 10px 0 10px 0;
  `;

  const UL = styled.ul`
    margin-bottom: 0;
  `;

  const lang = pageContext.lang;

  const talksLocale = translations[lang]["talks"];

  return (
    <Layout location={location} lang={lang} tags={data.posts.tags}>
      <>
        <Helmet>
          <title>{`Lesley Lai | ${talksLocale}`}</title>
        </Helmet>
        <h1>{talksLocale}</h1>
        <P>Here are the talks that I gave in various events.</P>
        <Talk
          title="CppCon 2019: “Make impossible state unrepresentable”"
          date="2019-9-18"
        >
          <P>
            A lighting talk on how to design data and types in C++ to leverage
            the static type system so that invariants breaking becomes
            impossible in certain instances.
          </P>
          <UL>
            <li>
              <a href="https://youtu.be/hYyRrYwfy3k">video</a>
            </li>
            <li>
              Slides{" "}
              <a
                href={`/talks/make_impossible_state_unrepresentable/index.html`}
              >
                [Web]
              </a>{" "}
              <a href={`/talks/make_impossible_state_unrepresentable.pdf`}>
                [PDF]
              </a>
            </li>
          </UL>
          <P>
            Update 2019-10-26: I wrote a more detailed{" "}
            <Link to="make-impossible-state-unrepresentable/en/">
              blog post
            </Link>{" "}
            to discuss this issue.
          </P>
        </Talk>
      </>
    </Layout>
  );
};

export default TalksPage;

export const query = graphql`
  query TalksQuery($lang: String!) {
    posts: allMarkdownRemark(
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      ...Tags
    }
  }
`;
