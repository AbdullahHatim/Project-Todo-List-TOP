import "./main-page-style.css"

const content = document.querySelector("#content")
content.innerHTML = /*html*/ `
<aside class="side"></aside>
<main class="main"></main>`

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
