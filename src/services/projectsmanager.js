import storage from "./storage"
import { ProjectList } from "../components/project/projectlist"
import { getTodosDueToday } from "@/components/utils/gettodosduetoday"

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
  const resetProject = (project) => {
    const title = project.title
    removeProject(project)
    addProject(title)
  }
  const resetEverything = () => {
    projectList.clear()
    predefinedProjectList.clear()
    init()
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
  function isGeneralProject(project) {
    return project === predefinedProjectList.getItem(GENERAL_ID)
  }
  function isTodayProject(project) {
    return project === predefinedProjectList.getItem(TODAY_ID)
  }
  function isDefaultTodoList(todoList) {
    return todoList.title === DEFAULT_TODOLIST_ID
  }
  function getDefaultTodoList(project) {
    return project.list.find((todoList) => isDefaultTodoList(todoList)).list
  }

  return Object.freeze({
    updateStorage,
    addProject,
    getProject,
    removeProject,
    resetProject,
    resetEverything,
    getGeneralProject,
    isGeneralProject,
    getTodayProject,
    isTodayProject,
    isDefaultTodoList,
    getDefaultTodoList,
    get projectList() {
      return projectList
    },
  })
})()
