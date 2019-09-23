<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要开通支付宝在线支付功能，您需创建支付宝应用。请查阅<a class="tip_link" href="https://openhome.alipay.com/platform/appManage.htm#/apps">支付宝开放平台</a>。</li>
          <li>待您创建好应用后，请联系客服为您发起第三方应用授权。请查阅<a class="tip_link" href="https://docs.open.alipay.com/200/105314">支付宝签约功能</a>。</li>
          <li>您的交易没有任何订单抽成，所有交易将直接与支付宝通讯并实时打款至您的收款账户。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition">
        <div class="addition_item">
          <div class="addition_item_label">partnerId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 partnerId" maxlength="64" v-model="http.req.config.partnerId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">appAuthToken</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 appAuthToken" maxlength="64" v-model="http.req.config.appAuthToken">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">支持信用卡</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.supportCredit" @click="btnSupportCredit(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnSupportCredit(true)"></div>
          </div>
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

  export default {
    metaInfo: {
      title: '支付宝支付'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '支付宝支付',
          backUri: `/b/${this.$route.params.shortId}/owner/pay`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              partnerId: null,
              appAuthToken: null,
              supportCredit: false
            }
          }
        }
      }
    },
    mounted() {
      this.httpConfig()
    },
    methods: {
      httpConfig() {
        httpConfigAdminApi.getPayConfigAlipay(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (!Boolean(this.http.req.config.partnerId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '请输入 partnerId。'
          })

          return
        }

        if (!Boolean(this.http.req.config.appAuthToken)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '请输入 appAuthToken。'
          })

          return
        }

        httpConfigAdminApi.putPayConfigAlipay(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
