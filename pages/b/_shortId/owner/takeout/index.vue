<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme"
               :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>应广大创业店主要求，恋厅开放了简易的外卖入口。</li>
          <li>您可将您的店铺专属页打印或发送至朋友圈使用。</li>
          <li>要启用外卖功能，您需要添加一名外卖人事人员。</li>
          <li>外卖人员可在关注恋厅公众号后处理日常工作。</li>
          <li>顾客下单时外卖人员会在公众号收到新订单推送。</li>
          <li>外卖功能同样免费、无限订单、无中间商赚差价。</li>
          <li>但当您发送接单短信时，需您付成本费 0.1 元/条。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">启用外卖</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.tableOutConfig.enable"
                 @click="btnTableOutEnable(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnTableOutEnable(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">外卖费</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入外卖费"
                          v-model="http.req.tableOutConfig.takeOutFee"></currency-input>
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
  import CurrencyInput from '../../../../../components/common/CurrencyInput'
  import {httpTakeoutAdminApi} from '../../../../../api/http/lt/httpTakeOutAdminApi'

  export default {
    metaInfo: {
      title: '外卖'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '外卖',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            tableOutConfig: {
              enable: false,
              takeOutFee: null
            }
          }
        },
        ui: {}
      }
    },
    created() {
      httpTakeoutAdminApi.getConfig(this.$route.params.shortId).then(res => {
        this.http.req.tableOutConfig = res
      })
    },
    methods: {
      btnUpdate() {
        httpTakeoutAdminApi.putConfig(this.$route.params.shortId, this.http.req.tableOutConfig).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '外卖',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      },
      btnTableOutEnable(enable) {
        this.http.req.tableOutConfig.enable = enable
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_food';
</style>
