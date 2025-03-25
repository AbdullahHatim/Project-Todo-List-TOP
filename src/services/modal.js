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

    function modifyTodo(msg, todo) {
      modalContent.className = "modal-content modify-todo"
      modalContent.innerHTML = /*html*/ `
      <p class="msg">${msg || ""}</p>
      <div class="input-group">
        <label>Title</label>
        <input type="text" class="input input-title" value="${todo?.title || ""}">
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea class="input input-description">${todo?.description || ""}</textarea>
      </div>
      <div class="input-group">
        <label>Notes</label>
        <textarea class="input input-notes">${todo?.notes || ""}</textarea>
      </div>
      <div class="additional-controls">
        <div class="date-picker">
          <label>Due Date</label>
          <input type="datetime-local" class="input input-dueDate"
                 value="${todo?.dueDate ? todo.dueDate.toISOString().slice(0, 16) : ""}">
        </div>
        <div class="priority-buttons">
          <label>Priority</label>
          <button class="priority-btn ${todo?.priority === 1 ? "active" : ""}" data-value="1">High</button>
          <button class="priority-btn ${todo?.priority === 0 ? "active" : ""}" data-value="0">Normal</button>
          <button class="priority-btn ${todo?.priority === -1 ? "active" : ""}" data-value="-1">Low</button>
        </div>
      </div>
      <div class="buttons">
        <button class="ok">ok</button>
        <button class="cancel">cancel</button>
      </div>`
      const okButton = modalContent.querySelector(".ok")
      const cancelButton = modalContent.querySelector(".cancel")
      const inputs = modalContent.querySelectorAll(".input")
      const priorityButtons = modalContent.querySelectorAll(".priority-btn")

      let selectedPriority = todo?.priority ?? 0
      priorityButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          priorityButtons.forEach((b) => b.classList.remove("active"))
          btn.classList.add("active")
          selectedPriority = Number(btn.dataset.value)
        })
      })

      cancelButton.addEventListener("click", hide)
      okButton.addEventListener("click", hide)

      okButton.getInput = () => ({
        title: modalContent.querySelector(".input-title").value,
        description: modalContent.querySelector(".input-description").value,
        notes: modalContent.querySelector(".input-notes").value,
        dueDate: modalContent.querySelector(".input-dueDate").value,
        priority: selectedPriority,
      })

      modalContent.addEventListener("click", (e) => {
        e.stopPropagation()
      })

      inputs[0].focus()
      modalContent.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          okButton.click()
        }
      })
      show()
      return okButton
    }

    return { confirm, prompt, modifyTodo }
  })()

  window.modal = modal
}
document.addEventListener("DOMContentLoaded", load())
