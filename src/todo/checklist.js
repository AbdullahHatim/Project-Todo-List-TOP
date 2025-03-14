import { CheckItem } from "./checkitem"
class CheckList {
  #items = []

  addCheckItem(value) {
    const checkItem = value instanceof CheckItem ? value : new CheckItem(value)
    this.#items.push(checkItem)
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
}

export { CheckList }
