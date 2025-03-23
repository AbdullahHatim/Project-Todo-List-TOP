import "./main-style.css"
import PubSub from "pubsub-js"
import { ProjectManager } from "@/services/projectsmanager"

const PROJECT_TOPIC = "Clicked-Project"

function getContent() {
  const content = document.createElement("div")
  content.className = "inner-content"
  PubSub.subscribe(PROJECT_TOPIC, (msg, project) => {
    let title = project.title
    if (ProjectManager.isGeneralProject(project)) {
      title = "General"
    }
    if (ProjectManager.isTodayProject(project)) {
      title = "Today"
    }

    content.innerHTML = `
    <h1>${title}</h1>`
  })
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
