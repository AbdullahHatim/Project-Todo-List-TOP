import "./modal-style.css"

function load() {
  const modal = (function () {
    function generateElements(html) {
      const template = document.createElement("template")
      template.innerHTML = html.trim()
      return template.content.children
    }
    const modalDiv = document.createElement("div")
    modalDiv.classList.add("modal")
    document.querySelector("#content").appendChild(modalDiv)

    let modalContent = document.createElement("div")
    modalContent.className = "modal-content"
    modalDiv.appendChild(modalContent)

    function show() {
      modalDiv.classList.add("show")
      modalDiv.style.animation = "var(--transition-time) ease show"
    }

    function hide() {
      modalDiv.style.animation = "var(--transition-time) ease hide"
      modalDiv.classList.remove("show")
    }

    modalDiv.addEventListener("click", () => {
      if (modalDiv.classList.contains("show")) {
        hide()
      } else {
        show()
      }
    })

    function confirm(msg) {
      let ok = false

      modalContent.className = "modal-content confirm"
      modalContent.innerHTML = /*html*/ `
      <p class="msg">${msg || ""}</p>
      <div class="buttons">
      <button class="ok">ok</button>
      <button class="cancel">cancel</button>
     </div>`
      const okButton = modalContent.querySelector(".ok")
      const cancelButton = modalContent.querySelector(".cancel")
      cancelButton.addEventListener("click", hide)
      okButton.addEventListener("click", hide)

      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })
      show()
      return okButton
    }

    function prompt(msg) {
      modalContent.className = "modal-content confirm"
      modalContent.innerHTML = /*html*/ `
      <p class="msg">${msg || ""}</p>
      <input type="text" id="input">
      <div class="buttons">
      <button class="ok">ok</button>
      <button class="cancel">cancel</button>
     </div>`

      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })
    }
    return { confirm, prompt }
  })()

  window.modal = modal
}
document.addEventListener("DOMContentLoaded", load())
