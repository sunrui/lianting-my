<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>请自行购买飞鹅云打印机，官网: <a class="tip_link" :href="getFeieUrl()">www.feieyun.com</a>。</li>
          <li>您无需电脑仅需要将打印机配置成WIFI或GPRS即可。</li>
          <li>配置请联系飞鹅客服并把以下信息填入到恋厅中。</li>
          <li>接下来订单就可以支持云打印了。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">飞鹅 USER</div>
          <input class="addition_item_input" placeholder="请输入飞鹅 USER" maxlength="30" v-model="http.req.printer.user">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">飞鹅 UKEY</div>
          <input class="addition_item_input" placeholder="请输入飞鹅 UKEY" maxlength="30" v-model="http.req.printer.ukey">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">飞鹅 SN</div>
          <input class="addition_item_input" placeholder="请输入飞鹅 SN" maxlength="30" v-model="http.req.printer.sn">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">备注打印机名</div>
          <input class="addition_item_input" placeholder="请输入备注打印机名" maxlength="30" v-model="http.req.printer.remark">
        </div>

        <div class="box_divide"></div>

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
  import {httpPrinterAdminApi} from '../../../../../../api/http/lt/httpPrinterAdminApi'

  export default {
    metaInfo: {
      title: '添加飞鹅云打印机'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加飞鹅云打印机',
          backUri: `/b/${this.$route.params.shortId}/owner/printer`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printer: {
              user: 'honeysense@outlook.com',
              ukey: 'UQIP3eJCQDSUQ8aS',
              sn: '930508336',
              enable: true,
              remark: null
            }
          }
        }
      }
    },
    methods: {
      getFeieUrl() {
        return 'http://www.feieyun.com'
      },
      btnCreate() {
        if (!Boolean(this.http.req.printer.user)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加飞鹅云打印机',
            content: '请输入飞鹅 USER。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.ukey)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加飞鹅云打印机',
            content: '请输入飞鹅 UKEY。'
          })

          return
        }

        if (!Boolean(this.http.req.printer.sn)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加飞鹅云打印机',
            content: '请输入飞鹅 SN。'
          })

          return
        }

        httpPrinterAdminApi.getPrinterFeieStatus(this.$route.params.shortId, this.http.req.printer).then(res => {
          if (res.notExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加飞鹅云打印机',
              content: '打印机不存在，请检查配置是否正确。'
            })
          } else if (res.offline) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加飞鹅云打印机',
              content: '打印机已离线，请确认打印机在线且可用。'
            })
          } else if (res.onlineNoPaper) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加飞鹅云打印机',
              content: '打印机在线，但可能已缺纸或其它异常。'
            })
          } else if (res.online) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加飞鹅云打印机',
              content: '恭喜，打印机在线。'
            }).then(async (val) => {
              httpPrinterAdminApi.putPrinterFeie(this.$route.params.shortId, this.http.req.printer).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
                  return
                }

                if (res.printerFeieId) {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '添加飞鹅云打印机',
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
              title: '添加飞鹅云打印机',
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
