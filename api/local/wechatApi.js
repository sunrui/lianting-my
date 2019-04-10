export const wechatApi = {
  inWechat() {
    let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
    return userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
  }
}