import { graphql, StaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import ProjectPanel from "../components/projectPanel";

import ProjectsPageTemplate, { ProjectsData } from "../templates/projects";

interface ProjectsPageProps {
  location: {
    pathname: string;
  };
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const title = "Projects";
  const helper = (data: ProjectsData) => {
    return (
      <ProjectsPageTemplate
        title={title}
        allMarkdownRemark={data.allMarkdownRemark}
        allImages={data.allImages}
        location={props.location}
      />
    );
  };

  return (
    <StaticQuery
      query={graphql`
        query projectsQuery {
          allMarkdownRemark(
            sort: { fields: [frontmatter___create], order: DESC }
            filter: {
              fields: { relativePath: { regex: "/projects/" } }
              frontmatter: { lang: { eq: "en" } }
            }
          ) {
            edges {
              node {
                frontmatter {
                  id
                  lang
                  categories
                  name
                  image
                  create(formatString: "YYYY")
                  lastModify(formatString: "YYYY")
                  github
                  demo
                  website
                }
                html
              }
            }
          }
          allImages: allFile(filter: {relativePath: {regex: "/projects/.*\\.(png|jpg|jpeg)/"}}) {
            nodes {
              childImageSharp {
                fluid(maxWidth: 600, maxHeight: 400) {
                  ...GatsbyImageSharpFluid
                }
              }
              name
            }
          }
        }
      `}
      render={helper}
    />
  );
};

export default ProjectsPage;
