import { graphql, StaticQuery } from "gatsby";
import { FluidObject } from "gatsby-image";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../../components/layout";
import ProjectPanel from "../../components/projectPanel";

interface ProjectsPageProps {
  location: {
    pathname: string;
  };
}

interface ProjectMeta {
  frontmatter: {
    id: number;
    name: string;
    lang: string;
    create: string;
    lastModify?: string;
    categories: string[];
    image?: string;
    github?: string;
    demo?: string;
    website?: string;
  };
  html: string;
}

interface ImageMeta {
  childImageSharp: {
    fluid: FluidObject;
  };
  name: string;
}

interface ProjectsData {
  allMarkdownRemark: {
    edges: Array<{
      node: ProjectMeta;
    }>;
  };
  allImages: {
    nodes: ImageMeta[];
  };
}

interface ImageMap {
  [name: string]: FluidObject;
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const title = "Portfolio";
  const helper = (data: ProjectsData) => {
    const projects = data.allMarkdownRemark.edges.map(edge => edge.node);

    const images = data.allImages.nodes.reduce(function(
      acc: ImageMap,
      cur: ImageMeta
    ) {
      acc[cur.name] = cur.childImageSharp.fluid;
      return acc;
    },
    {});

    return (
      <Layout location={props.location}>
        <div>
          <Helmet>
            <title>{"Lesley Lai | " + title}</title>
          </Helmet>
          <h1>{title}</h1>
          {projects.map(project => {
            return (
              <ProjectPanel
                key={project.frontmatter.name}
                name={project.frontmatter.name}
                github={project.frontmatter.github}
                demo={project.frontmatter.demo}
                website={project.frontmatter.website}
                year={
                  project.frontmatter.lastModify
                    ? project.frontmatter.create +
                      "-" +
                      project.frontmatter.lastModify
                    : project.frontmatter.create
                }
                tags={project.frontmatter.categories}
                image={
                  project.frontmatter.image && images[project.frontmatter.image]
                }
              >
                <div dangerouslySetInnerHTML={{ __html: project.html }} />
              </ProjectPanel>
            );
          })}
        </div>
      </Layout>
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
