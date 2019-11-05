import * as React from "react";

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
