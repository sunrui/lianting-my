export const alipayApi = {
  inAlipay() {
    let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
    return userAgent.match(/alipayclient/i)
  }
}
