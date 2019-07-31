<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-if="http.req.config.openWechat">
      <div class="tip">
        <ul class="tip_ul">
          <li>要开通微信在线支付功能，您需拥有认证微信公众号。请查阅<a class="tip_link" :href="getWechatPayUrl()">微信支付商户接入指引</a>。</li>
          <li>开通微信支付需提交营业执照、收款银行卡等资料至微信审核，请联系恋厅客服。</li>
        </ul>
      </div>
    </div>

    <div class="box" v-if="http.req.config.openAlipay">
      <div class="tip">
        <ul class="tip_ul">
          <li>开通支付宝支付需提交营业执照、收款支付宝账号等资料至支付宝审核，请联系恋厅客服。</li>
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

        <div class="addition_item">
          <div class="addition_item_label">支付宝支付</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.openAlipay" @click="btnOpenAlipay(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnOpenAlipay(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="box">-->
    <!--      <div class="addition box_radius">-->
    <!--        <div class="addition_item">-->
    <!--          <div class="addition_item_label">微信appId</div>-->
    <!--          <label>-->
    <!--            <input type="text" class="addition_item_input"-->
    <!--                   placeholder="请输入支付商户号" maxlength="20" v-model="http.req.config.wechatPayAppId">-->
    <!--          </label>-->
    <!--        </div>-->

    <!--        <div class="box_divide"></div>-->

    <!--        <div class="addition_item">-->
    <!--          <div class="addition_item_label">子商户号</div>-->
    <!--          <label>-->
    <!--            <input type="text" class="addition_item_input"-->
    <!--                   placeholder="请输入支付商户号" maxlength="20" v-model="http.req.config.wechatPaySubMchId">-->
    <!--          </label>-->
    <!--        </div>-->

    <!--        <div class="box_divide"></div>-->

    <!--        <div class="addition_item">-->
    <!--          <div class="addition_item_label">支付密钥</div>-->
    <!--          <label>-->
    <!--            <input type="text" class="addition_item_input"-->
    <!--                   placeholder="请输入支付密钥" maxlength="32" v-model="http.req.config.wechatPaySecretKey">-->
    <!--          </label>-->
    <!--        </div>-->

    <!--        <div class="box_divide"></div>-->

    <!--        <div class="addition_item">-->
    <!--          <div class="addition_item_label">支持信用卡</div>-->
    <!--          <div class="addition_item_check">-->
    <!--            <div class="addition_item_check_on" v-if="http.req.config.supportCredit" @click="btnSupportCredit(false)"></div>-->
    <!--            <div class="addition_item_check_off" v-else @click="btnSupportCredit(true)"></div>-->
    <!--          </div>-->
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
          }
        }
      }
    },
    mounted() {
      this.httpConfig()
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
      btnPrepayment(enable) {
        this.http.req.config.prepayment = enable
      },
      btnOpenWechat(enable) {
        this.http.req.config.openWechat = enable
      },
      btnOpenAlipay(enable) {
        this.http.req.config.openAlipay = enable
      },
      btnUpdate() {
        if (Boolean(this.http.req.config.prepayment)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '开通预支付前请先开通至少一种在线支付。'
          })

          return
        }

        // if (Boolean(this.http.req.config.wechatPayAppId)) {
        //   if (!Boolean(this.http.req.config.wechatPaySubMchId) || !Boolean(this.http.req.config.wechatPaySecretKey)) {
        //     this.$msgBox.doModal({
        //       type: 'yes',
        //       title: '支付',
        //       content: '微信支付字段需配对设置。'
        //     })
        //
        //     return
        //   }
        // }
        //
        // if (Boolean(this.http.req.config.wechatPaySubMchId)) {
        //   if (!Boolean(this.http.req.config.wechatPayAppId) || !Boolean(this.http.req.config.wechatPaySecretKey)) {
        //     this.$msgBox.doModal({
        //       type: 'yes',
        //       title: '支付',
        //       content: '微信支付字段需配对设置。'
        //     })
        //
        //     return
        //
        //   }
        // }
        //
        // if (Boolean(this.http.req.config.wechatPaySecretKey)) {
        //   if (!Boolean(this.http.req.config.wechatPaySubMchId) || !Boolean(this.http.req.config.wechatPayAppId)) {
        //     this.$msgBox.doModal({
        //       type: 'yes',
        //       title: '支付',
        //       content: '微信支付字段需配对设置。'
        //     })
        //
        //     return
        //   }
        // }

        httpOrderAdminApi.putConfig(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
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
