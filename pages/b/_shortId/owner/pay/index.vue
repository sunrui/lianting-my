<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

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
  import {httpOrderApi} from '../../../../../api/http/ltorder/httpOrderApi'
  import {httpOrderAdminApi} from '../../../../../api/http/ltorder/httpOrderAdminApi'
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
          this.$router.back()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common.scss';
</style>
