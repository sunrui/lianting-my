<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要开通微信在线支付功能，您需拥有认证微信公众号。请查阅<a class="tip_link" :href="getWechatPayUrl()">微信支付商户接入指引</a>。</li>
          <li>开通特约商户支付需提交姓名、身份证、手机、邮箱、营业执照、收款银行卡等资料至微信备案。</li>
          <li>为了保护您的隐私安全，暂不支持在线提交，请联系恋厅客服人工提交。微信审核通过后，就可以使用微信在线支付了。</li>
          <li>您的交易没有任何订单抽成，所有交易将直接与微信通讯并实时打款至您的收款账户。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">公众号 appId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入公众号 appId" maxlength="20" v-model="http.req.config.subAppId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">商户号 mch_id</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入商户号 mch_id" maxlength="20" v-model="http.req.config.subMchId">
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
              subAppId: null,
              subMchId: null,
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
      getWechatPayUrl() {
        return 'http://kf.qq.com/faq/180910jimEvQ180910Zj6jQV.html'
      },
      httpConfig() {
        httpConfigAdminApi.getConfigWechat(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (!Boolean(this.http.req.config.subAppId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '请输入公众号 appId。'
            })

            return
        }

        if (!Boolean(this.http.req.config.subMchId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '请输入商户号 mch_id。'
            })

            return
        }

        httpConfigAdminApi.putConfigWechat(this.$route.params.shortId, this.http.req.config).then(res => {
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
