import storage from "./storage"
import { ProjectList } from "../components/project/projectlist"
import { getTodosDueToday } from "@/components/utils/gettodosduetoday"

export const ProjectManager = (() => {
  const storageKey = "projectlist"
  const projectListJSON = storage.get(storageKey)
  const projectList = new ProjectList()
  const GENERAL_ID = "8adb2c18cafb0d0ad1a0113a080af51e"
  const TODAY_ID = "7925cbea7729ed237b37d5de3dc96218"
  const DEFAULT_TODOLIST_ID = "7a109073db7959600fcfa3414e7c85e6"

  if (projectListJSON) {
    projectList.parse(projectListJSON)
  }

  const updateStorage = () => {
    storage.set(storageKey, projectList.toString())
  }

  const addProject = (title) => {
    projectList.addItem(title)
    getProject().addItem(DEFAULT_TODOLIST_ID)
    updateStorage()
  }

  const getProject = (value) => {
    return projectList.getItem(value)
  }
  const removeProject = (title) => {
    const project = projectList.removeItem(title)
    updateStorage()
    return project
  }

  const reset = () => {
    projectList.clear()
    updateStorage()
  }

  function init() {
    if (!getProject(GENERAL_ID)) {
      addProject(GENERAL_ID)
    }

    if (!getProject(TODAY_ID)) {
      addProject(TODAY_ID)
    }
    const today = getProject(TODAY_ID)
    today.update = () => {
      today.getItem().clear()
      for (const todo of getTodosDueToday(projectList)) {
        today.getItem().addItem(todo)
      }
    }

    console.log(projectList)
  }

  init()

  return Object.freeze({
    updateStorage,
    addProject,
    getProject,
    removeProject,
    reset,
    get projectList() {
      return projectList
    },
  })
})()
