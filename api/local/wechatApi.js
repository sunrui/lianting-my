export const wechatApi = {
  inWechat() {
    let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
    return userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
  },
  _tryCloseWindow(tryTimes) {
    if (tryTimes === 0) {
      return
    }

    if (typeof window.WeixinJSBridge !== 'undefined') {
      WeixinJSBridge.call('closeWindow')
    } else {
      setTimeout(this._tryCloseWindow(--tryTimes), 10)
    }
  },
  closeWindow() {
    this._tryCloseWindow(100)
  }
}