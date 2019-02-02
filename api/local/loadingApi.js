import { debugApi } from './debugApi'

export const loadingApi = {
  ref: 0,
  enable: true,
  show() {
    this.ref++

    if (this.enable) {
      document.getElementById('http_loading').style.display = 'block'
    }
  },
  hide() {
    if (debugApi.debug) {
      let sleep = function(delay) {
        let start = (new Date()).getTime()
        while ((new Date()).getTime() - start < delay) {
        }
      }
      sleep(100)
    }

    if (--this.ref <= 0) {
      document.getElementById('http_loading').style.display = 'none'
    }
  }
}
