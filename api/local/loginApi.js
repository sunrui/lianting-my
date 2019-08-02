export const loginApi = {
  wechatAppId: 'wxdd2ac18f974e8e70',
  alipayAppId: '2018010501607494',
  loginWechat(shortId, scope, r) {
    r = document.location.protocol + '//' + window.location.host + `/login/wechat?r=${r}&shortId=${shortId}`
    if (!Boolean(scope)) {
      scope = 'snsapi_base'
    }

    let state = 'csrf_uncheck'

    r = encodeURIComponent(r)
    r = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.wechatAppId}&redirect_uri=${r}&response_type=code&scope=${scope}&state=${state}&connect_redirect=1#wechat_redirect`
    window.location.href = r
  },
  loginAlipay(shortId, scope, r) {
    r = document.location.protocol + '//' + window.location.host + `/login/alipay?r=${r}&shortId=${shortId}`
    if (!Boolean(scope)) {
      scope = 'auth_base'
    }

    let state = 'csrf_uncheck'

    r = encodeURIComponent(r)
    r = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${this.alipayAppId}&scope=${scope}&redirect_uri=${r}&state=${state}`
    window.location.href = r
  }
}