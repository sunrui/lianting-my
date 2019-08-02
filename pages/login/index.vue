<template>
  <loading></loading>
</template>

<script>
  import {wechatApi} from '../../api/local/wechatApi'
  import {alipayApi} from '../../api/local/alipayApi'
  import Loading from '../../components/common/Loading'
  import {loginApi} from '../../api/local/loginApi'

  export default {
    metaInfo: {
      title: '用户登录'
    },
    components: {Loading},
    mounted() {
      let r = this.$route.query.r
      if (!Boolean(r)) {
        r = '/'
      }

      let shortId = this.$route.query.shortId || 'undefined'
      let scope = this.$route.query.scope

      if (wechatApi.inWechat()) {
        loginApi.loginWechat(shortId, scope, r)
      } else if (alipayApi.inAlipay()) {
        loginApi.loginAlipay(shortId, scope, r)
      } else {
        this.$router.push({
          path: '/login/phone',
          query: {
            r: r,
            shortId: shortId
          }
        })
      }
    }
  }
</script>
