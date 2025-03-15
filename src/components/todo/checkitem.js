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

  toString() {
    return `
    {
     "title": "${this.#title}",
     "checked": ${this.#checked}
    }
    `.trim()
  }

  parse(value) {
    const obj = typeof value === "object" ? value : JSON.parse(value)
    this.#title = obj.title
    this.#checked = obj.checked
    return this
  }
}

export { CheckItem }
