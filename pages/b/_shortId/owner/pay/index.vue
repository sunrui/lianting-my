<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-if="http.req.config.prepayment && !http.req.config.openWechat && !http.req.config.openAlipay">
      <div class="tip">
        <ul class="tip_ul">
          <li>开通预支付前请确保已开通至少一种在线支付。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">餐具费</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入餐具费"
                          v-model="http.req.config.perTablewarePrice"></currency-input>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">饭前买单</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.prepayment" @click="btnPrepayment(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrepayment(true)"></div>
          </div>
        </div>

      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">微信支付</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.openWechat" @click="btnOpenWechat(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnOpenWechat(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item" @click="btnPayWechat">
          <div class="addition_item_label">参数配置</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

<!--    <div class="box">-->
<!--      <div class="addition box_radius">-->
<!--        <div class="addition_item">-->
<!--          <div class="addition_item_label">支付宝支付</div>-->
<!--          <div class="addition_item_check">-->
<!--            <div class="addition_item_check_on" v-if="http.req.config.openAlipay" @click="btnOpenAlipay(false)"></div>-->
<!--            <div class="addition_item_check_off" v-else @click="btnOpenAlipay(true)"></div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="box_divide"></div>-->

<!--        <div class="addition_item" @click="btnPayAlipay">-->
<!--          <div class="addition_item_label">参数配置</div>-->
<!--          <div class="addition_item_link"></div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import {httpOrderAdminApi} from '../../../../../api/http/lt/httpOrderAdminApi'
  import CurrencyInput from '../../../../../components/common/CurrencyInput'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpConfigAdminApi} from '../../../../../api/http/lt/httpConfigAdminApi'

  export default {
    metaInfo: {
      title: '支付'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '支付',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              perTablewarePrice: null,
              prepayment: false,
              openWechat: false,
              openAlipay: false
            }
          },
          res: {
            configWechat: {}
          }
        }
      }
    },
    mounted() {
      this.httpConfig()
      this.httpConfigWechat()
    },
    methods: {
      getWechatPayUrl() {
        return 'http://kf.qq.com/faq/180910jimEvQ180910Zj6jQV.html'
      },
      httpConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      httpConfigWechat() {
        httpConfigAdminApi.getConfigWechat(this.$route.params.shortId).then(res => {
          this.http.res.configWechat = res
        })
      },
      btnPrepayment(enable) {
        this.http.req.config.prepayment = enable
      },
      btnOpenWechat(enable) {
        if (enable && !Boolean(this.http.res.configWechat.subAppId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '尚未配置微信支付参数，无法启用。'
          })

          return
        }

        this.http.req.config.openWechat = enable
      },
      btnOpenAlipay(enable) {
        this.http.req.config.openAlipay = enable
      },
      btnUpdate() {
        if (Boolean(this.http.req.config.prepayment) &&
            !Boolean(this.http.req.config.openWechat) &&
            !Boolean(this.http.req.config.openAlipay)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '开通预支付前请确保已开通至少一种在线支付。'
          })

          return
        }

        httpOrderAdminApi.putConfig(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      },
      btnPayWechat() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/pay/wechat`)
      },
      btnPayAlipay() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/pay/alipay`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
