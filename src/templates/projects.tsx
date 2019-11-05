import { FluidObject } from "gatsby-image";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import ProjectPanel from "../components/projectPanel";

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
    edges: Array<{
      node: ProjectMeta;
    }>;
  };
  allImages: {
    nodes: ImageMeta[];
  };
}

interface ProjectsProps extends ProjectsData {
  title: string;
  location: {
    pathname: string;
  };
}

interface ImageMap {
  [name: string]: FluidObject;
}

class ProjectsPageTemplate extends React.Component<ProjectsProps> {
  render() {
    const props = this.props;

    const projects = props.allMarkdownRemark.edges.map(edge => edge.node);

    const images = props.allImages.nodes.reduce(function(
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
            <title>{"Lesley Lai | " + props.title}</title>
          </Helmet>
          <h1>{props.title}</h1>
          <p>Check out my personal projects below.</p>
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
  }
}

export default ProjectsPageTemplate;
