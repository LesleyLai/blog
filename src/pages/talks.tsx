import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";

const TalksPage = () => {
  return (
    <Layout location={{ pathname: "/talks.html" }}>
      <div>
        <Helmet>
          <title>{"Lesley Lai | talks"}</title>
        </Helmet>
        <h1>Talks</h1>
        <p>Here are the talks that I gave in various events.</p>
      </div>
    </Layout>
  );
};

export default TalksPage;
