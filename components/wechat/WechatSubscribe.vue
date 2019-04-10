<template>
  <div class="wechat_subscribe" v-if="ui.inWechat && !this.http.res.wechatInfo.subscribe">不想错过提醒？请关注<a class="wechat_subscribe_link" :href="ui.link">恋厅</a>公众号。</div>
</template>

<script>
  import {wechatApi} from "../../api/local/wechatApi"
  import {httpUserApi} from "../../api/http/user/httpUserApi"

  export default {
    data() {
      return {
        http: {
          res: {
            wechatInfo: {
              subscribe: true,
              openId: null
            }
          }
        },
        ui: {
          link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MTQzNzQxNA==#wechat_redirect',
          inWechat: wechatApi.inWechat()
        }
      }
    },
    created() {
      this.httpWechatInfo()
    },
    methods: {
      httpWechatInfo() {
        httpUserApi.getWechatInfo(this.$route.params.shortId).then(res => {
          this.http.res.wechatInfo = res
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "WechatSubscribe";
</style>