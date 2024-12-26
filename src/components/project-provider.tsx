"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

type Project = {
  id: string;
  name: string;
};

type ProjectProviderApi = {
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  projects: Project[];
};
// Create a context for the projects
const ProjectContext = createContext<ProjectProviderApi | null>(null);

// Create a provider component
export const ProjectProvider = ({
  children,
  projects,
}: {
  children: ReactNode;
  projects?: Project[];
}) => {
  // TODO: Store and read the active project from cookies
  const [activeProject, setActiveProject] = useState<Project | null>(
    projects?.[0] ?? null,
  );

  return (
    <ProjectContext.Provider
      value={{ activeProject, setActiveProject, projects: projects ?? [] }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
