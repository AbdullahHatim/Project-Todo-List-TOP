import "./main-style.css"
import PubSub from "pubsub-js"
import { ProjectManager } from "@/services/projectsmanager"

const PROJECT_TOPIC = "Clicked-Project"
const EMPTY = "empty"
function createMainButton(text, icon = "📄", classes = "main-item") {
  const button = document.createElement("button")
  button.classList.add(...classes.split(" "))
  button.innerHTML = /*js*/ `
    <span class="icon">${icon}</span><p>${text}</p>
  `
  return button
}

function getContent() {
  const content = document.createElement("div")
  content.className = "inner-content"
  let project
  PubSub.subscribe(PROJECT_TOPIC, (msg, data) => {
    project = data
    renderProject()
  })

  function renderProject() {
    content.innerHTML = ``
    if (!project) return
    let title = project.title
    let icon = project.icon

    if (ProjectManager.isGeneralProject(project)) {
      title = "General"
      icon = EMPTY
    }
    if (ProjectManager.isTodayProject(project)) {
      title = "Today"
      icon = EMPTY
    }
    const defaultBlockDiv = (function getDefaultBlock() {
      const block = document.createElement("div")
      block.innerHTML = /*html*/ `<div class="main-item header">
        <input type="text" class="clear-input icon" value="${icon}" maxlength="2">
        <input type="text" class="clear-input title" value="${title}">
      </div>
      `
      const iconInput = block.querySelector(".icon")
      const input = block.querySelector(".title")
      if (ProjectManager.isPreDefinedProject(project)) {
        input.disabled = true
        if (iconInput.value === EMPTY) {
          iconInput.style.width = "0"
        }
      } else {
        iconInput.addEventListener("click", () => {
          iconInput.setSelectionRange(0, 2)
        })

        iconInput.addEventListener("keypress", (e) => {
          if (e.key !== "Enter") return
          iconInput.blur()
          project.icon = iconInput.value
          ProjectManager.updateStorage()
        })

        input.addEventListener("input", resizeInput)
        input.addEventListener("keypress", (e) => {
          if (e.key !== "Enter") return
          input.blur()
          project.title = input.value
          ProjectManager.updateStorage()
        })
        resizeInput.call(input)
        function resizeInput() {
          this.style.width = this.value.length + 3 + "ch"
        }
      }
      const defaultTodoList = ProjectManager.getDefaultTodoList(project)

      for (const todo of defaultTodoList.list) {
        const todoButton = createMainButton(todo.title, "", "main-item todo")
        block.appendChild(todoButton)
      }
      const addTaskIcon = `<svg ><path fill="currentColor" fill-rule="evenodd" d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"></path></svg>`
      const addTaskButton = createMainButton("Add Todo", addTaskIcon, "main-item add-button")

      addTaskButton.addEventListener("click", () => {
        const prompt = modal.prompt("Enter Todo Name")
        prompt.addEventListener("click", () => {
          defaultTodoList.addItem(prompt.getInput())
          renderProject()
        })
      })

      block.appendChild(addTaskButton)
      return block
    })()

    content.append(defaultBlockDiv)
  }

  function showDefaultProject() {
    PubSub.publish(PROJECT_TOPIC, ProjectManager.getGeneralProject())
  }
  showDefaultProject()
  return content
}

function load() {
  const mainContent = document.querySelector(".main-content")

  const content = getContent()
  mainContent.appendChild(content)
}

document.addEventListener("DOMContentLoaded", load())
