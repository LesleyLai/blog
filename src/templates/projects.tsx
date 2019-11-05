import { FluidObject } from "gatsby-image";
import { graphql, StaticQuery } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import ProjectPanel from "../components/projectPanel";
import Tags from "../components/projectPanel/projectTags";

const css = require("./projects.module.css");

import { projectsTagInfos } from "../utils/tagInfo";

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

export interface ProjectsData {
  allMarkdownRemark: {
    tags: Array<{
      fieldValue: string;
      totalCount: number;
    }>;
    edges: Array<{
      node: ProjectMeta;
    }>;
  };
  allImages: {
    nodes: ImageMeta[];
  };
}

interface ProjectsProps {
  location: { pathname: string };
  pageContext?: { tag: string };
  data?: ProjectsData;
}

interface ImageMap {
  [name: string]: FluidObject;
}

function getTagName(tagId: string) {
  return projectsTagInfos[tagId] ? projectsTagInfos[tagId].en : tagId;
}

class ProjectsPageTemplate extends React.Component<ProjectsProps> {
  render() {
    const props = this.props;
    const tag = props.pageContext ? props.pageContext.tag : null;
    const tagName = getTagName(tag);

    const helper = (data: ProjectsData) => {
      const projects = data.allMarkdownRemark.edges
        .map(edge => edge.node)
        .filter(node => !tag || node.frontmatter.categories.includes(tag));

      const allTags = data.allMarkdownRemark.tags
        .sort((lhs, rhs) => rhs.totalCount - lhs.totalCount)
        .map(tag => tag.fieldValue);

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
              <title>{"Lesley Lai | Projects"}</title>
            </Helmet>
            <h1>Projects</h1>
            <h3 className={css.subtitle}>
              Check out my personal projects below.
            </h3>

            <Tags tags={allTags} showAll></Tags>

            {tag ? (
              <p className={css.filterHint}>
                Show {projects.length} projects filtered by <em>{tagName}</em>.
              </p>
            ) : (
              <p className={css.filterHint}>
                Show all projects. Use the filter to list them by skill or
                technology.
              </p>
            )}

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
                    project.frontmatter.image &&
                    images[project.frontmatter.image]
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
              tags: group(field: frontmatter___categories) {
                fieldValue
                totalCount
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
  }
}

export default ProjectsPageTemplate;
