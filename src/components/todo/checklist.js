import { CheckItem } from "./checkitem"
class CheckList {
  #list = []

  addItem(value) {
    const checkItem = value instanceof CheckItem ? value : new CheckItem(value)
    this.#list.push(checkItem)
    return this
  }
  getItem(value) {
    let checkItem = ""

    if (typeof value === "number") {
      checkItem = this.#list[value]
    } else if (typeof value === "string") {
      checkItem = this.#list.find((checkItem) => checkItem.title === value)
    }

    return checkItem
  }
  removeItem(value) {
    let checkItem = this.getItem(value)

    if (checkItem) this.#list.splice(this.#list.indexOf(checkItem), 1)

    return checkItem
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

export { CheckList }
