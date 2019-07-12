<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>佳博云官网请参考: <a class="tip_link" :href="getFeieUrl()">http://cloud.poscom.cn/</a>。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">memberCode</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 memberCode" maxlength="30" v-model="http.req.printer.memberCode">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">apiKey</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 apiKey" maxlength="30" v-model="http.req.printer.apiKey">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">deviceNo</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 deviceNo" maxlength="30" v-model="http.req.printer.deviceNo">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">备注打印机名</div>
          <label>
            <input class="addition_item_input" placeholder="请输入备注打印机名" maxlength="30" v-model="http.req.printer.remark">
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
  import {httpPrinterPoscomAdminApi} from '../../../../../../api/http/lt/httpPrinterPoscomAdminApi'

  export default {
    metaInfo: {
      title: '添加佳博云打印机'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加佳博云打印机',
          backUri: `/b/${this.$route.params.shortId}/owner/printer`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printer: {
              memberCode: null,
              apiKey: null,
              deviceNo: null,
              enable: true,
              eightyMM: false,
              remark: null
            }
          }
        }
      }
    },
    methods: {
      getFeieUrl() {
        return 'http://cloud.poscom.cn/'
      },
      btnEightyMM(eightyMM) {
        this.http.req.printer.eightyMM = eightyMM
      },
      btnCreate() {
        if (!Boolean(this.http.req.printer.memberCode)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加佳博云打印机',
            content: '请输入 memberCode。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.apiKey)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加佳博云打印机',
            content: '请输入 apiKey。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.deviceNo)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加佳博云打印机',
            content: '请输入 deviceNo。'
          })

          return
        }

        httpPrinterPoscomAdminApi.getPrinterStatus(this.$route.params.shortId, this.http.req.printer).then(res => {
          if (res.notExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加佳博云打印机',
              content: '打印机不存在，请检查配置是否正确。'
            })
          } else if (res.offline) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加佳博云打印机',
              content: '打印机已离线，请确认打印机在线且可用。'
            })
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加佳博云打印机',
              content: res.error
            })
          } else if (res.online) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加佳博云打印机',
              content: '恭喜，打印机在线。'
            }).then(async (val) => {
              httpPrinterPoscomAdminApi.postPrinter(this.$route.params.shortId, this.http.req.printer).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
                  return
                }

                if (res.printerId) {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '添加佳博云打印机',
                    content: '添加成功。'
                  }).then(async (val) => {
                    this.$router.push(`/b/${this.$route.params.shortId}/owner/printer`)
                  })
                }
              })
            })
          } else {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加佳博云打印机',
              content: res
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'feie';
</style>
