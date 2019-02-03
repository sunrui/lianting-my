<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="shop_name">{{http.res.shop.name}}</div>

        <div class="shop_license">
          <div class="shop_title_license">
            <div class="shop_title_license_king"></div>
            <div class="shop_title_license_label">
              {{
              http.res.shop.licenseType === 'Normal' ? '标准会员' :
              http.res.shop.licenseType === 'Senior' ? '旗舰会员' :
              http.res.shop.licenseType === 'Vip' ? '至尊会员' : http.res.shop.licenseType
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="shop_detail box_radius_footer">
        <div class="shop_detail_one">
          <div class="shop_detail_left">店铺类型: {{
            http.res.shop.licenseType === 'Normal' ? '标准会员' :
            http.res.shop.licenseType === 'Senior' ? '旗舰会员' :
            http.res.shop.licenseType === 'Vip' ? '至尊会员' :
            http.res.shop.licenseType
            }}
          </div>
          <div class="shop_detail_expired_at">过期时间: {{new Date(parseInt(http.res.shop.licenseExpiredAt)).toLocaleDateString()}}</div>
        </div>
        <div class="shop_detail_one">
          <div class="shop_detail_left">唯一标识: {{http.res.shop.shortId}}</div>
          <div class="shop_license_history">续费记录</div>
        </div>

        <div class="blank_10"></div>
      </div>
    </div>

    <div class="blank_50"></div>

    <div class="shop_license_plan box_radius" v-for="shopLicensePlan in http.res.shopLicensePlans">
      <div class="blank_40"></div>

      <div class="shop_license_type">
        <div class="shop_license_icon"></div>
        <div class="shop_license_label">免费版</div>
      </div>

      <div class="blank_20"></div>
      <div class="shop_license_price">不收取任何费用</div>
      <div class="blank_10"></div>

      <div class="box_divide"></div>

      <div class="shop_license_feature">
        <div class="shop_license_feature_icon"></div>
        <div class="shop_license_feature_label">在线支付渠道</div>
      </div>

      <div class="blank_30"></div>

      <div class="shop_license_button">立即续费</div>

      <div class="blank_50"></div>
    </div>
  </div>
</template>

<script>
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'
  import { httpShopLicenseApi } from '../../../../../api/http/shop/httpShopLicenseApi'
  import TitleBar from '../../../../../components/common/TitleBar'

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
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '续费',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 0
        },
        http: {
          res: {
            shop: {},
            shopLicensePlans: {}
          }
        },
        ui: {}
      }
    },
    created() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.res.shop = res
        this.loadLicensePlan()
      })
    },
    methods: {
      loadLicensePlan() {
        httpShopLicenseApi.getPlanAll(this.http.res.shop.type, 0, 20).then(res => {
          this.http.res.shopLicensePlans = res
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

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_shop';
  @import 'index';
</style>
