import { graphql, Link, StaticQuery } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";

import Layout from "../components/layout";

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

interface TalksData {
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
}

const TalksPage = () => {
  const P = styled.p`
    margin: 10px 0 10px 0;
  `;

  const UL = styled.ul`
    margin-bottom: 0;
  `;

  const helper = (_data: TalksData) => (
    <Layout location={{ pathname: "/talks.html" }}>
      <>
        <Helmet>
          <title>{"Lesley Lai | Talks"}</title>
        </Helmet>
        <h1>Talks</h1>
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

  return (
    <StaticQuery
      query={graphql`
        query {
          site {
            siteMetadata {
              siteUrl
            }
          }
        }
      `}
      render={helper}
    />
  );
};

export default TalksPage;
