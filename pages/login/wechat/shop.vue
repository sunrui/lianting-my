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

          if (Boolean(!res.user.shopWechatOpenId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '店铺授权',
              content: '获取不到店铺公众号 openId，有可能是您的店铺配置不正确。请您在管理员-公众号一栏先将错误的 appId 配对值清空。'
            }).then(async (val) => {
              window.location.href = r
            })
          } else {
            window.location.href = r
          }
        }
      })
    }
  }
</script>
