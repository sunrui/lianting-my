<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要开通微信在线支付功能，首先要申请微信支付商务号。请查阅<a class="tip_link" :href="getWechatPayUrl()">微信支付商户接入指引</a>。</li>
          <li>您需要准备：姓名、手机号、邮箱、身份证、营业执照、食品安全许可证、餐食类型、银行卡。</li>
          <li>恋厅作为微信官方签约的合作服务商，您无需公众号也无需年费即可使用在线支付功能。</li>
          <li>审核资料可由恋厅客服代为您提交，微信会在1-5个工作日以邮件和短信的方式通知您确认签约。</li>
          <li>签约完成后将微信支付商务号填入下方即可以开通微信在线支付了，顾客支付将实时打入到您的收款账户。</li>
          <li>恋厅作为国内为数不多的的匠心餐饮方案供应商，恋厅没有任何订单抽成，共勉餐饮行业。</li>
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
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">微信appId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入支付商户号" maxlength="20" v-model="http.req.config.appId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">子商户号</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入支付商户号" maxlength="20" v-model="http.req.config.subMchId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">支付密钥</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入支付密钥" maxlength="32" v-model="http.req.config.secretKey">
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
              appId: null,
              perTablewarePrice: null,
              subMchId: null,
              secretKey: null,
              supportCredit: true
            }
          }
        }
      }
    },
    created() {
      this.loadConfig()
    },
    methods: {
      getWechatPayUrl() {
        return 'http://kf.qq.com/faq/180910jimEvQ180910Zj6jQV.html'
      },
      loadConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (Boolean(this.http.req.config.appId)) {
          if (!Boolean(this.http.req.config.subMchId) || !Boolean(this.http.req.config.secretKey)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '微信支付字段需配对设置。'
            })

            return
          }
        }

        if (Boolean(this.http.req.config.subMchId)) {
          if (!Boolean(this.http.req.config.appId) || !Boolean(this.http.req.config.secretKey)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '微信支付字段需配对设置。'
            })

            return

          }
        }

        if (Boolean(this.http.req.config.secretKey)) {
          if (!Boolean(this.http.req.config.subMchId) || !Boolean(this.http.req.config.appId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '支付',
              content: '微信支付字段需配对设置。'
            })

            return
          }
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
