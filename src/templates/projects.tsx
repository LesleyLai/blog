import { FluidObject } from "gatsby-image";
import { graphql } from "gatsby";
import * as React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Layout from "../components/layout";
import ProjectPanel from "../components/projectPanel";
import Tags from "../components/projectPanel/projectTags";
import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

import SEO from "../components/seo";

const css = require("./projects.module.css");

interface ProjectMeta {
  frontmatter: {
    id: number;
    name: string;
    lang: Language;
    create: string;
    lastModify?: string;
    tags: TagID[];
    image?: string;
    github?: string;
    demo?: string;
    website?: string;
  };
  body: string;
}

interface ImageMeta {
  childImageSharp?: {
    fluid: FluidObject;
  };
  name: string;
  extension: string;
  publicURL: string;
}

export interface ProjectsData {
  projects: {
    tags: TagItem[];
    edges: Array<{
      node: ProjectMeta;
    }>;
  };
  posts: {
    totalCount: number;
    tags: TagItem[];
  };
  allImages: {
    nodes: ImageMeta[];
  };
}

interface ProjectsProps {
  location: { pathname: string };
  pageContext: { tag?: TagID; lang: Language };
  data: ProjectsData;
}

interface ImageMap {
  [name: string]: FluidObject | string;
}

class ProjectsPageTemplate extends React.Component<ProjectsProps> {
  render() {
    const props = this.props;
    const tag = props.pageContext.tag;
    const lang = props.pageContext.lang;

    const data = props.data;
    const projects = data.projects.edges
      .map(edge => edge.node)
      .filter(node => !tag || node.frontmatter.tags.includes(tag));

    const allTags = data.projects.tags.map(tag => tag.id);

    const postsTags = data.posts.tags;
    const postsTotalCount = data.posts.totalCount;

    const images = data.allImages.nodes.reduce((acc: ImageMap, cur: ImageMeta) => {
      if (!cur.childImageSharp && cur.extension === "gif") {
        acc[cur.name] = cur.publicURL;
      } else {
        acc[cur.name] = cur.childImageSharp.fluid;
      }
      return acc;
    }, {});

    return (
      <Layout
        location={props.location}
        postsTotalCount={postsTotalCount}
        lang={lang}
        tags={postsTags}
      >
        <div>
          <SEO
            title={translations[lang]["projects"]}
            description={translations[lang]["projects_page_description"]}
            lang={lang}
            path={props.location.pathname}
          />
          <h1>{translations[lang]["projects"]}</h1>
          <h3 className={css.subtitle}>{translations[lang]["projects_page_description"]}</h3>

          <Tags tags={allTags} showAll lang={lang} />

          {tag ? (
            <p className={css.filterHint}>
              {translations[lang]["show_projects_filtered"](projects.length, tag)}
            </p>
          ) : (
            <p className={css.filterHint}>{translations[lang]["showall_projects"]}</p>
          )}

          {projects.map(project => {
            const image = project.frontmatter.image && images[project.frontmatter.image];
            return (
              <ProjectPanel
                key={project.frontmatter.name}
                name={project.frontmatter.name}
                github={project.frontmatter.github}
                demo={project.frontmatter.demo}
                website={project.frontmatter.website}
                year={
                  project.frontmatter.lastModify
                    ? project.frontmatter.create + "-" + project.frontmatter.lastModify
                    : project.frontmatter.create
                }
                lang={project.frontmatter.lang}
                tags={project.frontmatter.tags}
                image={image}
              >
                <MDXRenderer>{project.body}</MDXRenderer>
              </ProjectPanel>
            );
          })}
        </div>
      </Layout>
    );
  }
}

export default ProjectsPageTemplate;

export const query = graphql`
  fragment ProjectsInfo on MdxConnection {
    edges {
      node {
        frontmatter {
          id
          lang
          tags: categories
          name
          image
          create(formatString: "YYYY")
          lastModify(formatString: "YYYY")
          github
          demo
          website
        }
        body
      }
    }
    ...Tags
  }

  query projectsTagsQuery($lang: String!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: {regex: "//contents/blog//"}
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
    projects: allMdx(
      sort: { fields: [frontmatter___create], order: DESC }
      filter: {
        fileAbsolutePath: {regex: "//contents/projects//"}
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      ...ProjectsInfo
    }
    allImages: allFile(filter: {relativePath: {regex: "/projects/.*\\.(png|jpg|jpeg|gif)/"}}) {
      nodes {
        childImageSharp {
          fluid(maxWidth: 600, maxHeight: 400) {
            ...GatsbyImageSharpFluid
          }
        }
        name
        extension
        publicURL
      }
    }
  }
`;
