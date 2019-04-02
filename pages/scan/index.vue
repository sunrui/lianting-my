<template>
</template>

<script>
  import {httpWechatApi} from "../../api/http/lt/httpWechatApi"

  export default {
    metaInfo: {
      title: '扫码点餐'
    },
    created() {
      let pThis = this

      let url = location.href.split('#')[0]
      httpWechatApi.getConfig(this.$route.params.shortId, url).then(res => {
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
            jsApiList: ['scanQRCode'],
            success: function (res) {

            }
          })

          wx.scanQRCode({
            needResult: 0,
            scanType: ["qrCode"],
            success: function (res) {
            }
          })
        })
      })
    }
  }
</script>

<style scoped>

</style>