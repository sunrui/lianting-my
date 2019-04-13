if (process.env.NODE_ENV !== 'development') {
  let noop = function () {
  }

  console.clear()
  console.log = console.error = noop
}