import { Todo } from "./todo"
import { addListControlComponents } from "../utils/listcontrols"

class TodoList {
  #title = ""
  #creationDate = new Date()
  #list = []

  constructor(title) {
    this.#title = title || ""
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
  toString() {
    return `
    {
      "title" : "${this.#title}",
      "creationDate": "${this.#creationDate.toString()}",
     "list": [
      ${(() => {
        return this.#list.map((todo, index) => {
          let string = todo.toString()

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
    this.#creationDate = new Date(obj.creationDate)

    for (let i of obj.list) this.addItem(new Todo().parse(i))
    return this
  }
}
addListControlComponents(TodoList, Todo)

export { TodoList }
