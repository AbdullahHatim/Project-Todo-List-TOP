import { TodoList } from "../todo/todolist"
import { addListControlComponents } from "../utils/listcontrols"

class Project {
  #title = ""
  #icon = ""
  #creationDate = new Date()
  #list = []

  constructor(title, icon) {
    this.#title = title || ""
    this.#icon = icon || "📄"
  }

  set title(value) {
    this.#title = String(value)
  }

  get title() {
    return this.#title
  }
  set icon(value) {
    this.#icon = String(value)
  }

  get icon() {
    return this.#icon
  }
  get creationDate() {
    return this.#creationDate
  }

  set list(value) {
    this.#list = value instanceof Array ? value : []
  }

  get list() {
    return this.#list
  }

  toString() {
    return `
    {
      "title" : "${this.#title}",
      "creationDate": "${this.#creationDate.toString()}",
      "icon": "${this.#icon}",
      "list": [ ${this.listToJSON()} ]
    }
    `.trim()
  }

  parse(value) {
    const obj = typeof value === "object" ? value : JSON.parse(value)
    this.#title = obj.title
    this.#icon = obj.icon
    this.#creationDate = new Date(obj.creationDate)

    for (let i of obj.list) this.addItem(new TodoList().parse(i))
    return this
  }
}

addListControlComponents(Project, TodoList)

export { Project }
