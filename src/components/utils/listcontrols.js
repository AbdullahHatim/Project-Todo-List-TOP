/**
 *  Adds the following 4 functions to the class:
 * - clear()
 * - addItem(value)
 * - getItem(value)
 * - removeItem(value)
 * @param {class} className the class to add the components To
 * @param {class} itemClass The class witch addItem defaults To incase it receives a string
 *
 */

export function addListControlComponents(className, itemClass) {
  className.prototype.clear = function () {
    this.list = []
  }

  className.prototype.addItem = function (value) {
    const item = value instanceof itemClass ? value : new itemClass(value)
    this.list.push(item)
    return this
  }
  className.prototype.getItem = function (value) {
    let item = ""

    if (typeof value === "number") {
      item = this.list[value]
    } else if (typeof value === "string") {
      item = this.list.find((item) => item.title === value)
    }

    return item
  }
  className.prototype.removeItem = function (value) {
    let item = this.getItem(value)

    if (item) this.list.splice(this.list.indexOf(item), 1)

    return item
  }
}
