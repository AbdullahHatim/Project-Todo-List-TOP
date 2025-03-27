import "./main-page-style.css"

const content = document.querySelector("#content")
content.innerHTML = /*html*/ `
<aside class="side"></aside>
<main class="main"></main>
<div class="settings-modal">
  <div class="settings-content">
    <button class="settings-download">Download Projects</button>
    <button class="settings-upload">Upload Projects</button>
    <button class="settings-reset">Reset Everything</button>
  </div>
</div>`

const side = document.querySelector(".side")
const main = document.querySelector(".main")

main.innerHTML = /*js*/ `
<div class="main-content"></div>`

side.innerHTML = /*js*/ `
<div class="overlay"></div>
<div class="top">
  <button class="menu-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z" clip-rule="evenodd"></path></svg>
  </button>
  <button class="settings-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-text-color)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3" fill="none"></circle>
    </svg>
  </button>
</div>
<div class="side-content">
  <div class="pre-made"></div>
  <div class="user-made"></div>
</div>`
const overlay = side.querySelector(".overlay")
const slide = (e) => {
  if (!side.classList.contains("slide-out")) {
    side.classList.add("slide-out")
    overlay.style.animationName = "hide"
  } else {
    side.classList.remove("slide-out")
    overlay.style.animationName = "show"
  }
}
side.slide = slide
document.querySelector(".menu-button").addEventListener("click", slide)
document.querySelector(".overlay").addEventListener("click", slide)

if (window.matchMedia("(max-width: 750px)").matches) {
  side.classList.add("slide-out")
}

window.matchMedia("(max-width: 750px)").addEventListener("change", (event) => {
  if (event.matches) {
    side.classList.add("slide-out")
  }
  if (!event.matches) {
    side.classList.remove("slide-out")
  }
})

//---------------load-content-----------------
import("@/services/modal")
import("./side.js")
import("./main.js")
import { ProjectManager } from "@/services/projectsmanager"

// Settings modal functionality
const settingsModal = document.querySelector(".settings-modal")
const settingsButton = document.querySelector(".settings-button")
const downloadButton = document.querySelector(".settings-download")
const uploadButton = document.querySelector(".settings-upload")
const resetButton = document.querySelector(".settings-reset")

settingsButton.addEventListener("click", () => {
  settingsModal.style.display = "flex"
  settingsModal.style.animationName = "show"
})

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.animationName = "hide"
  }
})

downloadButton.addEventListener("click", () => {
  const data = {
    projectList: ProjectManager.projectList.toString(),
    generalProject: ProjectManager.getGeneralProject().toString(),
  }
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "projects.json"
  a.click()
  URL.revokeObjectURL(url)
  settingsModal.style.display = "none"
})

uploadButton.addEventListener("click", () => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        ProjectManager.resetEverything()
        ProjectManager.projectList.parse(data.projectList)
        // Create General project from saved data
        ProjectManager.getGeneralProject().parse(data.generalProject)

        ProjectManager.updateStorage()
        settingsModal.style.display = "none"
        window.location.reload()
      } catch (err) {
        modal.confirm("Invalid projects file")
      }
    }
    reader.readAsText(file)
  }
  input.click()
})

resetButton.addEventListener("click", () => {
  const confirmBtn = modal.confirm("Are you sure you want to reset everything?")
  confirmBtn.addEventListener("click", () => {
    ProjectManager.resetEverything()
    settingsModal.style.display = "none"
    window.location.reload()
  })
})
