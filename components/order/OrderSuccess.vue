<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_20"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <div class="status_logo_radius_image success_logo_radius_image"></div>
        </div>

        <div class="status_title">{{ getStatusTitle() }}</div>

        <div class="blank_40"></div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">共计菜数</div>
          <div class="status_item_content">{{getTotalFood()}} 份</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">餐具费</div>
          <div class="status_item_content">{{http.res.order.priceTableware}} 元</div>
        </div>
        <div class="status_item" v-if="http.res.order.priceTakeOutFee > 0">
          <div class="status_item_label">配送费</div>
          <div class="status_item_content">{{http.res.order.priceTakeOutFee}} 元</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">人数</div>
          <div class="status_item_content">{{http.res.order.people}} 人</div>
        </div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">总价</div>
          <div class="status_item_content">{{http.res.order.price}} 元</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">支付方式</div>
          <div class="status_item_content">
            {{
            http.res.order.status === 'Paid' ? '已支付' :
            http.res.order.status === 'NotPaid' ? '未支付' :
            http.res.order.status === 'Finish' ? '已完成' :
            http.res.order.status === 'Closed' ? '已关闭' : http.res.order.status
            }}
          </div>
        </div>
        <div class="status_item">
          <div class="status_item_label">下单时间</div>
          <div class="status_item_content">{{dateFormat(new Date(parseInt(http.res.order.createdAt)))}}</div>
        </div>

        <div class="blank_20"></div>
      </div>
    </div>

    <div v-if="http.res.order.type === 'TakeOut' && http.res.order.status === 'NotPaid'">
      <div class="box">
        <div class="tip">
          <ul class="tip_ul">
            <li>如您未在线支付，请确认商家支持线下收款。</li>
          </ul>
        </div>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnPay">立即支付</div>
      </div>
    </div>
    <div v-else>
      <div class="box">
        <div class="addition box_radius">
          <div class="addition_item">
            <div class="addition_item_label">下单菜数</div>
            <div class="addition_item_content">{{$route.query.cartSelect}} 份</div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">价格</div>
            <div class="addition_item_content success_order_price">{{$route.query.cartPrice}}</div>
          </div>
        </div>
      </div>

      <div class="box" v-if="http.res.config.prepayment && roleType === 'c'">
        <div class="tip">
          <ul class="tip_ul">
            <li>为了您的正常用餐，请您立即支付。</li>
          </ul>
        </div>
      </div>

      <div class="button_box">
        <div class="button_big" v-if="http.res.config.prepayment && roleType === 'c'" @click="btnPay">立即支付</div>
        <div class="button_big" v-else @click="btnFood">继续点餐</div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {userApi} from '../../api/local/userApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {timeApi} from '../../api/local/timeApi'
  import {alipayApi} from '../../api/local/alipayApi'

  export default {
    metaInfo: {
      title: '下单成功'
    },
    middleware: 'auth',
    components: {TitleBar},
    props: {
      roleType: {
        type: String,
        default: 'c'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '下单成功',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 220
        },
        ui: {},
        http: {
          res: {
            order: {},
            config: {}
          }
        }
      }
    },
    mounted() {
      if (this.roleType === 'c') {
        this.title.backUri = `/c/${this.$route.params.shortId}`
      } else {
        this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}`
      }

      this.httpOrder()
      this.httpConfig()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.res.config = res

          if (res.prepayment && this.roleType === 'c') {
            this.title.title = '确认订单'
          }
        })
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res
        })
      },
      getStatusTitle() {
        if (this.http.res.config.prepayment && this.roleType === 'c') {
          return '订单尚未支付'
        }

        return this.http.res.order.type === 'TakeOut' ? '外卖请求已发送给商家' : '订单已发送后厨'
      },
      getTotalFood() {
        let count = 0

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
          count += orderFood.count
        }

        return count
      },
      btnFood() {
        if (this.roleType === 'c') {
          this.$router.push(`/c/${this.$route.params.shortId}/food`)
        } else {
          this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/table`)
        }
      },
      prepareWechatPay(jsPay) {
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
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '立即支付',
                    content: '您的支付已取消，您可稍候在个人中心-我的订单继续完成支付。'
                  }).then(async (val) => {
                    pThis.httpShop()
                  })
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
      payNow() {
        httpOrderApi.postPay(this.$route.params.shortId, this.$route.query.orderOneId, 'WECHAT_JSAPI', null).then(res => {
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
            if (res.pay.subMchIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '商家尚未设置微信支付参数。'
              })
              return
            }

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

            if (res.pay.payWayNotSupport) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即支付',
                content: '暂未支付此支付方式。'
              })
              return
            }

            if (res.pay.wechat) {
              this.prepareWechatPay(this.pay.wechat.jsPay)
            }
          }
        })
      },
      btnPay() {
        if (!wechatApi.inWechat() && !alipayApi.inAlipay()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '请在微信或支付宝中使用。'
          })

          return
        }

        if (alipayApi.inAlipay()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '商家尚未开通支付宝支付，请您线下付款。'
          })

          return
        }

        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          if (wechatApi.inWechat() && !Boolean(res.openWechat)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '商家尚未开通微信支付，请您线下付款。'
            })

            return
          }

          if (alipayApi.inAlipay() && !Boolean(res.openAlipay)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '商家尚未开通在线支付，请您线下付款。'
            })

            return
          }

          this.payNow()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'OrderSuccess';
</style>
