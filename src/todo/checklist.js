import { CheckItem } from "./checkitem"
class CheckList {
  #items = []

  addCheckItem(value) {
    const checkItem = value instanceof CheckItem ? value : new CheckItem(value)
    this.#items.push(checkItem)
    return this
  }

  removeCheckItem(value) {
    let checkItem = ""

    if (typeof value === "number") {
      checkItem = this.#items[value]
      this.#items.splice(value, 1)
    } else if (typeof value === "string") {
      checkItem = this.#items.find((checkItem) => checkItem.title === value)
      if (checkItem) this.#items.splice(this.#items.indexOf(checkItem), 1)
    }

    return checkItem
  }

  get items() {
    return this.#items
  }
  // Serialize Each CheckItem
  toString() {
    return `
    {
     "items": [
      ${(() => {
        return this.#items.map((checkItem, index) => {
          let string = checkItem.toString()

          const lastItem = index == this.#items.length
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
    for (let i of obj.items) this.addCheckItem(new CheckItem().parse(i))
    return this
  }
}

export { CheckList }
