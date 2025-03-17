import { Project } from "./project"
import { addListControlComponents } from "../utils/listcontrols"

class ProjectList {
  #list = []

  set list(value) {
    this.#list = value instanceof Array ? value : []
  }

  get list() {
    return this.#list
  }

  toString() {
    return `
    {
     "list": [ ${this.listToJSON()} ]
    }
    `.trim()
  }

  parse(value) {
    const obj = typeof value === "object" ? value : JSON.parse(value)

    for (let i of obj.list) this.addItem(new TodoList().parse(i))
    return this
  }
}

addListControlComponents(ProjectList, Project)
const list = new ProjectList().addItem("new Project")
let project = list.getItem()
let todoList = project.addItem("new TodoList").getItem()
todoList.addItem("New Todo").getItem().checkList.addItem("Ride a Person")
console.log(list)
export { ProjectList }
