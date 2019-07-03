<template>
  <div class="scan">
    <title-bar v-show="false" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty v-if="!ui.inWechat" image="/img/no/no_crash.png" content="请在微信中使用。"></empty>
    <div class="scan_image" @click="btnScan"></div>
    <div class="scan_label">扫一扫</div>
  </div>
</template>

<script>
  import {httpWechatApi} from '../../api/http/lt/httpWechatApi'
  import Empty from '../../components/common/Empty'
  import {wechatApi} from '../../api/local/wechatApi'
  import TitleBar from '../../components/common/TitleBar'
  import {urlApi} from '../../api/local/urlApi'
  import {alipayApi} from '../../api/local/alipayApi'

  export default {
    metaInfo: {
      title: '扫码点餐'
    },
    components: {Empty, TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '扫码点餐',
          backUri: ``,
          theme: 'white',
          imageHeight: 0
        }
      }
    },
    created() {
      if (alipayApi.inAlipay()) {
        this.scanAlipay()
      }

      if (wechatApi.inWechat()) {
        this.scanWechat()
      }
    },
    methods: {
      scanAlipay() {
        alipayApi.scan()
      },
      scanWechat() {
        let pThis = this

        httpWechatApi.getConfig('scan', urlApi.getCurrentUrl()).then(res => {
          let wx = require('weixin-js-sdk')

          wx.config({
            debug: false,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.noncestr,
            signature: res.signature,
            jsApiList: [
              'checkJsApi', 'scanQRCode']
          })

          wx.error(function (res) {
            pThis.$msgBox.doModal({
              type: 'yes',
              title: '扫码失败',
              content: JSON.stringify(res)
            })
          })

          wx.ready(function () {
            wx.checkJsApi({
              jsApiList: ['qrCode', 'barCode'],
              success: function (res) {
              }
            })

            wx.scanQRCode({
              needResult: 0,
              scanType: ['qrCode'],
              success: function (res) {
                wechatApi.closeWindow()
              },
              error: function (res) {
                wechatApi.closeWindow()
              }
            })
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "index";
</style>
