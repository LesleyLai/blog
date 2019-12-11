import * as React from "react";
import { graphql } from "gatsby";
import { Language } from "../utils/translations";
import { TagID } from "../types/tags";

import ProjectsPageTemplate, { ProjectsData } from "../templates/projects";

interface ProjectsPageProps {
  location: {
    pathname: string;
  };
  pageContext: { tag?: TagID; lang: Language };
  data: ProjectsData;
}

const ProjectsPage = (props: ProjectsPageProps) => {
  return (
    <ProjectsPageTemplate
      data={props.data}
      location={props.location}
      pageContext={props.pageContext}
    />
  );
};

export default ProjectsPage;

export const query = graphql`
  query projectsQuery($lang: String!) {
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
`;
