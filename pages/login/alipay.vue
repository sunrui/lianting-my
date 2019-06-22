<template>
  <div></div>
</template>

<script>
  export default {
    metaInfo: {
      title: '支付宝登录'
    },
    mounted() {
      let app_id = this.$route.query.app_id
      let source = this.$route.query.source
      let app_auth_code = this.$route.query.app_auth_code

      if (!Boolean(app_auth_code)) {
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

<style scoped>

</style>
