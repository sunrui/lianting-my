<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要开通支付宝在线支付功能，您需创建支付宝应用。请查阅<a class="tip_link" :href="getAlipayPayUrl()">支付宝开放平台</a>。</li>
          <li>您的交易没有任何订单抽成，所有交易将直接与支付宝通讯并实时打款至您的收款账户。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">alipayPublicKey</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 alipayPublicKey" maxlength="4096" v-model="http.req.config.alipayPublicKey">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">partnerId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 partnerId" maxlength="20" v-model="http.req.config.partnerId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">appId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 appId" maxlength="20" v-model="http.req.config.appId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">privateKey</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 privateKey" maxlength="4096" v-model="http.req.config.privateKey">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">publicKey</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 publicKey" maxlength="4096" v-model="http.req.config.publicKey">
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
      title: '支付'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '支付',
          backUri: `/b/${this.$route.params.shortId}/owner/pay`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              alipayPublicKey: null,
              partnerId: null,
              appId: false,
              privateKey: false,
              publicKey: false,
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
      getAlipayPayUrl() {
        return 'https://openhome.alipay.com/platform/appManage.htm#/apps'
      },
      httpConfig() {
        httpConfigAdminApi.getConfigAlipay(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (!Boolean(this.http.req.config.alipayPublicKey)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '请输入 alipayPublicKey。'
            })

            return
        }

        if (!Boolean(this.http.req.config.partnerId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '请输入 partnerId。'
          })

          return
        }

        if (!Boolean(this.http.req.config.appId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '请输入 appId。'
          })

          return
        }

        if (!Boolean(this.http.req.config.privateKey)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '请输入 privateKey。'
          })

          return
        }

        if (!Boolean(this.http.req.config.publicKey)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '请输入 publicKey。'
          })

          return
        }

        httpConfigAdminApi.putConfigAlipay(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '微信支付',
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
