// src/context/ProjectContext.js
import { createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState({
    projectName: localStorage.getItem("projectName") || "",
    plotNumber: localStorage.getItem("plotNumber") || "",
  });

  const updateProjectData = (name, plot) => {
    localStorage.setItem("projectName", name);
    localStorage.setItem("plotNumber", plot);
    setProjectData({ projectName: name, plotNumber: plot });
  };

  return (
    <ProjectContext.Provider value={{ projectData, updateProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
