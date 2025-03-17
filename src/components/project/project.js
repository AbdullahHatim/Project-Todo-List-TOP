import { Todo } from "../todo/todo"
import { TodoList } from "../todo/todolist"
import { addListControlComponents } from "../utils/listcontrols"

class Project {
  #title = ""
  #icon = ""
  #creationDate = new Date()
  #list = []

  constructor(title, icon) {
    this.#title = title || ""
    this.#icon = icon || ""
  }

  set title(value) {
    this.#title = String(value)
  }

  get title() {
    return this.#title
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

  // Serialize Each Todo
  //TODO: maybe add this "list" mess to the list control components
  toString() {
    return `
    {
      "title" : "${this.#title}",
      "creationDate": "${this.#creationDate.toString()}",
      "icon": "${this.#icon}",
     "list": [
      ${(() => {
        return this.#list.map((todoList, index) => {
          let string = todoList.toString()

          const lastItem = index == this.#list.length
          if (lastItem) string = string.slice(0, -1)

          return string
        })
      })()}
     ]
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
