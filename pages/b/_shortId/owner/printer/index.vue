<template>
  <div>
    <title-bar ref="titleBar_Printer" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="empty" v-if="http.res.printerFeie.elements.length === 0">
      <img class="empty_image" src="/img/no/no_order.png" alt="没有打印机">
      <div class="empty_label">没有打印机</div>

      <div class="button_box">
        <div class="button_big" @click="btnCreate">添加打印机</div>
      </div>
    </div>

    <div class="box" v-for="printer in http.res.printerFeie.elements">
      <div class="printer_header box_radius_header">
        <div class="badge_delete" @click="btnDelete(printer)"></div>
        <div class="printer_box">
          <div class="printer_box_left">
            <div class="printer_type_title">飞鹅打印机</div>
            <div class="printer_type_name">{{printer.remark ? printer.remark : printer.sn}}</div>
          </div>
          <div class="printer_box_right">
            <div class="printer_online_status">{{getPrinterFeieOneStatus(printer)}}</div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="printer_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">开启</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enable" @click="btnEnable(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnable(printer)"></div>
          </div>
        </div>
      </div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vPrinter">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">选择品牌</div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.choosePrinter === 'feie'}"
             @click="btnChoosePrinter('feie')">飞鹅云打印机
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnChooseConfirm">确认</div>
        </div>
      </div>
    </transition>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加打印机</div>
    </div>
  </div>
</template>

<script>
  import {httpPrinterAdminApi} from '../../../../../api/http/lt/httpPrinterAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import Empty from '../../../../../components/common/Empty'
  import {scrollApi} from '../../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '打印'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '打印',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 300
        },
        http: {
          res: {
            printerFeie: {
              elements: []
            }
          }
        },
        ui: {
          vCoverMask: false,
          vPrinter: false,
          choosePrinter: 'feie',
          feiePrinterStatus: [],
          interval: null
        }
      }
    },
    mounted() {
      this.httpPrinterFeie()
      this.ui.interval = setInterval(this.httpPrinterFeie, 10 * 1000)
    },
    beforeDestroy() {
      if (this.ui.interval) {
        clearInterval(this.ui.interval)
        this.ui.interval = null
      }
    },
    methods: {
      btnChoosePrinter(printer) {
        this.ui.choosePrinter = printer
      },
      btnCoverMask() {
        this.ui.vCoverMask = false
        this.ui.vPrinter = false

        scrollApi.enable(true)
      },
      btnChooseConfirm() {
        if (!Boolean(this.ui.choosePrinter)) {
          return
        }

        this.$router.push(`/b/${this.$route.params.shortId}/owner/printer/create/${this.ui.choosePrinter}`)
      },
      httpPrinterFeie() {
        this.ui.feiePrinterStatus = []

        httpPrinterAdminApi.getPrinterFeie(this.$route.params.shortId, 0, 99).then(res => {
          if (res.elements.length !== 0) {
            this.$refs.titleBar_Printer.setTheme('image')
          } else {
            this.$refs.titleBar_Printer.setTheme('white')
          }

          this.http.res.printerFeie = res

          for (let index in res.elements) {
            let printer = res.elements[index]
            this.getPrinterFeieOneStatus(printer)
          }
        })
      },
      getPrinterFeieOneStatus(printer) {
        for (let index in this.ui.feiePrinterStatus) {
          let statusOne = this.ui.feiePrinterStatus[index]
          if (statusOne.id === printer.id) {
            return statusOne.status
          }
        }

        httpPrinterAdminApi.getPrinterFeieOneStatus(this.$route.params.shortId, printer.id).then(res => {
          let status

          if (res.notExists) {
            status = '不存在'
          } else if (res.offline) {
            status = '离线'
          } else if (res.onlineNoPaper) {
            status = '缺纸异常'
          } else if (res.online) {
            status = '在线'
          }

          for (let index in this.ui.feiePrinterStatus) {
            let statusOne = this.ui.feiePrinterStatus[index]
            if (statusOne.id === printer.id) {
              return
            }
          }

          this.ui.feiePrinterStatus.push({
            id: printer.id,
            status: status
          })
        })
      },
      btnCreate() {
        this.ui.vCoverMask = true
        this.ui.vPrinter = true

        scrollApi.enable(false)
      },
      btnDelete(printer) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除打印机',
          content: '确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpPrinterAdminApi.deletePrinterFeie(this.$route.params.shortId, printer.id).then(res => {
              if (res.printerFeieIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除打印机',
                  content: '打印机不存在。'
                })
              } else if (res.success) {
                this.httpPrinterFeie()
              }
            })
          }
        })
      },
      btnEnable(printer) {
        httpPrinterAdminApi.putPrinterFeieEnable(this.$route.params.shortId, printer.id, !printer.enable).then(res => {
          if (res.printerFeieIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '启用打印机',
              content: '打印机不存在。'
            })
          } else if (res.success) {
            this.httpPrinterFeie()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
