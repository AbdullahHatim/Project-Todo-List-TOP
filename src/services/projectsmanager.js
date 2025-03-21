import storage from "./storage"
import { ProjectList } from "../components/project/projectlist"

export const ProjectManager = (() => {
  const storageKey = "projectlist"
  const projectListJSON = storage.get(storageKey)
  const projectList = new ProjectList()

  if (projectListJSON) {
    projectList.parse(projectListJSON)
  }

  const updateStorage = () => {
    storage.set(storageKey, projectList.toString())
  }

  const addProject = (title) => {
    projectList.addItem(title)
    updateStorage()
  }
  const getProject = (title) => {
    return projectList.getItem(title)
  }
  const removeProject = (title) => {
    const project = projectList.removeItem(title)
    updateStorage()
    return project
  }

  const resetAllProjects = () => {
    projectList.clear()
    updateStorage()
  }
  return Object.freeze({
    updateStorage,
    addProject,
    getProject,
    removeProject,
    resetAllProjects,
    get projectList() {
      return projectList
    },
  })
})()
