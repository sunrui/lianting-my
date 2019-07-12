<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">

        <div class="addition_item">
          <div class="addition_item_label">下单时打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.printerConfig.printWhenOrder" @click="btnPrintWhenOrder(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrintWhenOrder(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">支付后打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.printerConfig.printWhenPaid" @click="btnPrintWhenPaid(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrintWhenPaid(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item" @click="btnPrinterList()">
          <div class="addition_item_label">打印机列表</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpPrinterAdminApi} from '../../../../../api/http/lt/httpPrinterAdminApi'

  export default {
    metaInfo: {
      title: '打印'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '打印',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printerConfig: {
              printWhenOrder: false,
              printWhenPaid: false
            }
          }
        }
      }
    },
    mounted() {
      this.httpPrinterConfig()
    },
    methods: {
      btnPrintWhenOrder(enable) {
        this.http.req.printerConfig.printWhenOrder = enable

        httpPrinterAdminApi.putConfig(this.$route.params.shortId, this.http.req.printerConfig).then(res => {
        })
      },
      btnPrintWhenPaid(enable) {
        this.http.req.printerConfig.printWhenPaid = enable

        httpPrinterAdminApi.putConfig(this.$route.params.shortId, this.http.req.printerConfig).then(res => {
        })
      },
      httpPrinterConfig() {
        httpPrinterAdminApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.printerConfig = res
        })
      },
      btnPrinterList() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/printer/list`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
