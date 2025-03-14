class CheckItem {
  #title = ""
  #checked = false

  constructor(title) {
    this.title = title || ""
  }

  set title(value) {
    this.#title = String(value)
  }

  get title() {
    return this.#title
  }

  toggleCheck() {
    this.#checked = !this.#checked
  }

  get checked() {
    return this.#checked
  }
}

export { CheckItem }
