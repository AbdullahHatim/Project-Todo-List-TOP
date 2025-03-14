const Priority = (function () {
  const HIGH = 1
  const NORMAL = 0
  const LOW = -1

  function getType(value) {
    return Object.keys(this).find((key) => this[key] === value)
  }

  return Object.freeze({ HIGH, NORMAL, LOW, getType })
})()

export { Priority }
