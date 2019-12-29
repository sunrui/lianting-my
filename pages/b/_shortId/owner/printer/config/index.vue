<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">订单打印次数</div>
          <label>
            <input type="number" class="addition_item_input" placeholder="请输入打印次数"
                   oninput="value=value.replace(/[^0-9]/g,''); if (value === '') value = 1;
                            if (value.length >= 2) value = value.slice(0, 2)"
                   v-model="http.req.printerConfig.repeatTime">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpPrinterAdminApi} from '../../../../../../api/http/lt/httpPrinterAdminApi'

  export default {
    metaInfo: {
      title: '打印设置'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '打印设置',
          backUri: `/b/${this.$route.params.shortId}/owner/printer`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            printerConfig: {
              printWhenOrder: true,
              printWhenPaid: true,
              printCaptcha: true,
              errorSmsReport: true,
              repeatTime: null
            }
          }
        }
      }
    },
    mounted() {
      this.httpPrinterConfig()
    },
    methods: {
      btnUpdate() {
        if (this.http.req.printerConfig.repeatTime === 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '打印设置',
            content: '至少打印一张。'
          })

          return
        }

        httpPrinterAdminApi.putConfig(this.$route.params.shortId, this.http.req.printerConfig).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '打印设置',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      },
      httpPrinterConfig() {
        httpPrinterAdminApi.getConfig(this.$route.params.shortId).then(res => {
          if (!res.repeatTime) {
            res.repeatTime = 1
          }

          this.http.req.printerConfig = res
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
