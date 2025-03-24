import storage from "./storage"
import PubSub from "pubsub-js"
import { ProjectList } from "../components/project/projectlist"
import { getTodosDueToday } from "@/components/utils/gettodosduetoday"

const STORAGE_TOPIC = "storage_update"
const GENERAL_ID = "8adb2c18cafb0d0ad1a0113a080af51e"
const TODAY_ID = "7925cbea7729ed237b37d5de3dc96218"
const DEFAULT_TODOLIST_ID = "7a109073db7959600fcfa3414e7c85e6"
const MAIN_KEY = "projectlist"
const PREDEFINED_KEY = "predefined"

export const ProjectManager = (() => {
  const projectList = new ProjectList()
  const predefinedProjectList = new ProjectList()

  const updateStorage = () => {
    storage.set(MAIN_KEY, projectList.toString())
    storage.set(PREDEFINED_KEY, predefinedProjectList.toString())
    PubSub.publish(STORAGE_TOPIC, () => {})
  }

  const addProject = (title) => {
    projectList.addItem(title).getItem().addItem(DEFAULT_TODOLIST_ID)
    updateStorage()
  }

  const getProject = (value) => {
    const project = projectList.getItem(value) || predefinedProjectList.getItem(value)
    return project
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
    updateStorage()
    init()
  }

  function init() {
    const projectListJSON = storage.get(MAIN_KEY)
    const preDefinedJSON = storage.get(PREDEFINED_KEY)

    if (projectListJSON) {
      projectList.parse(projectListJSON)
    }
    if (preDefinedJSON) {
      predefinedProjectList.parse(preDefinedJSON)
    }

    if (!getProject(GENERAL_ID)) {
      predefinedProjectList.addItem(GENERAL_ID).getItem().addItem(DEFAULT_TODOLIST_ID)
    }

    if (!getProject(TODAY_ID)) {
      predefinedProjectList.addItem(TODAY_ID).getItem().addItem(DEFAULT_TODOLIST_ID)
    }
    updateStorage()
  }

  init()

  function getGeneralProject() {
    return getProject(GENERAL_ID)
  }
  function getTodayProject() {
    const today = getProject(TODAY_ID)
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
    return project === getProject(GENERAL_ID)
  }
  function isTodayProject(project) {
    return project === getProject(TODAY_ID)
  }
  function isPreDefinedProject(project) {
    const condition = isTodayProject(project) || isGeneralProject(project)
    return condition
  }
  function isDefaultTodoList(todoList) {
    return todoList.title === DEFAULT_TODOLIST_ID
  }
  function getDefaultTodoList(project) {
    return project.list.find((todoList) => isDefaultTodoList(todoList))
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
    isPreDefinedProject,
    isDefaultTodoList,
    getDefaultTodoList,
    get projectList() {
      return projectList
    },
    get predefinedProjectList() {
      return predefinedProjectList
    },
  })
})()
