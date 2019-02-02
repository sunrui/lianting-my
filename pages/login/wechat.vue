<template>
</template>
<script>

  import { stateApi } from '../../api/local/stateApi'
  import { httpUserApi } from '../../api/http/user/httpUserApi'

  export default {
    metaInfo: {
      title: '微信登录'
    },
    mounted() {
      let code = this.$route.query.code
      let state = this.$route.query.state

      if (!Boolean(code)) {
        this.$router.push('/login')
        return
      }

      let shortId = this.$route.query.shortId
      if (!Boolean(shortId)) {
        shortId = 'undefined'
      }

      httpUserApi.postLoginWechat(shortId, code, state).then(res => {
        if (res.user) {
          stateApi.user.setId(res.user.id)
          stateApi.user.setPhone(res.user.phone)
          stateApi.user.setWechatOpenId(res.user.wechatOpenId)
          stateApi.user.setAlipayOpenId(res.user.alipayOpenId)

          let r = this.$route.query.r
          if (!Boolean(r)) {
            r = '/'
          }

          this.$router.push(r)
        }
      })
    }
  }
</script>
