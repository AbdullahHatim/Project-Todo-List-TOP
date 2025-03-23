import "./main-style.css"
import PubSub from "pubsub-js"
import { ProjectManager } from "@/services/projectsmanager"

const PROJECT_TOPIC = "Clicked-Project"
const GENERAL_ID = "8adb2c18cafb0d0ad1a0113a080af51e"
const TODAY_ID = "7925cbea7729ed237b37d5de3dc96218"
const DEFAULT_TODOLIST_ID = "7a109073db7959600fcfa3414e7c85e6"

function getContent() {
  const content = document.createElement("div")
  content.className = "inner-content"
  PubSub.subscribe(PROJECT_TOPIC, (msg, project) => {
    let title = project.title
    if (title === GENERAL_ID) {
      title = "General"
    }
    if (title === TODAY_ID) {
      title = "Today"
    }

    content.innerHTML = `
    <h1>${title}</h1>`
  })
  function showDefaultProject() {
    PubSub.publish(PROJECT_TOPIC, ProjectManager.getProject(GENERAL_ID))
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
