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
     "list": [
      ${(() => {
        //Fix this for every List
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

    for (let i of obj.list) this.addItem(new TodoList().parse(i))
    return this
  }
}

addListControlComponents(ProjectList, Project)
console.log(new ProjectList().addItem("new Project"))
export { ProjectList }
