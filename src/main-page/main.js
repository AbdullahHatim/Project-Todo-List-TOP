import "./main-style.css"
import PubSub from "pubsub-js"
import { ProjectManager } from "@/services/projectsmanager"

const PROJECT_TOPIC = "Clicked-Project"

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
    }
    if (ProjectManager.isTodayProject(project)) {
      title = "Today"
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
        iconInput.disabled = true
        iconInput.style.width = "0"
      } else {
        iconInput.addEventListener("click", () => {
          iconInput.setSelectionRange(0, 2)
        })

        iconInput.addEventListener("keypress", (e) => {
          if (e.key !== "Enter") return
          project.icon = iconInput.value
          ProjectManager.updateStorage()
          renderProject()
        })

        input.addEventListener("input", resizeInput)
        input.addEventListener("keypress", (e) => {
          if (e.key !== "Enter") return
          project.title = input.value
          ProjectManager.updateStorage()
          renderProject()
        })
        resizeInput.call(input)
        function resizeInput() {
          this.style.width = this.value.length + 3 + "ch"
        }
      }
      const defaultTodoList = ProjectManager.getDefaultTodoList(project)

      const removeIcon = `<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z"></path><rect width="14" height="1" x="5" y="6" fill="currentColor" rx="0.5"></rect><path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z"></path><path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z"></path></g></svg>`
      const completeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="tb7nk6f"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5056 9.00958C16.2128 8.71668 15.7379 8.71668 15.445 9.00958L10.6715 13.7831L8.72649 11.8381C8.43359 11.5452 7.95872 11.5452 7.66583 11.8381C7.37294 12.1309 7.37293 12.6058 7.66583 12.8987L10.1407 15.3736C10.297 15.5299 10.5051 15.6028 10.7097 15.5923C10.8889 15.5833 11.0655 15.5104 11.2023 15.3735L16.5056 10.0702C16.7985 9.77735 16.7985 9.30247 16.5056 9.00958Z" fill="currentColor"></path></svg>`
      for (const todo of defaultTodoList.list) {
        const todoButton = createMainButton(todo.title, "", "main-item todo")
        if (todo.checked) {
          todoButton.classList.add("checked")
        } else {
          todoButton.classList.remove("checked")
        }

        function addRemoveButton() {
          const removeButton = document.createElement("button")
          removeButton.classList.add("remove-button")
          removeButton.innerHTML = removeIcon
          todoButton.appendChild(removeButton)
          removeButton.addEventListener("click", () => {
            function remove() {
              todoButton.remove()
              defaultTodoList.removeItem(todo.title)
              ProjectManager.updateStorage()
              renderProject()
            }
            if (todo.checked) {
              remove()
              return
            }
            const okButton = modal.confirm(`Delete Todo ${todo.title}?`)
            okButton.addEventListener("click", () => {
              remove()
            })
          })
        }
        function addCompleteButton() {
          const completeButton = todoButton.querySelector(".icon")
          completeButton.classList.add("complete-button")
          completeButton.innerHTML = completeIcon
          completeButton.addEventListener("click", () => {
            todo.toggleCheck()
            ProjectManager.updateStorage()
            renderProject()
          })
        }
        addRemoveButton()
        addCompleteButton()
        block.appendChild(todoButton)
      }
      const addTaskIcon = `<svg ><path fill="currentColor" fill-rule="evenodd" d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"></path></svg>`
      const addTaskButton = createMainButton("Add Todo", addTaskIcon, "main-item add-button")

      addTaskButton.addEventListener("click", () => {
        const prompt = modal.prompt("Enter Todo Name")
        prompt.addEventListener("click", () => {
          defaultTodoList.addItem(prompt.getInput())
          ProjectManager.updateStorage()
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
