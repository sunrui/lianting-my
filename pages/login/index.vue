<template>
  <section>
    <p>loading image...</p>
    <p>{{userAgent}}</p>
  </section>
</template>

<script>
  import {cartApi} from '../../api/local/cartApi'

  export default {
    metaInfo: {
      title: '用户登录'
    },
    middleware: 'user-agent',
    async asyncData({store, route, userAgent}) {
      return {
        userAgent
      }
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

      let shortId = this.$route.query.shortId
      let scope = this.$route.query.scope
      let inWechat = this.userAgent.match(/MicroMessenger/i)
      let inWechatDebugger = this.userAgent.match(/webdebugger/i)

      inWechatDebugger = false

      if (!inWechatDebugger && (inWechat || scope)) {
        r = document.location.protocol + '//' + window.location.host + `/login/wechat?r=${r}&shortId=${shortId}`
        if (!Boolean(scope)) {
          scope = 'snsapi_base'
        }

        let state = 'cors_uncheck'

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


