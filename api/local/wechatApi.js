export const wechatApi = {
  inWechat() {
    let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
    return userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
  },
  closeWindow() {
    window.history.replaceState('forward', null, null)
    window.history.forward()

    WeixinJSBridge.call('closeWindow')

    setTimeout(function () {
      WeixinJSBridge.call('closeWindow')
    }, 200)
  }
}