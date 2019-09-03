<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="queue_table box_radius">
        <div class="queue_table_label_left">当前订单</div>
        <div class="queue_table_people">{{http.req.printerConfig.orderNumberSequence}}</div>
        <div class="queue_table_label_right">序号</div>
      </div>
    </div>

    <div class="box">
      <div class="queue box_radius">
        <div class="queue_table_group">
          <div class="queue_table_group_name">打印订单序号</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.printerConfig.printOrderNumber" @click="btnPrintOrderNumber(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrintOrderNumber(true)"></div>
          </div>
        </div>

        <div class="blank_30"></div>

        <div class="queue_button_box">
          <div class="button_small" v-if="http.req.printerConfig.orderNumberSequence > 0" @click="btnReset">序号清零</div>
          <div class="button_small button_gray" v-else>排队清零</div>
        </div>

        <div class="blank_30"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpQueueApi} from '../../../../../api/http/lt/httpQueueApi'
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpQueueAdminApi} from '../../../../../api/http/lt/httpQueueAdminApi'
  import {timeApi} from '../../../../../api/local/timeApi'
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
          backUri: `/b/${this.$route.params.shortId}/admin`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          req: {
            printerConfig: {
              orderNumberSequence: 0
            }
          }
        },
        ui: {}
      }
    },
    mounted() {
      this.httpPrinterConfig()
    },
    methods: {
      httpPrinterConfig() {
        httpPrinterAdminApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.printerConfig = res
        })
      },
      btnPrintOrderNumber(enable) {
        this.http.req.printerConfig.printOrderNumber = enable

        httpPrinterAdminApi.putConfig(this.$route.params.shortId, this.http.req.printerConfig).then(res => {
        })
      },
      btnReset() {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '序号清零',
          content: '打印订单序号将清零，您确认吗?'
        }).then(async (val) => {
          if (val === 'Yes') {
            this.http.req.printerConfig.orderNumberSequence = 0

            httpPrinterAdminApi.putConfig(this.$route.params.shortId, this.http.req.printerConfig).then(res => {
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_queue';
</style>
