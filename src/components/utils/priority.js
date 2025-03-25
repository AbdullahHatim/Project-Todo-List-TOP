export const Priority = (function () {
  const HIGH = 1
  const NORMAL = 0
  const LOW = -1

  function getType(value) {
    let str = Object.keys(this).find((key) => this[key] === value)
    str = str.toLowerCase()
    str = str.charAt(0).toUpperCase() + str.slice(1)
    return str
  }

  return Object.freeze({ HIGH, NORMAL, LOW, getType })
})()
