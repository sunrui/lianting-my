import { debugApi } from './debugApi'

export const loadingApi = {
  ref: 0,
  enable: true,
  sleep(delay) {
    let start = (new Date()).getTime()
    while ((new Date()).getTime() - start < delay) {
    }
  },
  show() {
    this.ref++

    if (this.enable) {
      document.getElementById('http_loading').style.display = 'block'
    }
  },
  hide() {
    if (debugApi.debug) {
      this.sleep(500)
    }

    if (--this.ref <= 0) {
      document.getElementById('http_loading').style.display = 'none'
    }
  }
}
