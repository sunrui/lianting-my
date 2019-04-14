if (process.env.NODE_ENV !== 'development') {
  let noop = function () {
  }

  console.log = console.error = noop
}