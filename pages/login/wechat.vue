<template>
</template>
<script>
  import { userApi } from '../../api/local/userApi'
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
          userApi.setUserId(res.user.id)
          userApi.setUserPhone(res.user.phone)
          userApi.setUserWechatOpenId(res.user.wechatOpenId)
          userApi.setUserAlipayOpenId(res.user.alipayOpenId)

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
