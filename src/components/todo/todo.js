import { Priority } from "./priority"
import { CheckList } from "./checklist"

class Todo {
  #title = ""
  #description = ""
  #dueDate = new Date()
  #creationDate = new Date()
  #priority = Priority.NORMAL
  #notes = ""
  #checkList = new CheckList()

  constructor(title) {
    this.#title = title || ""
  }

  set title(value) {
    this.#title = String(value)
  }

  get title() {
    return this.#title
  }

  set description(value) {
    this.#description = String(value)
  }

  get description() {
    return this.#description
  }

  set dueDate(value) {
    this.#dueDate = value instanceof Date ? value : new Date()
  }

  get dueDate() {
    return this.#dueDate
  }

  get creationDate() {
    return this.#creationDate
  }

  set priority(value) {
    this.#priority = value
  }

  get priority() {
    return this.#priority
  }

  set notes(value) {
    this.#notes = String(value)
  }

  get notes() {
    return this.#notes
  }

  get checkList() {
    return this.#checkList
  }

  toString() {
    return `
    {
     "title": "${this.#title}",
     "description": "${this.#description}",
     "dueDate": "${this.#dueDate.toString()}",
     "creationDate": "${this.#creationDate.toString()}",
     "priority": ${this.#priority},
     "notes": "${this.#notes}",
     "checkList": ${this.#checkList.toString()}
    }
    `.trim()
  }

  parse(value) {
    const obj = typeof value === "object" ? value : JSON.parse(value)
    this.#title = obj.title
    this.#description = obj.description
    this.#dueDate = new Date(obj.dueDate)
    this.#creationDate = new Date(obj.creationDate)
    this.#notes = obj.notes
    this.#checkList = new CheckList().parse(obj.checkList)
    return this
  }
}

export { Todo }
