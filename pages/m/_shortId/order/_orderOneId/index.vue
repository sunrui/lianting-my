<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-if="http.res.order.orderTable">
      <div class="order_table box_radius">
        <div class="order_table_number">{{http.res.order.orderTable.tableFullNumber}}</div>
        <div class="order_table_name">{{http.res.order.orderTable.tableGroupName}}</div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{new Date(parseInt(http.res.order.createdAt)).toLocaleString()}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div class="order_food" v-for="orderFood in http.res.order.orderFoods">
          <img class="order_food_image" :src="orderFood.foodCategoryImage"/>
          <div class="order_food_name_detail">
            <div class="order_food_name_detail_name">{{orderFood.foodCategoryName}}</div>
            <div class="order_food_name_detail_name_category">{{orderFood.foodName}}</div>
          </div>
          <div class="order_food_status order_food_status_wait" v-if="orderFood.status === 'Wait'">已下单</div>
          <div class="order_food_status order_food_status_cooking" v-if="orderFood.status === 'Cooking'">正在做</div>
          <div class="order_food_status order_food_status_cooked" v-if="orderFood.status === 'Cooked'">做好了</div>
          <div class="order_food_status order_food_status_finish" v-if="orderFood.status === 'Finish'">已上菜</div>
          <div class="order_food_count">{{orderFood.count}}</div>
          <div class="order_food_price">{{orderFood.count * orderFood.foodPrice}}</div>
        </div>

        <div class="order_tableware">
          <div class="order_tableware_icon">餐位费</div>
          <div class="order_tableware_label">餐具</div>
          <div class="order_tableware_count">{{http.res.order.people}}</div>
          <div class="order_tableware_price">{{http.res.order.priceTableware}}</div>
        </div>

        <div @click="btnChooseCoupon()">
          <div class="order_coupon" v-if="http.res.order.couponDeductPrice &&
        (!$route.query.deductPrice ? true : $route.query.deductPrice === http.res.order.couponDeductPrice)">
            <div class="order_coupon_icon">优惠券</div>
            <div class="order_coupon_label">优惠</div>
            <div class="order_coupon_content">{{http.res.order.couponDeductPrice}}</div>
          </div>
          <div class="order_coupon" v-else-if="http.res.coupon.valid.length > 0">
            <div class="order_coupon_icon">优惠券</div>
            <div class="order_coupon_label">优惠</div>
            <div class="order_coupon_content" v-if="$route.query.deductPrice > 0">{{$route.query.deductPrice}}</div>
            <div class="order_coupon_count" v-else>{{http.res.coupon.valid.length}}张优惠券可用</div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="order_price">
          <div class="order_price_food_count">共计 {{getTotalFood()}} 份</div>
          <div class="order_price_total">{{http.res.order.price}}</div>
          <div class="order_price_total_label">小计</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">就餐人数</div>
          <div class="addition_item_content">{{http.res.order.people}} 人</div>
        </div>

        <div v-if="http.res.order.tasteNotes && http.res.order.tasteNotes.length > 0">
          <div class="box_divide"></div>

          <div class="order_taste_note">
            <div class="order_taste_note_label">口味</div>
          </div>

          <div class="order_taste_note_history">
            <div class="order_taste_note_history_item" v-for="taskNote in http.res.order.tasteNotes">
              <div class="order_taste_note_history_icon_ball"></div>
              <div class="order_taste_note_history_icon_line"></div>
              <div class="order_taste_note_history_content">{{taskNote}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">订单状态</div>
          <div class="addition_item_content">{{
            http.res.order.status === 'Paid' ? '已支付' :
            http.res.order.status === 'NotPaid' ? '待支付' :
            http.res.order.status === 'Finish' ? '已完成' :
            http.res.order.status === 'Closed' ? '已关闭' : http.res.order.status
            }}
          </div>
        </div>

        <div class="addition_item" v-if="http.res.order.payMethod">
          <div class="addition_item_label">支付方式</div>
          <div class="addition_item_content">{{
            http.res.order.payMethod === 'Wechat' ? '微信支付' :
            http.res.order.payMethod === 'Alipay' ? '支付宝支付' :
            http.res.order.payMethod === 'Offline' ? '线下支付' :
            http.res.order.payMethod === 'Cancel' ? '取消支付' : http.res.order.payMethod
            }}
          </div>
        </div>

        <div v-if="http.res.order.payPaidAt">
          <div class="box_divide"></div>
          <div class="addition_item">
            <div class="addition_item_label">支付时间</div>
            <div class="addition_item_content">{{new Date(parseInt(http.res.order.payPaidAt)).toLocaleString()}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius" @click="btnWall(http.res.order)">
        <div class="addition_item">
          <div class="addition_item_label">留言墙</div>
          <div class="addition_item_link">{{ http.res.order.wallId ? '已留言' : '未留言' }}</div>
        </div>
      </div>
    </div>

    <div class="button_box" v-if="http.res.order.status === 'NotPaid'">
      <div class="button_small" @click="btnFood">加餐</div>
      <div class="button_small" @click="btnPay">立即支付</div>
    </div>
    <div class="blank_30" v-else></div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import {httpCouponApi} from "../../../../../api/http/lt/httpCouponApi"
  import {stateApi as localStateApi} from "../../../../../api/local/stateApi"

  export default {
    metaInfo: {
      title: '订单详情'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '订单详情',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            order: {},
            coupon: {
              valid: []
            }
          }
        },
        ui: {}
      }
    },
    created() {
      if (this.$route.query.deductPrice && this.$route.query.deductPrice !== this.http.res.order.couponDeductPrice) {
        this.btnChooseCouponConfirm()
      } else {
        this.httpOrder()
      }
    },
    methods: {
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res

          this.httpCoupon()
        })
      },
      httpCoupon() {
        httpCouponApi.getAll(this.$route.params.shortId, 0, 99).then(res => {
          if (res.elements.length === 0) {
            return
          }

          for (let index in res.elements) {
            let coupon = res.elements[index]

            if (Boolean(coupon.orderId)) {
              continue
            }

            if (new Date().getTime() < coupon.validAt) {
              continue
            }

            if (new Date().getTime() > coupon.expiredAt) {
              continue
            }

            if (this.http.res.order.price < coupon.chargePrice) {
              continue
            }

            this.http.res.coupon.valid.push(coupon)
          }
        })
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
        this.$router.push(`/m/${this.$route.params.shortId}/food`)
      },
      btnWall(order) {
        if (!Boolean(order.wallId)) {
          this.$router.push({
            path: `/m/${this.$route.params.shortId}/wall/create`,
            query: {
              orderOneId: order.id
            }
          })
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/wall/${order.wallId}`)
        }
      },
      btnChooseCoupon() {
        if (this.http.res.coupon.valid.length > 0) {
          this.$router.push({
            path: `/m/${this.$route.params.shortId}/coupon/choose`,
            query: {
              orderOneId: this.$route.params.orderOneId,
              price: this.http.res.order.price
            }
          })
        }
      },
      btnChooseCouponConfirm() {
        httpOrderApi.postCoupon(this.$route.params.shortId, this.$route.params.orderOneId, this.$route.query.couponId).then(res => {
          if (res.orderNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '使用优惠券',
              content: '订单不存在。'
            })
            return
          }

          if (res.orderClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '使用优惠券',
              content: '订单已关闭。'
            })
            return
          }

          if (res.orderPaid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '使用优惠券',
              content: '订单已支付。'
            })
            return
          }

          if (res.couponIdNotValid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '使用优惠券',
              content: '优惠券无效。'
            })
            return
          }

          if (res.success) {
            this.httpOrder()
          }
        })
      },
      prepareWechatPay(jsPay) {
        function onBridgeReady() {
          alert('onBridgeReady')

          WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": jsPay.appId,
              "timeStamp": jsPay.timeStamp,
              "nonceStr": jsPay.nonceStr,
              "package": jsPay.package,
              "signType": jsPay.signType,
              "paySign": jsPay.paySign
            },
            function (res) {
              if (res.err_msg === "get_brand_wcpay_request:ok") {
                alert('支付已成功，支付结果可能存在延迟，请稍候刷新等待服务器返回。')
              } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                alert('您已取消支付')
              }
            }
          )
        }

        if (typeof WeixinJSBridge === "undefined") {
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
        httpOrderApi.postPay(this.$route.params.shortId, this.$route.params.orderOneId, 'WECHAT_JSAPI', this.$route.query.couponId).then(res => {
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
                content: '商户尚未设置微信支付参数。'
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
                content: '尚未开通微信支付，您可线下付款。'
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
        let wechatOpenId = localStateApi.user.getWechatOpenId()
        if (!Boolean(wechatOpenId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '请使用微信打开。'
          })

          return
        }

        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          if (!Boolean(res.subMchId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即支付',
              content: '尚未开通微信支付，您可线下付款。'
            })

            return
          }

          this.payNow()
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/order';
  @import 'index';
</style>
