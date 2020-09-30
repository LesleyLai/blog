import { graphql, Link } from "gatsby";
import * as React from "react";
import styled from "styled-components";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";
import { Language, translations } from "../utils/translations";

import SEO from "../components/seo";

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
    margin: 5px 0 5px 0
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
      totalCount: number;
    };
  };
  location: {
    pathname: string;
  };
  pageContext: { lang: Language };
}

const InlineCode: React.FunctionComponent = props => (
  <code className="language-text">{props.children}</code>
);

const TalksPage = ({ data, location, pageContext }: TalksProps) => {
  const P = styled.p`
    margin: 10px 0 10px 0;
  `;

  const UL = styled.ul`
    margin-bottom: 0;
  `;

  const lang = pageContext.lang;

  const pageDescription = translations[lang]["talks_page_desc"];
  const talksLocale = translations[lang]["talks"];

  return (
    <Layout
      location={location}
      lang={lang}
      tags={data.posts.tags}
      postsTotalCount={data.posts.totalCount}
    >
      <>
        <SEO
          title={talksLocale}
          lang={lang}
          description={pageDescription}
          path={location.pathname}
        />
        <h1>{talksLocale}</h1>
        <P>{pageDescription}</P>
        <Talk title="Type Erasure: Concept and Implementation" date="2020-2-13">
          <P>
            This talk explains the idea of type erasure in the C++ context and how it gets
            implemented. It first explores C style type erasure with the cast and{" "}
            <InlineCode>void*</InlineCode> and OOP style type-erasure with inheritance and virtual
            dispatch. And then, It explains more advanced type erasure techniques used in standard
            library types such as <InlineCode>std::function</InlineCode>. And the talk then spend
            the majority of time gave a case study on how to implement the proposed{" "}
            <a href="http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019/p0228r3.html">
              <InlineCode>unique_function</InlineCode>
            </a>{" "}
            type.
          </P>
          <UL>
            <li>
              <a href="https://youtu.be/2-QZTVzgAGM">Video</a>
            </li>
            <li>
              Slides{" "}
              <a href={`https://type-erasure-talk-north-denver-metro-cpp.netlify.com/`}>
                [Interactive]
              </a>
            </li>
          </UL>
        </Talk>
        <Talk title="Understanding Persistent Data Structures" date="2020-1-28">
          <P>
            An hour long talk on the basic idea of persistent data structures at{" "}
            <a href="https://www.meetup.com/denverfp/">Denver FP</a>. Covers basic principles of
            persistent data structures with case studies of immutable array, list,{" "}
            <a href="https://dl.acm.org/doi/pdf/10.1145/2784731.2784739?download=true">
              Relaxed Radix-Balanced Trees
            </a>
            , and{" "}
            <a href="https://lampwww.epfl.ch/papers/idealhashtrees.pdf">Hash Array Mapped Tries</a>.
          </P>
          <UL>
            <li>
              Slides{" "}
              <a href={`/talks/slides_understanding-persistent-data-structures/`}>[Interactive]</a>{" "}
              <a href={`/talks/understanding-persistent-data-structures.pdf`}>[PDF]</a>
            </li>
          </UL>
        </Talk>
        <Talk title="CppCon 2019: “Make impossible state unrepresentable”" date="2019-9-18">
          <P>
            A lighting talk on how to design data and types in C++ to leverage the static type
            system so that invariants breaking becomes impossible in certain instances.
          </P>
          <UL>
            <li>
              <a href="https://youtu.be/hYyRrYwfy3k">Video</a>
            </li>
            <li>
              Slides{" "}
              <a href={`/talks/make_impossible_state_unrepresentable/index.html`}>[Interactive]</a>{" "}
              <a href={`/talks/make_impossible_state_unrepresentable.pdf`}>[PDF]</a>
            </li>
          </UL>
          <P>
            Update 2019-10-26: I wrote a more detailed{" "}
            <Link to="/en/make-impossible-state-unrepresentable/">blog post</Link> to discuss this
            issue.
          </P>
        </Talk>
      </>
    </Layout>
  );
};

export default TalksPage;

export const query = graphql`
  query TalksQuery($lang: String!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
  }
`;
