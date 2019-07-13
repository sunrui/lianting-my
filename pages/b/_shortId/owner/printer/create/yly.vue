<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>易联云官网请参考: <a class="tip_link" :href="getUrl()">https://www.yilianyun.net</a>。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">clientId</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 clientId" maxlength="32" v-model="http.req.printer.clientId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">clientSecret</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 clientSecret" maxlength="32" v-model="http.req.printer.clientSecret">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">machineCode</div>
          <label>
            <input class="addition_item_input" placeholder="请输入 machineCode" maxlength="32" v-model="http.req.printer.machineCode">
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
  import {httpPrinterYlyAdminApi} from '../../../../../../api/http/lt/httpPrinterYlyAdminApi'

  export default {
    metaInfo: {
      title: '添加易联云打印机'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加易联云打印机',
          backUri: `/b/${this.$route.params.shortId}/owner/printer/list`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printer: {
              clientId: null,
              clientSecret: null,
              machineCode: null,
              enable: true,
              eightyMM: false,
              remark: null
            }
          }
        }
      }
    },
    methods: {
      getUrl() {
        return 'https://www.yilianyun.net'
      },
      btnEightyMM(eightyMM) {
        this.http.req.printer.eightyMM = eightyMM
      },
      btnCreate() {
        if (!Boolean(this.http.req.printer.clientId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加易联云打印机',
            content: '请输入 clientId。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.clientSecret)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加易联云打印机',
            content: '请输入 clientSecret。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.machineCode)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加易联云打印机',
            content: '请输入 machineCode。'
          })

          return
        }

        httpPrinterYlyAdminApi.getPrinterStatus(this.$route.params.shortId, this.http.req.printer).then(res => {
          if (res.notExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加易联云打印机',
              content: '打印机不存在，请检查配置是否正确。'
            })
          } else if (res.offline) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加易联云打印机',
              content: '打印机已离线，请确认打印机在线且可用。'
            })
          } else if (res.error) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加易联云打印机',
              content: res.error
            })
          } else if (res.online) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加易联云打印机',
              content: '恭喜，打印机在线。'
            }).then(async (val) => {
              httpPrinterYlyAdminApi.postPrinter(this.$route.params.shortId, this.http.req.printer).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
                  return
                }

                if (res.printerId) {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '添加易联云打印机',
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
              title: '添加易联云打印机',
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
</style>
