<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要启用在线支付功能，现在您无需必要拥有企业微信公共号。</li>
          <li>根据微信要求，您需要提交相关开通支付资料至微信审核，可由我们人工客服免费代为您提交。</li>
          <li>您可加入我们 QQ 群联系在线客服资询需要提交审核的相关资料。</li>
          <li>即使您是免费会员，无需任何担心，我们同样竭诚为您服务。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">餐具费</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入餐具费" maxlength="20"
                          v-model="http.req.config.perTablewarePrice"></currency-input>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">支付商户号</div>
          <input class="addition_item_input"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                 placeholder="请输入支付商户号" maxlength="20" v-model="http.req.config.subMchId">
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
      <div class="button_big" @click="btnModify">修改</div>
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
              subMchId: null,
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
      loadConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnModify() {
        httpOrderAdminApi.putConfig(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$router.push(this.title.backUri)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
