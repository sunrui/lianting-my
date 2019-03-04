import { debugApi } from './debugApi'

export const logApi = {
  log(data) {
    if (debugApi.debug) {
      console.log(data)
    }
  },
  error(data) {
    if (debugApi.debug) {
      console.error(data)
    }
  },
  dump(data) {
    if (debugApi.debug) {
      const { dump } = require('dumper.js')
      dump(data)
    }
  }
}
