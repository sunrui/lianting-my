<template>
  <loading></loading>
</template>

<script>
  import {httpUserApi} from '../../api/http/user/httpUserApi'
  import {userApi} from '../../api/local/userApi'
  import Loading from '../../components/common/Loading'

  export default {
    metaInfo: {
      title: '支付宝登录'
    },
    components: {Loading},
    mounted() {
      let code = this.$route.query.auth_code
      let state = this.$route.query.state

      if (!Boolean(code)) {
        this.$router.push('/login')
        return
      }

      let shortId = this.$route.query.shortId
      if (!Boolean(shortId)) {
        shortId = 'undefined'
      }

      httpUserApi.postLoginAlipay(shortId, code, state).then(res => {
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
