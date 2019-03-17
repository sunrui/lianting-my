export const loadingApi = {
  ref: 0,
  enable: true,
  show() {
    this.ref++

    setTimeout(function () {
      if (this.enable && this.ref > 0) {
        document.getElementById('http_loading').style.display = 'block'
      }
    }, 500)
  },
  hide() {
    if (--this.ref <= 0) {
      document.getElementById('http_loading').style.display = 'none'
    }
  }
}
