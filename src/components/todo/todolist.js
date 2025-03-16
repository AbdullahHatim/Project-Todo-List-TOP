import { Todo } from "./todo"
//TODO: work on category enum
class TodoList {
  #title = ""
  #category = ""
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

  addTodo(value) {
    const todo = value instanceof Todo ? value : new Todo(value)
    this.#list.push(todo)
    return this
  }

  getTodo(value) {
    let todo = ""

    if (typeof value === "number") {
      todo = this.#list[value]
    } else if (typeof value === "string") {
      todo = this.#list.find((todo) => todo.title === value)
    }

    return todo
  }
  removeTodo(value) {
    let todo = this.getTodo(value)

    if (todo) this.#list.splice(this.#list.indexOf(todo), 1)

    return todo
  }

  get list() {
    return this.#list
  }
  // Serialize Each Todo
  toString() {
    return `
    {
      "title" : "${this.#title}",
      "category": "${this.#category}",
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

    for (let i of obj.list) this.addTodo(new Todo().parse(i))
    return this
  }
}

let list = new TodoList()
list.addTodo("Do Something")
list.list[0].description = "Doing something so you do something when bla"
list.getTodo("Do Something").checkList.addItem("ride a person")
list.getTodo("Do Something").checkList.getItem("ride a person").toggleCheck()

console.log(new TodoList().parse(list.toString()))

export { TodoList }
