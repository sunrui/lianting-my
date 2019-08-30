<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date())}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="addition_no_top box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">支付类型</div>
          <div class="addition_item_tag">
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1"
                 v-if="ui.type === 'order'"
                 @click="btnChooseType('sms')">餐费买单
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_2"
                 v-if="ui.type === 'sms'"
                 @click="btnChooseType('license')">短信续包
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_3"
                 v-if="ui.type === 'license'"
                 @click="btnChooseType('order')">升级授权
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="pay_price">
          <div class="pay_price_label">{{ui.price}}</div>
        </div>

        <div class="blank_5"></div>
      </div>
    </div>

    <div class="box">
      <div class="pay_method box_radius">
        <div class="blank_20"></div>
        <div class="pay_method_title">请选择支付方式</div>
        <div class="box_divide"></div>

        <div class="pay_method_one" @click="btnChooseWechat(true)">
          <img class="pay_method_icon" src="/img/login/login_wechat.png" alt="微信支付">
          <div class="pay_method_label">微信支付 <span v-if="!canWechatPay()" class="pay_method_label_disable">(不可用)</span></div>
          <div class="addition_item_radio">
            <div class="addition_item_radio_icon_select" v-if="ui.chooseWechat"></div>
            <div class="addition_item_radio_icon_unselect" v-else></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="pay_method_one" @click="btnChooseWechat(false)">
          <img class="pay_method_icon" src="/img/login/login_alipay.png" alt="支付宝支付">
          <div class="pay_method_label">支付宝支付 <span v-if="!canAlipay()" class="pay_method_label_disable">(不可用)</span></div>
          <div class="addition_item_radio">
            <div class="addition_item_radio_icon_select" v-if="!ui.chooseWechat"></div>
            <div class="addition_item_radio_icon_unselect" v-else></div>
          </div>
        </div>

        <div class="blank_20"></div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnPay">立即支付</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../components/common/TitleBar'
  import ImageUpload from '../../components/common/ImageUpload'
  import {timeApi} from '../../api/local/timeApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'

  export default {
    metaInfo: {
      title: '确认支付'
    },
    middleware: 'auth',
    components: {TitleBar, ImageUpload},
    data() {
      return {
        title: {
          canBack: true,
          title: '确认支付',
          backUri: `c/${this.$route.query.shortId}/order/history`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            pay: {}
          },
          res: {
            config: {
              openWechat: true,
              openAlipay: true
            }
          }
        },
        ui: {
          chooseWechat: true,
          type: 'order',
          price: null
        }
      }
    },
    mounted() {
      this.ui.type = this.$route.query.type ? this.$route.query.type : 'order'
      this.ui.price = this.$route.query.price ? this.$route.query.price : '0.0'

      this.httpConfig()
    },
    methods: {
      httpConfig() {
        httpOrderApi.getConfig(this.$route.query.shortId).then(res => {
          this.http.res.config = res

          this.ui.chooseWechat = this.canWechatPay()
        })
      },
      btnChooseWechat(enable) {
        if (!this.canWechatPay()) {
          return
        }

        this.ui.chooseWechat = enable
      },
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      btnChooseType(type) {
        // this.ui.type = type
      },
      canWechatPay() {
        return wechatApi.inWechat() && this.http.res.config.openWechat
      },
      canAlipay() {
        return this.http.res.config.openAlipay
      },
      btnPay() {
        if (!this.$route.query.shortId) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '没有指定店铺号。'
          })

          return
        }

        if (!this.$route.query.orderOneId) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '没有指定订单号。'
          })

          return
        }

        if (this.ui.chooseWechat) {
          this.httpPay('WECHAT_JSAPI')
        } else {
          if (wechatApi.inWechat()) {
            this.$msgBox.doModal({
              type: 'yesOrNo',
              title: '立即支付',
              content: '在微信中使用支付宝时会受到阻止，但您仍可以在复制链接后继续付款。'
            }).then(async (val) => {
              if (val !== 'Yes') {
                return
              }

              this.httpPay('ALIPAY_QUICK_WAP_WAY')
            })
          } else {
            this.httpPay('ALIPAY_QUICK_WAP_WAY')
          }
        }
      },
      weixinJSBridgePay(jsPay) {
        let pThis = this

        function onBridgeReady() {
          WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                'appId': jsPay.appId,
                'timeStamp': jsPay.timeStamp,
                'nonceStr': jsPay.nonceStr,
                'package': jsPay.package,
                'signType': jsPay.signType,
                'paySign': jsPay.paySign
              },
              function (res) {
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '立即支付',
                    content: '支付已成功，支付结果可能存在延迟，请稍候刷新等待服务器返回。'
                  }).then(async (val) => {
                    pThis.httpShop()
                  })
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
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
      httpPay(payWay) {
        httpOrderApi.postPay(this.$route.query.shortId, this.$route.query.orderOneId, payWay).then(res => {
          if (res.orderNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '订单不存在。'
            })

            return
          }

          if (res.orderClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '订单已关闭。'
            })

            return
          }

          if (res.orderPaid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '订单已支付。'
            })

            return
          }

          if (res.pay) {
            if (res.pay.wechatOpenIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '请先获得微信授权。'
              })

              return
            }

            if (res.pay.payConfigWechatNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '商家尚未开通微信支付，请您线下付款。'
              })

              return
            }

            if (res.pay.payConfigAlipayNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '商家尚未开通支付宝支付，请您线下付款。'
              })

              return
            }

            if (res.pay.payWayNotSupport) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '暂未支持此支付方式。'
              })

              return
            }

            if (res.pay.wechat) {
              this.weixinJSBridgePay(res.pay.wechat.jsPay)
            }

            if (res.pay.alipayForm) {
              const div = document.createElement('div')
              div.innerHTML = res.pay.alipayForm
              document.body.appendChild(div)
              document.forms[0].submit()
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
