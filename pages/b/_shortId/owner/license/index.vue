<template>
  <section>
    <nav-bar></nav-bar>

    <div v-if="ui.loading">
      <p>loading 的小圈圈</p>
    </div>
    <div v-else>
      <p>店铺名称 {{shop.name}}</p>
      <p>唯一标识 {{shop.shortId}}</p>
      <p>{{
        shop.licenseType === 'UnActive' ? '未激活' :
        shop.licenseType === 'Normal' ? '标准版' :
        shop.licenseType === 'Senior' ? '旗舰版' :
        shop.licenseType === 'Vip' ? '至尊版' :
        shop.licenseType
        }}</p>
      <p>过期时间 {{new Date(parseInt(shop.licenseExpiredAt)).toLocaleString()}}</p>
      <button @click="btnChargeHistory">续费记录</button>

      <hr>
      <div v-bind:key="shopLicensePlan.id" v-for="shopLicensePlan in shopLicensePlans.elements">
        <div v-if="shopLicensePlan.licenseType === 'UnActive'">
          <p>{{shopLicensePlan.name}}</p>
          <p>这里是标准版的介绍，前端写死</p>
          <button @click="btnChargeNow(shopLicensePlan)">立即续费</button>
        </div>
        <div v-if="shopLicensePlan.licenseType === 'Normal'">
          <p>{{shopLicensePlan.name}}</p>
          <p>这里是标准版的介绍，前端写死</p>
          <button @click="btnChargeNow(shopLicensePlan)">立即续费</button>
        </div>
        <div v-if="shopLicensePlan.licenseType === 'Senior'">
          <p>{{shopLicensePlan.name}}</p>
          <p>这里是标准版的介绍，前端写死</p>
          <button @click="btnChargeNow(shopLicensePlan)">立即续费</button>
        </div>
        <div v-if="shopLicensePlan.licenseType === 'Vip'">
          <p>{{shopLicensePlan.name}}</p>
          <p>这里是旗舰版的介绍，前端写死</p>
          <button @click="btnChargeNow(shopLicensePlan)">立即续费</button>
        </div>
        <hr>
      </div>

    </div>
  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'
  import { httpShopLicenseApi } from '../../../../../api/http/shop/httpShopLicenseApi'

  export default {
    metaInfo: {
      title: '续费'
    },
    middleware: ['auth', 'user-agent'],
    async asyncData({ store, route, userAgent }) {
      return {
        userAgent
      }
    },
    components: { NavBar },
    data() {
      return {
        shop: {},
        shopLicensePlans: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '续费',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.shop = res
        this.loadLicensePlan()
      })
    },
    methods: {
      loadLicensePlan() {


        httpShopLicenseApi.getPlanAll(this.shop.type, 0, 20).then(res => {
          this.shopLicensePlans = res
        })
      },
      btnChargeHistory() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/license/history`)
      },
      prepareWechatPay(jsPay) {
        function onBridgeReady() {
          alert('onBridgeReady')

          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              'appId': jsPay.appId,     //公众号名称，由商户传入
              'timeStamp': jsPay.timeStamp,         //时间戳，自1970年以来的秒数
              'nonceStr': jsPay.nonceStr, //随机串
              'package': jsPay.package,
              'signType': jsPay.signType,   //微信签名方式：
              'paySign': jsPay.paySign //微信签名
            },
            function(res) {
              alert(JSON.stringify(res))
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                alert('支付已成功，支付结果可能存在延迟，请稍候刷新等待服务器返回。')
              }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠
              else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                alert('您已取消支付')
              }
            }
          )
        }

        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        } else {
          onBridgeReady()
        }
      },
      btnChargeNow(shopLicensePlan) {
        let inWechat = this.userAgent.match(/MicroMessenger/i)
        if (!Boolean(inWechat)) {
          alert('请在微信中打开')
          // return;
        }


        httpShopLicenseApi.postOrder(this.$route.params.shortId, shopLicensePlan.id, 3, 'WECHAT_JSAPI').then(res => {
          this.ui.loading = false

          if (res.shortIdNotExists) {
            alert('店铺不存在')
            return
          }

          if (res.shopLicensePlanIdNotExists) {
            alert('续费授权不存在')
            return
          }

          if (res.pay) {
            if (res.pay.wechat) {
              this.prepareWechatPay(res.pay.wechat.jsPay)
            }

            if (res.pay.wechatOpenIdNotExists) {
              alert('请先获得微信授权')
              return
            }

            if (res.pay.payConfigWechatNotExists) {
              alert('商户尚未设置微信支付参数')
              return
            }

            if (res.pay.payWayNotSupport) {
              alert('暂示支付此支付方式')
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
