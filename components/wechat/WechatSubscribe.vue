<template>
  <div class="wechat_subscribe" v-if="!http.res.wechat.subscribe && !http.res.wechat.shopSubscribe">担心错过提醒？您可关注<a class="wechat_subscribe_link" @click="btnLink()">恋厅或商家</a>公众号。
  </div>
</template>

<script>
  import {wechatApi} from '../../api/local/wechatApi'
  import {httpUserApi} from '../../api/http/user/httpUserApi'

  export default {
    data() {
      return {
        http: {
          res: {
            wechat: {
              subscribe: true,
              shopSubscribe: true,
              openId: null
            }
          }
        },
        ui: {
          link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MTQzNzQxNA==#wechat_redirect',
          inWechat: false
        }
      }
    },
    mounted() {
      this.ui.inWechat = wechatApi.inWechat()

      this.httpWechatInfo()
    },
    methods: {
      httpWechatInfo() {
        httpUserApi.getWechat(this.$route.params.shortId).then(res => {
          this.http.res.wechat = res

          if (this.ui.inWechat) {
            if (res.shopConfigWechatMpEnable && !Boolean(res.shopWechatOpenId)) {
              this.$router.push({
                    path: `/login/wechat/shop`,
                    query: {
                      r: window.location.href,
                      shortId: this.$route.params.shortId
                    }
                  }
              )
            }
          }
        })
      },
      btnLink() {
        if (this.ui.inWechat) {
          window.location.href = this.ui.link
        } else {
          window.location.href = 'https://m.lianting.store'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "WechatSubscribe";
</style>
