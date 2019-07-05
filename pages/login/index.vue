<template>
  <loading></loading>
</template>

<script>
  import {wechatApi} from '../../api/local/wechatApi'
  import {alipayApi} from '../../api/local/alipayApi'
  import Loading from '../../components/common/Loading'

  export default {
    metaInfo: {
      title: '用户登录'
    },
    components: {Loading},
    data() {
      return {
        wechatAppId: 'wxdd2ac18f974e8e70',
        alipayAppId: '2018010501607494'
      }
    },
    mounted() {
      let r = this.$route.query.r
      if (!Boolean(r)) {
        r = '/'
      }

      let shortId = this.$route.query.shortId || 'undefined'
      let scope = this.$route.query.scope

      if (wechatApi.inWechat()) {
        r = document.location.protocol + '//' + window.location.host + `/login/wechat?r=${r}&shortId=${shortId}`
        if (!Boolean(scope)) {
          scope = 'snsapi_base'
        }

        let state = 'csrf_uncheck'

        r = encodeURIComponent(r)
        r = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.wechatAppId}&redirect_uri=${r}&response_type=code&scope=${scope}&state=${state}&connect_redirect=1#wechat_redirect`
        window.location.href = r
      } else if (alipayApi.inAlipay()) {
        r = document.location.protocol + '//' + window.location.host + `/login/alipay?r=${r}&shortId=${shortId}`
        if (!Boolean(scope)) {
          scope = 'auth_base'
        }

        let state = 'csrf_uncheck'

        r = encodeURIComponent(r)
        r = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${this.alipayAppId}&scope=${scope}&redirect_uri=${r}&state=${state}`
        window.location.href = r
      } else {
        this.$router.push({
          path: '/login/phone',
          query: {
            r: r,
            shortId: shortId
          }
        })
      }
    },
    methods: {}
  }
</script>
