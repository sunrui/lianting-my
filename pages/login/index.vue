<template>
</template>

<script>
  import { cartApi } from '../../api/local/cartApi'

  export default {
    metaInfo: {
      title: '用户登录'
    },
    data() {
      return {
        appId: 'wxdd2ac18f974e8e70'
      }
    },
    mounted() {
      let r = this.$route.query.r
      if (!Boolean(r)) {
        r = '/'
      }

      cartApi.clear()

      let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase();

      let shortId = this.$route.query.shortId
      let scope = this.$route.query.scope
      let inWechat = userAgent.match(/MicroMessenger/i)
      let inWechatDebugger = userAgent.match(/webdebugger/i)

      if (!inWechatDebugger && (inWechat || scope)) {
        r = document.location.protocol + '//' + window.location.host + `/login/wechat?r=${r}&shortId=${shortId}`
        if (!Boolean(scope)) {
          scope = 'snsapi_base'
        }

        let state = 'csrf_uncheck'

        r = encodeURIComponent(r)
        r = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${r}&response_type=code&scope=${scope}&state=${state}&connect_redirect=1#wechat_redirect`
        window.location.href = r
      } else {
        this.$router.push(`/login/phone?r=${r}&shortId=${shortId}`)
      }
    },
    methods: {}
  }
</script>