import { CheckItem } from "./checkitem"
import { addListControlComponents } from "../utils/listcontrols"

//remove this comment and commit this together with todolist
class CheckList {
  #list = []

  set list(value) {
    this.#list = value instanceof Array ? value : []
  }

  get list() {
    return this.#list
  }

  // Serialize Each CheckItem
  toString() {
    return `
    {
     "list": [
      ${(() => {
        return this.#list.map((checkItem, index) => {
          let string = checkItem.toString()

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
    for (let i of obj.list) this.addItem(new CheckItem().parse(i))
    return this
  }
}
addListControlComponents(CheckList, CheckItem)

export { CheckList }
