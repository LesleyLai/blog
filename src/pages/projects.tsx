import { graphql, StaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import ProjectPanel from "../components/projectPanel";

import ProjectsPageTemplate from "../templates/projects";

interface ProjectsPageProps {
  location: {
    pathname: string;
  };
}

const ProjectsPage = (props: ProjectsPageProps) => {
  return <ProjectsPageTemplate location={props.location} />;
};

export default ProjectsPage;
