import "./side-style.css"
import PubSub from "pubsub-js"

const addTaskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`
const generalIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M8.062 4h7.876a2 2 0 0 1 1.94 1.515l2.062 8.246c.04.159.06.322.06.486V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.754a2 2 0 0 1 .06-.485L6.12 5.515A2 2 0 0 1 8.061 4Zm0 1a1 1 0 0 0-.97.758L5.03 14.004a1 1 0 0 0-.03.242V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.754a.997.997 0 0 0-.03-.242L16.91 5.758a1 1 0 0 0-.97-.758H8.061Zm6.643 10a2.75 2.75 0 0 1-5.41 0H7a.5.5 0 1 1 0-1h2.75a.5.5 0 0 1 .5.5 1.75 1.75 0 1 0 3.5 0 .5.5 0 0 1 .5-.5H17a.5.5 0 0 1 0 1h-2.295Z" clip-rule="evenodd"></path></svg>`
const todayIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar</title><path d="M7,2H8C8.55,2 9,2.45 9,3V4H14V3C14,2.45 14.45,2 15,2H16C16.55,2 17,2.45 17,3V4C18.66,4 20,5.34 20,7V18C20,19.66 18.66,21 17,21H6C4.34,21 3,19.66 3,18V7C3,5.34 4.34,4 6,4V3C6,2.45 6.45,2 7,2M15,4H16V3H15V4M8,4V3H7V4H8M6,5C4.9,5 4,5.9 4,7V8H19V7C19,5.9 18.1,5 17,5H6M4,18C4,19.1 4.9,20 6,20H17C18.1,20 19,19.1 19,18V9H4V18M12,13H17V18H12V13M13,14V17H16V14H13Z" /></svg>`

function createSideButton(text, icon = "📄", classes = "side-item") {
  const button = document.createElement("button")
  button.classList.add(...classes.split(" "))
  button.innerHTML = /*javascript*/ `
    <span class="icon">${icon}</span><p>${text}</p>
  `
  return button
}

function getPreMadeContent() {
  const content = document.createElement("div")

  content.append(
    createSideButton("Add Task", addTaskIcon, "side-item add-task"),
    createSideButton("General", generalIcon),
    createSideButton("Today", todayIcon)
  )

  return content
}

function getUserMadeContent() {
  const content = document.createElement("div")
  const projectHeader = document.createElement("h1")
  projectHeader.classList.add("side-item", "side-header")
  projectHeader.textContent = "Projects"

  content.append(
    projectHeader /*anti-prettier comment*/,
    createSideButton("Project 1", "😀"),
    createSideButton("My Lovely Project", "😍")
  )

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
