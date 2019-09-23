<template>
  <loading></loading>
</template>
<script>
  import Loading from '../../../components/common/Loading'
  import {httpUserApi} from '../../../api/http/user/httpUserApi'
  import {loginApi} from '../../../api/local/loginApi'
  import {userApi} from '../../../api/local/userApi'

  export default {
    metaInfo: {
      title: '店铺授权'
    },
    components: {Loading},
    mounted() {
      let code = this.$route.query.code
      let state = this.$route.query.state
      let shortId = this.$route.query.shortId
      let r = this.$route.query.r

      if (!Boolean(r)) {
        r = '/'
      }

      if (!Boolean(code)) {
        httpUserApi.getWechat(this.$route.query.shortId).then(res => {
          loginApi.loginWechat(res.shopAppId, this.$route.query.shortId, 'snsapi_base', r, true)
        })
        return
      }

      if (!Boolean(shortId)) {
        shortId = 'undefined'
      }

      httpUserApi.postLoginWechatShop(shortId, code, state).then(res => {
        if (res.user) {
          userApi.setUserId(res.user.id)
          userApi.setUserPhone(res.user.phone)
          userApi.setUserWechatOpenId(res.user.wechatOpenId)
          userApi.setUserShopWechatOpenId(res.user.shopWechatOpenId)
          userApi.setUserAlipayOpenId(res.user.alipayOpenId)

          window.location.href = r
        }
      })
    }
  }
</script>
