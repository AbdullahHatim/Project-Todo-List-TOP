import storage from "./storage"
import { ProjectList } from "../components/project/projectlist"
import { getTodosDueToday } from "@/components/utils/gettodosduetoday"
import { Project } from "@/components/project/project"

const GENERAL_ID = "8adb2c18cafb0d0ad1a0113a080af51e"
const TODAY_ID = "7925cbea7729ed237b37d5de3dc96218"
const DEFAULT_TODOLIST_ID = "7a109073db7959600fcfa3414e7c85e6"

export const ProjectManager = (() => {
  const mainKey = "projectlist"
  const preDefinedKey = "predefined"
  const projectListJSON = storage.get(mainKey)
  const preDefinedJSON = storage.get(preDefinedKey)
  const projectList = new ProjectList()
  const predefinedProjectList = new ProjectList()

  if (projectListJSON) {
    projectList.parse(projectListJSON)
  }
  if (preDefinedJSON) {
    predefinedProjectList.parse(projectListJSON)
  }

  const updateStorage = () => {
    storage.set(mainKey, projectList.toString())
    storage.set(preDefinedKey, predefinedProjectList.toString())
  }

  const addProject = (title) => {
    projectList.addItem(title).getItem().addItem(DEFAULT_TODOLIST_ID)
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
    predefinedProjectList.clear()
    updateStorage()
  }

  function init() {
    if (!predefinedProjectList.getItem(GENERAL_ID)) {
      predefinedProjectList.addItem(GENERAL_ID).getItem().addItem(DEFAULT_TODOLIST_ID)
    }

    if (!predefinedProjectList.getItem(TODAY_ID)) {
      predefinedProjectList.addItem(TODAY_ID).getItem().addItem(DEFAULT_TODOLIST_ID)
    }
    updateStorage()
  }

  init()

  function getGeneralProject() {
    return predefinedProjectList.getItem(GENERAL_ID)
  }
  function getTodayProject() {
    const today = predefinedProjectList.getItem(TODAY_ID)
    today.update = () => {
      today.getItem().clear()
      for (const todo of getTodosDueToday(projectList)) {
        today.getItem().addItem(todo)
      }
      for (const todo of getTodosDueToday(predefinedProjectList)) {
        today.getItem().addItem(todo)
      }
    }
    today.update()
    return today
  }
  function isGeneralProject(project = new Project()) {
    return project === predefinedProjectList.getItem(GENERAL_ID)
  }
  function isTodayProject(project = new Project()) {
    return project === predefinedProjectList.getItem(TODAY_ID)
  }

  return Object.freeze({
    updateStorage,
    addProject,
    getProject,
    removeProject,
    reset,
    getGeneralProject,
    isGeneralProject,
    getTodayProject,
    isTodayProject,
    get projectList() {
      return projectList
    },
  })
})()
