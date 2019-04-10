<template>
  <div>
    <empty v-if="!ui.inWechat" image="/img/no/no_crash.png" content="请在微信中使用。"></empty>
  </div>
</template>

<script>
  import {httpWechatApi} from "../../api/http/lt/httpWechatApi"
  import Empty from "../../components/common/Empty"
  import {wechatApi} from "../../api/local/wechatApi"

  export default {
    metaInfo: {
      title: '扫码点餐'
    },
    components: {Empty},
    data() {
      return {
        ui: {
          inWechat: wechatApi.inWechat()
        }
      }
    },
    created() {
      if (!this.ui.inWechat) {
        return
      }

      this.openScan()
    },
    methods: {
      openScan() {
        let pThis = this

        let url = window.location.href.split("#")[0]
        httpWechatApi.getConfig('ltcity', url).then(res => {
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
              jsApiList: ["qrCode", "barCode"],
              success: function (res) {
              }
            })

            wx.scanQRCode({
              needResult: 0,
              scanType: ["qrCode"],
              success: function (res) {
                WeixinJSBridge.call('closeWindow')
              },
            })
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>