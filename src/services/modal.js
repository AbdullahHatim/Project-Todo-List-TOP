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
      modalDiv.style.animationName = "show"
    }

    function hide() {
      modalDiv.style.animationName = "hide"
    }

    modalDiv.addEventListener("click", hide)

    function confirm(msg) {
      modalContent.className = "modal-content confirm"
      modalContent.innerHTML = /*html*/ `
      <p class="msg">${msg || ""}</p>
      <div class="buttons">
      <button class="focus" style="scale: 0"></button>
      <button class="ok">ok</button>
      <button class="cancel">cancel</button>
     </div>`
      const okButton = modalContent.querySelector(".ok")
      const cancelButton = modalContent.querySelector(".cancel")
      const focusBotton = modalContent.querySelector(".focus")

      cancelButton.addEventListener("click", hide)
      okButton.addEventListener("click", hide)

      focusBotton.focus()
      focusBotton.setAttribute("tabindex", -1)
      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })

      show()
      return okButton
    }

    function prompt(msg) {
      modalContent.className = "modal-content prompt"
      modalContent.innerHTML = /*html*/ `
      <p class="msg">${msg || ""}</p>
      <input type="text" class="input">
      <div class="buttons">
      <button class="ok">ok</button>
      <button class="cancel">cancel</button>
     </div>`
      const okButton = modalContent.querySelector(".ok")
      const cancelButton = modalContent.querySelector(".cancel")
      const input = modalContent.querySelector("input")

      cancelButton.addEventListener("click", hide)
      okButton.addEventListener("click", hide)

      okButton.getInput = () => String(input.value)

      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })

      input.focus()
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          okButton.click()
        }
      })
      show()
      return okButton
    }

    return { confirm, prompt }
  })()

  window.modal = modal
}
document.addEventListener("DOMContentLoaded", load())
