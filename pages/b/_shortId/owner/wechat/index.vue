<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme"
               :imageHeight="title.imageHeight"></title-bar>
    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>恋厅可在您的公众号中单独使用，并仅作为底层技术通道支持，同时顾客排队、加菜、支付等消息会在私有公众号中推送。</li>
          <li>您可自由选择将点餐、排队、预订、订单记录、个人中心、我的优惠券等常用入口放至在私有公众号菜单中。</li>
          <li>恋厅公众号并非顾客所需，恋厅仅作为您餐厅的管理后台和工作台入口。</li>如您尚未拥有私有公众号，您也可推荐顾客关注恋厅来接收消息通知。</li>
          <li>接入文档请<a class="tip_link" href="https://www.honeysense.com/doc/mp_wechat.docx">下载</a>。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">appId</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 appId" maxlength="20" v-model="http.req.mp.appId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">appSecret</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 appSecret" maxlength="256" v-model="http.req.mp.appSecret">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpConfigAdminApi} from '../../../../../api/http/lt/httpConfigAdminApi'
  import {httpUserApi} from '../../../../../api/http/user/httpUserApi'

  export default {
    metaInfo: {
      title: '公众号'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '公众号',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            mp: {}
          }
        },
        ui: {
        }
      }
    },
    mounted() {
      this.httpConfigWechatMp()
    },
    methods: {
      httpConfigWechatMp() {
        httpConfigAdminApi.getMpConfigWechat(this.$route.params.shortId).then(res => {
          this.http.req.mp = res
        })
      },
      btnUpdate() {
        if (!Boolean(this.http.req.mp.appId) || !Boolean(this.http.req.mp.appSecret)) {
          httpConfigAdminApi.putMpConfigWechat(this.$route.params.shortId, this.http.req.mp).then(res => {
            this.$msgBox.doModal({
              type: 'yes',
              title: '公众号',
              content: '已更新。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
            })
          })
          return
        }

        httpUserApi.postLoginWechatShopTest(this.http.req.mp.appId, this.http.req.mp.appSecret).then(res => {
          if (res.success) {
            httpConfigAdminApi.putMpConfigWechat(this.$route.params.shortId, this.http.req.mp).then(res => {
              this.$msgBox.doModal({
                type: 'yes',
                title: '公众号',
                content: '已更新。'
              }).then(async (val) => {
                this.$router.push(this.title.backUri)
              })
            })
          } else if (res.reason) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '更新失败',
              content: res.reason
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_food';
  @import "index";
</style>
