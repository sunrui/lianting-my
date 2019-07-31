<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>中午云官网请参考: <a class="tip_link" :href="getUrl()">http://www.zhongwu.co/</a>。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">appId</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 appId" maxlength="32" v-model="http.req.printer.appId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">appSecret</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 appSecret" maxlength="32" v-model="http.req.printer.appSecret">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">deviceId</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 deviceId" maxlength="32" v-model="http.req.printer.deviceId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">deviceSecret</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 deviceSecret" maxlength="32" v-model="http.req.printer.deviceSecret">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">备注打印机名</div>
          <label>
            <input class="addition_item_input" placeholder="请输入备注打印机名" maxlength="32" v-model="http.req.printer.remark">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">80MM 打印机</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.printer.eightyMM" @click="btnEightyMM(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnEightyMM(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import CurrencyInput from '../../../../../../components/common/CurrencyInput'
  import {httpPrinterZhongwuAdminApi} from '../../../../../../api/http/lt/httpPrinterZhongwuAdminApi'

  export default {
    metaInfo: {
      title: '添加中午云打印机'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加中午云打印机',
          backUri: `/b/${this.$route.params.shortId}/owner/printer/list`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printer: {
              appId: null,
              appSecret: null,
              deviceId: null,
              deviceSecret: null,
              enableOrder: true,
              enableReceipt: true,
              eightyMM: false,
              remark: null
            }
          }
        }
      }
    },
    methods: {
      getUrl() {
        return 'http://www.zhongwu.co/'
      },
      btnEightyMM(eightyMM) {
        this.http.req.printer.eightyMM = eightyMM
      },
      btnCreate() {
        if (!Boolean(this.http.req.printer.appId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加中午云打印机',
            content: '请输入 appId。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.appSecret)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加中午云打印机',
            content: '请输入 appSecret。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.deviceId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加中午云打印机',
            content: '请输入 deviceId。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.deviceSecret)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加中午云打印机',
            content: '请输入 deviceSecret。'
          })

          return
        }

        httpPrinterZhongwuAdminApi.getPrinterStatus(this.$route.params.shortId, this.http.req.printer).then(res => {
          if (res.notExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加中午云打印机',
              content: '打印机不存在，请检查配置是否正确。'
            })
          } else if (res.offline) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加中午云打印机',
              content: '打印机已离线，请确认打印机在线且可用。'
            })
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加中午云打印机',
              content: res.error
            })
          } else if (res.online) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加中午云打印机',
              content: '恭喜，打印机在线。'
            }).then(async (val) => {
              httpPrinterZhongwuAdminApi.putPrinter(this.$route.params.shortId, this.http.req.printer).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
                  return
                }

                if (res.printerId) {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '添加中午云打印机',
                    content: '添加成功。'
                  }).then(async (val) => {
                    this.$router.push(`/b/${this.$route.params.shortId}/owner/printer/list`)
                  })
                }
              })
            })
          } else {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加中午云打印机',
              content: res
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
</style>
