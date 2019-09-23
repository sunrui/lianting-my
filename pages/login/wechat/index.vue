<template>
  <loading></loading>
</template>
<script>
  import {userApi} from '../../../api/local/userApi'
  import {httpUserApi} from '../../../api/http/user/httpUserApi'
  import Loading from '../../../components/common/Loading'

  export default {
    metaInfo: {
      title: '微信登录'
    },
    components: {Loading},
    mounted() {
      let code = this.$route.query.code
      let state = this.$route.query.state
      let shortId = this.$route.query.shortId

      if (!Boolean(code)) {
        this.$router.push('/login')
        return
      }

      if (!Boolean(shortId)) {
        shortId = 'undefined'
      }

      httpUserApi.postLoginWechat(shortId, code, state).then(res => {
        if (res.user) {
          userApi.setUserId(res.user.id)
          userApi.setUserPhone(res.user.phone)
          userApi.setUserWechatOpenId(res.user.wechatOpenId)
          userApi.setUserAlipayOpenId(res.user.alipayOpenId)

          if (!Boolean(res.user.shopWechatOpenId)) {
            httpUserApi.getWechat(shortId).then(res => {
              if (res.shopConfigWechatMpEnable && !Boolean(res.shopWechatOpenId)) {
                this.$router.push({
                      path: `/login/wechat/shop`,
                      query: {
                        r: this.$route.query.r,
                        shortId: shortId
                      }
                    }
                )
              } else {
                let r = this.$route.query.r
                if (!Boolean(r)) {
                  r = '/'
                }

                this.$router.push(r)
              }
            })

            return
          }

          userApi.setUserShopWechatOpenId(res.user.shopWechatOpenId)

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
