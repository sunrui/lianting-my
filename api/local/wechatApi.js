export const wechatApi = {
  inWechat() {
    let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
    return userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
  },
  closeWindow() {
    if (WeixinJSBridge !== 'undefined') {
      WeixinJSBridge.call('closeWindow')
    }

    setTimeout(function () {
      if (WeixinJSBridge !== 'undefined') {
        WeixinJSBridge.call('closeWindow')
      }
    }, 100)
  }
}