<template>
  <div>
    <title-bar ref="titleBar_Printer" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="empty" v-if="http.res.printerFeie.elements.length === 0 && http.res.printerPoscom.elements.length === 0">
      <img class="empty_image" src="/img/no/no_order.png" alt="没有打印机">
      <div class="empty_label">没有打印机</div>

      <div class="button_box">
        <div class="button_big" @click="btnCreate">添加打印机</div>
      </div>
    </div>

    <div class="box" v-for="printer in http.res.printerPoscom.elements">
      <div class="printer_header box_radius_header">
        <div class="badge_delete" @click="btnDeletePoscom(printer)"></div>
        <div class="printer_box">
          <div class="printer_box_left">
            <div class="printer_type_title">佳博云打印机</div>
            <div class="printer_type_name">{{printer.remark ? '名称：' + printer.remark : '序列号：' + printer.deviceNo}}</div>
          </div>
          <div class="printer_box_right">
            <div class="printer_online_status" v-bind:class="{
            printer_online_status_online: getPrinterPoscomOneStatus(printer) === '在线',
            printer_online_status_offline: getPrinterPoscomOneStatus(printer) !== '在线'
            }">{{getPrinterPoscomOneStatus(printer)}}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="printer_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">后厨订单打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableOrder" @click="btnEnablePoscomOrder(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnablePoscomOrder(printer)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">顾客收据打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableReceipt" @click="btnEnablePoscomReceipt(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnablePoscomReceipt(printer)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box" v-for="printer in http.res.printerFeie.elements">
      <div class="printer_header box_radius_header">
        <div class="badge_delete" @click="btnDeleteFeie(printer)"></div>
        <div class="printer_box">
          <div class="printer_box_left">
            <div class="printer_type_title">飞鹅云打印机</div>
            <div class="printer_type_name">{{printer.remark ? '名称：' + printer.remark : '序列号：' + printer.sn}}</div>
          </div>
          <div class="printer_box_right">
            <div class="printer_online_status" v-bind:class="{
            printer_online_status_online: getPrinterFeieOneStatus(printer) === '在线',
            printer_online_status_offline: getPrinterFeieOneStatus(printer) !== '在线'
            }">{{getPrinterFeieOneStatus(printer)}}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="printer_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">后厨订单打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableOrder" @click="btnEnableFeieOrder(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableFeieOrder(printer)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">顾客收据打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableReceipt" @click="btnEnableFeieReceipt(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableFeieReceipt(printer)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box" v-for="printer in http.res.printerYly.elements">
      <div class="printer_header box_radius_header">
        <div class="badge_delete" @click="btnDeleteYly(printer)"></div>
        <div class="printer_box">
          <div class="printer_box_left">
            <div class="printer_type_title">易联云打印机</div>
            <div class="printer_type_name">{{printer.remark ? '名称：' + printer.remark : '序列号：' + printer.machineCode}}</div>
          </div>
          <div class="printer_box_right">
            <div class="printer_online_status" v-bind:class="{
            printer_online_status_online: getPrinterYlyOneStatus(printer) === '在线',
            printer_online_status_offline: getPrinterYlyOneStatus(printer) !== '在线'
            }">{{getPrinterYlyOneStatus(printer)}}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="printer_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">后厨订单打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableOrder" @click="btnEnableYlyOrder(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableYlyOrder(printer)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">顾客收据打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableReceipt" @click="btnEnableYlyReceipt(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableYlyReciept(printer)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box" v-for="printer in http.res.printerZhongwu.elements">
      <div class="printer_header box_radius_header">
        <div class="badge_delete" @click="btnDeleteZhongwu(printer)"></div>
        <div class="printer_box">
          <div class="printer_box_left">
            <div class="printer_type_title">中午云打印机</div>
            <div class="printer_type_name">{{printer.remark ? '名称：' + printer.remark : '序列号：' + printer.machineCode}}</div>
          </div>
          <div class="printer_box_right">
            <div class="printer_online_status" v-bind:class="{
            printer_online_status_online: getPrinterZhongwuOneStatus(printer) === '在线',
            printer_online_status_offline: getPrinterZhongwuOneStatus(printer) !== '在线'
            }">{{getPrinterZhongwuOneStatus(printer)}}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="printer_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">后厨订单打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableOrder" @click="btnEnableZhongwuOrder(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableZhongwuOrder(printer)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">顾客收据打印</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="printer.enableReceipt" @click="btnEnableZhongwuReceipt(printer)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnableZhongwuReciept(printer)"></div>
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

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.choosePrinter === 'poscom'}"
             @click="btnChoosePrinter('poscom')">佳博云
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.choosePrinter === 'feie'}"
             @click="btnChoosePrinter('feie')">飞鹅云
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.choosePrinter === 'yly'}"
             @click="btnChoosePrinter('yly')">易联云
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.choosePrinter === 'zhongwu'}"
             @click="btnChoosePrinter('zhongwu')">中午云
        </div>

        <div class="modal_menu modal_menu_disable">更多品牌请联系我们</div>

        <div class="blank_10"></div>

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
  import TitleBar from '../../../../../../components/common/TitleBar'
  import Empty from '../../../../../../components/common/Empty'
  import {scrollApi} from '../../../../../../api/local/scrollApi'
  import {httpPrinterFeieAdminApi} from '../../../../../../api/http/lt/httpPrinterFeieAdminApi'
  import {httpPrinterPoscomAdminApi} from '../../../../../../api/http/lt/httpPrinterPoscomAdminApi'
  import {httpPrinterYlyAdminApi} from '../../../../../../api/http/lt/httpPrinterYlyAdminApi'
  import {httpPrinterZhongwuAdminApi} from '../../../../../../api/http/lt/httpPrinterZhongwuAdminApi'

  export default {
    metaInfo: {
      title: '打印机列表'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '打印机列表',
          backUri: `/b/${this.$route.params.shortId}/owner/printer`,
          theme: 'white',
          imageHeight: 300
        },
        http: {
          res: {
            printerFeie: {
              elements: []
            },
            printerPoscom: {
              elements: []
            },
            printerYly: {
              elements: []
            },
            printerZhongwu: {
              elements: []
            }
          }
        },
        ui: {
          vCoverMask: false,
          vPrinter: false,
          choosePrinter: null,
          printerStatus: [],
          printerStatusLoads: [],
          interval: null
        }
      }
    },
    mounted() {
      this.httpPrinterFeie()
      this.httpPrinterPoscom()
      this.httpPrinterYly()
      this.httpPrinterZhongwu()
      this.ui.interval = setInterval(this.httpPrinter, 30 * 1000)
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
        this.ui.vCoverMask = false
        this.ui.vPrinter = false
        scrollApi.enable(true)

        if (!Boolean(this.ui.choosePrinter) || this.ui.choosePrinter.indexOf('un-support') !== -1) {
          return
        }

        this.$router.push(`/b/${this.$route.params.shortId}/owner/printer/create/${this.ui.choosePrinter}`)
      },
      httpPrinter() {
        this.ui.printerStatusLoads = []
        this.ui.printerStatus = []

        this.httpPrinterFeie()
        this.httpPrinterPoscom()
        this.httpPrinterYly()
        this.httpPrinterZhongwu()
      },
      httpPrinterFeie() {
        httpPrinterFeieAdminApi.getPrinter(this.$route.params.shortId, 0, 99).then(res => {
          if (this.http.res.printerFeie.elements.length !== 0 ||
                  this.http.res.printerPoscom.elements.length !== 0 ||
                  this.http.res.printerYly.elements.length !== 0||
                  this.http.res.printerZhongwu.elements.length !== 0
          ) {
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
      httpPrinterPoscom() {
        httpPrinterPoscomAdminApi.getPrinter(this.$route.params.shortId, 0, 99).then(res => {
          if (this.http.res.printerFeie.elements.length !== 0 ||
                  this.http.res.printerPoscom.elements.length !== 0 ||
                  this.http.res.printerYly.elements.length !== 0||
                  this.http.res.printerZhongwu.elements.length !== 0
          ) {
            this.$refs.titleBar_Printer.setTheme('image')
          } else {
            this.$refs.titleBar_Printer.setTheme('white')
          }

          this.http.res.printerPoscom = res

          for (let index in res.elements) {
            let printer = res.elements[index]
            this.getPrinterPoscomOneStatus(printer)
          }
        })
      },
      httpPrinterYly() {
        httpPrinterYlyAdminApi.getPrinter(this.$route.params.shortId, 0, 99).then(res => {
          if (this.http.res.printerFeie.elements.length !== 0 ||
                  this.http.res.printerPoscom.elements.length !== 0 ||
                  this.http.res.printerYly.elements.length !== 0||
                  this.http.res.printerZhongwu.elements.length !== 0
          ) {
            this.$refs.titleBar_Printer.setTheme('image')
          } else {
            this.$refs.titleBar_Printer.setTheme('white')
          }

          this.http.res.printerYly = res

          for (let index in res.elements) {
            let printer = res.elements[index]
            this.getPrinterYlyOneStatus(printer)
          }
        })
      },
      httpPrinterZhongwu() {
        httpPrinterZhongwuAdminApi.getPrinter(this.$route.params.shortId, 0, 99).then(res => {
          if (this.http.res.printerFeie.elements.length !== 0 ||
                  this.http.res.printerPoscom.elements.length !== 0 ||
                  this.http.res.printerYly.elements.length !== 0||
                  this.http.res.printerZhongwu.elements.length !== 0
          ) {
            this.$refs.titleBar_Printer.setTheme('image')
          } else {
            this.$refs.titleBar_Printer.setTheme('white')
          }

          this.http.res.printerZhongwu = res

          for (let index in res.elements) {
            let printer = res.elements[index]
            this.getPrinterZhongwuOneStatus(printer)
          }
        })
      },
      getPrinterFeieOneStatus(printer) {
        for (let index in this.ui.printerStatus) {
          let statusOne = this.ui.printerStatus[index]
          if (statusOne.id === printer.id && statusOne.status) {
            return statusOne.status
          }
        }

        for (let index in this.ui.printerStatusLoads) {
          let one = this.ui.printerStatusLoads[index]
          if (one === printer.id) {
            return
          }
        }

        this.ui.printerStatusLoads.push(printer.id)

        httpPrinterFeieAdminApi.getPrinterOneStatus(this.$route.params.shortId, printer.id).then(res => {
          let status

          if (res.notExists) {
            status = '不存在'
          } else if (res.offline) {
            status = '离线'
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '飞鹅云打印机',
              content: res.error
            })

            status = '错误'
          } else if (res.online) {
            status = '在线'
          }

          for (let index in this.ui.printerStatus) {
            let statusOne = this.ui.printerStatus[index]
            if (statusOne.id === printer.id) {
              return
            }
          }

          this.ui.printerStatus.push({
            id: printer.id,
            status: status
          })
        })
      },
      getPrinterPoscomOneStatus(printer) {
        for (let index in this.ui.printerStatus) {
          let statusOne = this.ui.printerStatus[index]
          if (statusOne.id === printer.id && statusOne.status) {
            return statusOne.status
          }
        }

        for (let index in this.ui.printerStatusLoads) {
          let one = this.ui.printerStatusLoads[index]
          if (one === printer.id) {
            return
          }
        }

        this.ui.printerStatusLoads.push(printer.id)

        httpPrinterPoscomAdminApi.getPrinterOneStatus(this.$route.params.shortId, printer.id).then(res => {
          let status

          if (res.notExists) {
            status = '不存在'
          } else if (res.offline) {
            status = '离线'
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '佳博云打印机',
              content: res.error
            })

            status = '错误'
          } else if (res.online) {
            status = '在线'
          }

          for (let index in this.ui.printerStatus) {
            let statusOne = this.ui.printerStatus[index]
            if (statusOne.id === printer.id) {
              return
            }
          }

          this.ui.printerStatus.push({
            id: printer.id,
            status: status
          })
        })
      },
      getPrinterYlyOneStatus(printer) {
        for (let index in this.ui.printerStatus) {
          let statusOne = this.ui.printerStatus[index]
          if (statusOne.id === printer.id && statusOne.status) {
            return statusOne.status
          }
        }

        for (let index in this.ui.printerStatusLoads) {
          let one = this.ui.printerStatusLoads[index]
          if (one === printer.id) {
            return
          }
        }

        this.ui.printerStatusLoads.push(printer.id)

        httpPrinterYlyAdminApi.getPrinterOneStatus(this.$route.params.shortId, printer.id).then(res => {
          let status

          if (res.notExists) {
            status = '不存在'
          } else if (res.offline) {
            status = '离线'
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '易联云打印机',
              content: res.error
            })

            status = '错误'
          } else if (res.online) {
            status = '在线'
          }

          for (let index in this.ui.printerStatus) {
            let statusOne = this.ui.printerStatus[index]
            if (statusOne.id === printer.id) {
              return
            }
          }

          this.ui.printerStatus.push({
            id: printer.id,
            status: status
          })
        })
      },
      getPrinterZhongwuOneStatus(printer) {
        for (let index in this.ui.printerStatus) {
          let statusOne = this.ui.printerStatus[index]
          if (statusOne.id === printer.id && statusOne.status) {
            return statusOne.status
          }
        }

        for (let index in this.ui.printerStatusLoads) {
          let one = this.ui.printerStatusLoads[index]
          if (one === printer.id) {
            return
          }
        }

        this.ui.printerStatusLoads.push(printer.id)

        httpPrinterZhongwuAdminApi.getPrinterOneStatus(this.$route.params.shortId, printer.id).then(res => {
          let status

          if (res.notExists) {
            status = '不存在'
          } else if (res.offline) {
            status = '离线'
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '中午云打印机',
              content: res.error
            })

            status = '错误'
          } else if (res.online) {
            status = '在线'
          }

          for (let index in this.ui.printerStatus) {
            let statusOne = this.ui.printerStatus[index]
            if (statusOne.id === printer.id) {
              return
            }
          }

          this.ui.printerStatus.push({
            id: printer.id,
            status: status
          })
        })
      },
      btnCreate() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)
        this.ui.vPrinter = true
      },
      btnDeleteFeie(printer) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除打印机',
          content: '确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpPrinterFeieAdminApi.deletePrinter(this.$route.params.shortId, printer.id).then(res => {
              if (res.printerIdNotExists) {
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
      btnDeletePoscom(printer) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除打印机',
          content: '确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpPrinterPoscomAdminApi.deletePrinter(this.$route.params.shortId, printer.id).then(res => {
              if (res.printerIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除打印机',
                  content: '打印机不存在。'
                })
              } else if (res.success) {
                this.httpPrinterPoscom()
              }
            })
          }
        })
      },
      btnDeleteYly(printer) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除打印机',
          content: '确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpPrinterYlyAdminApi.deletePrinter(this.$route.params.shortId, printer.id).then(res => {
              if (res.printerIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除打印机',
                  content: '打印机不存在。'
                })
              } else if (res.success) {
                this.httpPrinterYly()
              }
            })
          }
        })
      },
      btnDeleteZhongwu(printer) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除打印机',
          content: '确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpPrinterZhongwuAdminApi.deletePrinter(this.$route.params.shortId, printer.id).then(res => {
              if (res.printerIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除打印机',
                  content: '打印机不存在。'
                })
              } else if (res.success) {
                this.httpPrinterZhongwu()
              }
            })
          }
        })
      },
      btnEnableFeieOrder(printer) {
        printer.enableOrder = !printer.enableOrder

        httpPrinterFeieAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterFeie()
          }
        })
      },
      btnEnableFeieReceipt(printer) {
        printer.enableReceipt = !printer.enableReceipt

        httpPrinterFeieAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterFeie()
          }
        })
      },
      btnEnablePoscomOrder(printer) {
        printer.enableOrder = !printer.enableOrder

        httpPrinterPoscomAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterPoscom()
          }
        })
      },
      btnEnablePoscomReceipt(printer) {
        printer.enableReceipt = !printer.enableReceipt

        httpPrinterPoscomAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterPoscom()
          }
        })
      },
      btnEnableYlyOrder(printer) {
        printer.enableOrder = !printer.enableOrder

        httpPrinterYlyAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterYly()
          }
        })
      },
      btnEnableYlyReceipt(printer) {
        printer.enableReceipt = !printer.enableReceipt

        httpPrinterYlyAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterYly()
          }
        })
      },
      btnEnableZhongwuOrder(printer) {
        printer.enableOrder = !printer.enableOrder

        httpPrinterZhongwuAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterZhongwu()
          }
        })
      },
      btnEnableZhongwuReceipt(printer) {
        printer.enableReceipt = !printer.enableReceipt

        httpPrinterZhongwuAdminApi.putPrinter(this.$route.params.shortId, printer).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.printerId) {
            this.httpPrinterZhongwu()
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
