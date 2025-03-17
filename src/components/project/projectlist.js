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

  // Serialize Each Todo
  //TODO: maybe add this "list" mess to the list control components
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
let project = list.getItem("new Project")
let todoList = project.addItem("new TodoList").getItem(0)
todoList.addItem("New Todo").getItem(0).checkList.addItem("Ride a Person")
console.log(list)
export { ProjectList }
