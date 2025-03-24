import "./side-style.css"
import PubSub from "pubsub-js"
import { getTodosDueToday } from "@/components/utils/gettodosduetoday"
import { ProjectManager } from "@/services/projectsmanager"

const STORAGE_TOPIC = "storage_update"
const PROJECT_TOPIC = "Clicked-Project"

function createSideButton(text, icon = "📄", classes = "side-item") {
  const button = document.createElement("button")
  button.classList.add(...classes.split(" "))
  button.innerHTML = /*js*/ `
    <span class="icon">${icon}</span><p>${text}</p>
  `
  return button
}
function publishProject(project) {
  const side = document.querySelector(".side")
  PubSub.publish(PROJECT_TOPIC, project)
  if (window.matchMedia("(max-width: 750px)").matches) {
    side.slide()
  }
}
const side = document.querySelector(".side")

function getPreMadeContent() {
  const content = document.createElement("div")

  const addTaskIcon = /*js*/ `<svg xmlns="http://www.w3.org/2000/svg"><title>plus-circle</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`
  const generalIcon = /*js*/ `<svg xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fill-rule="evenodd" d="M8.062 4h7.876a2 2 0 0 1 1.94 1.515l2.062 8.246c.04.159.06.322.06.486V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.754a2 2 0 0 1 .06-.485L6.12 5.515A2 2 0 0 1 8.061 4Zm0 1a1 1 0 0 0-.97.758L5.03 14.004a1 1 0 0 0-.03.242V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.754a.997.997 0 0 0-.03-.242L16.91 5.758a1 1 0 0 0-.97-.758H8.061Zm6.643 10a2.75 2.75 0 0 1-5.41 0H7a.5.5 0 1 1 0-1h2.75a.5.5 0 0 1 .5.5 1.75 1.75 0 1 0 3.5 0 .5.5 0 0 1 .5-.5H17a.5.5 0 0 1 0 1h-2.295Z" clip-rule="evenodd"></path></svg>`
  const todayIcon = /*js*/ `<svg xmlns="http://www.w3.org/2000/svg"><title>calendar</title><path d="M7,2H8C8.55,2 9,2.45 9,3V4H14V3C14,2.45 14.45,2 15,2H16C16.55,2 17,2.45 17,3V4C18.66,4 20,5.34 20,7V18C20,19.66 18.66,21 17,21H6C4.34,21 3,19.66 3,18V7C3,5.34 4.34,4 6,4V3C6,2.45 6.45,2 7,2M15,4H16V3H15V4M8,4V3H7V4H8M6,5C4.9,5 4,5.9 4,7V8H19V7C19,5.9 18.1,5 17,5H6M4,18C4,19.1 4.9,20 6,20H17C18.1,20 19,19.1 19,18V9H4V18M12,13H17V18H12V13M13,14V17H16V14H13Z" /></svg>`

  const addTaskButton = createSideButton("Add Task", addTaskIcon, "side-item add-task")
  const generalProjectButton = createSideButton("General", generalIcon)
  const todayButton = createSideButton("Today", todayIcon)

  addTaskButton.addEventListener("click", () => {
    const prompt = modal.prompt("Enter Todo Name")
    prompt.addEventListener("click", () => {
      const generalProject = ProjectManager.getGeneralProject()
      const defaultTodoList = ProjectManager.getDefaultTodoList(generalProject)
      defaultTodoList.addItem(prompt.getInput())
      ProjectManager.updateStorage()
      generalProjectButton.click()
    })
  })

  generalProjectButton.addEventListener("click", () => {
    publishProject(ProjectManager.getGeneralProject())
  })

  todayButton.addEventListener("click", () => {
    publishProject(ProjectManager.getTodayProject())
  })

  content.append(addTaskButton, generalProjectButton, todayButton)
  return content
}

function getUserMadeContent() {
  const content = document.createElement("div")
  const projectHeader = document.createElement("h1")
  projectHeader.classList.add("side-item", "side-header")
  projectHeader.textContent = "Projects"

  const removeIcon = /*js*/ `<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx="0.5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>`

  function clearProjects() {
    const header = content.firstChild
    const addButton = content.lastChild
    content.innerHTML = ""
    content.append(header, addButton)
  }

  function renderProjects() {
    clearProjects()
    for (let i = 0; i < ProjectManager.projectList.list.length; i++) {
      const project = ProjectManager.getProject(i)

      const button = createSideButton(project.title)

      const removeButton = document.createElement("button")
      removeButton.classList.add("remove-button")
      removeButton.innerHTML = removeIcon
      button.appendChild(removeButton)

      removeButton.addEventListener("click", () => {
        const okButton = modal.confirm(`Delete Project ${project.icon} ${project.title}?`)
        okButton.addEventListener("click", () => {
          button.remove()
          ProjectManager.removeProject(project.title)
        })
      })

      const iconButton = button.querySelector("span")
      iconButton.addEventListener("click", () => {
        const inputPrompt = modal.prompt("Enter New Project Icon")
        inputPrompt.addEventListener("click", () => {
          project.icon = inputPrompt.getInput().substring(0, 2)
          ProjectManager.updateStorage()
          renderProjects()
        })
      })

      if (project.icon) {
        button.querySelector(".icon").textContent = project.icon
      }
      button.dataset.index = i
      content.insertBefore(button, content.lastChild)

      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index
        if (typeof index === "undefined") return
        publishProject(ProjectManager.getProject(Number(index)))
      })
    }
  }

  const addProjectIcon = /*js*/ `<svg xmlns="http://www.w3.org/2000/svg"><title>plus</title><path d="M5,13V12H11V6H12V12H18V13H12V19H11V13H5Z" /></svg>`
  const addProjectButton = createSideButton("Add Project", addProjectIcon, "side-item add-project")
  content.append(projectHeader, addProjectButton)

  addProjectButton.addEventListener("click", () => {
    const inputPrompt = modal.prompt("Enter Project Name")
    inputPrompt.addEventListener("click", () => {
      ProjectManager.addProject(inputPrompt.getInput())
      renderProjects()
    })
  })

  renderProjects()
  PubSub.subscribe(STORAGE_TOPIC, () => {
    renderProjects()
  })
  // content.insertBefore(createSideButton("Project 1", "😀"), addProjectButton)
  // content.insertBefore(createSideButton("My Lovely Project", "😍"), addProjectButton)

  return content
}

function load() {
  const sideContent = document.querySelector(".side-content")
  const preMade = sideContent.querySelector(".pre-made")
  const userMade = sideContent.querySelector(".user-made")

  const preMadeContent = getPreMadeContent()
  preMade.appendChild(preMadeContent)

  const userMadeContent = getUserMadeContent()
  userMade.appendChild(userMadeContent)

  sideContent.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      for (const button of sideContent.querySelectorAll("button")) {
        button.classList.remove("active")
      }
      e.target.classList.add("active")
    }
  })
}

document.addEventListener("DOMContentLoaded", load())
