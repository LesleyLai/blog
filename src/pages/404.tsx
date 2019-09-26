import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";

const NotFoundPage = () => {
  return (
    <Layout location={{ pathname: "/404.html" }}>
      <div>
        <Helmet>
          <title>{"Lesley Lai | 404 NOT FOUND"}</title>
        </Helmet>
        <h1>404 NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
