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
    if (--this.ref <= 0) {
      document.getElementById('http_loading').style.display = 'none'
    }
  }
}
