<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="coupon_fetch" v-if="http.res.coupons.length > 0" @click="btnCouponFetch">
      <div class="coupon_label_left">￥{{getLittleCoupon().deductPrice}}满{{getLittleCoupon().chargePrice}}元可用</div>
      <div class="coupon_divide_radius"></div>
      <div class="coupon_label_right">领取</div>
    </div>

    <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

    <div class="box" v-if="http.res.order.orderTakeout">
      <div class="list_title box_radius_header">
        <div class="list_title_label">外卖配送详情</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label_text_area">地址</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入您的配送地址" readonly v-model="http.res.order.orderTakeout.address"></textarea>
            </label>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">订单人</div>
          <div class="addition_item_content" style="user-select: text;">{{http.res.order.orderTakeout.name}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">手机号</div>
          <div class="addition_item_content" style="user-select: text;">{{http.res.order.orderTakeout.phone}}</div>
        </div>
      </div>
    </div>

    <div class="box" v-if="http.res.order.orderTable">
      <div class="order_table box_radius">
        <div class="order_table_number">{{http.res.order.orderTable.tableFullNumber}}</div>
        <div class="order_table_name">{{http.res.order.orderTable.tableGroupName}}</div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date(parseInt(http.res.order.createdAt)))}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div class="order_food" v-for="orderFood in http.res.order.orderFoods">
          <img class="order_food_image" :src="orderFood.foodCategoryImage" :alt="orderFood.foodCategoryName">
          <div class="order_food_name_detail">
            <div class="order_food_name_detail_name">{{orderFood.foodCategoryName}}</div>
            <div class="order_food_name_detail_name_category">{{orderFood.foodName}}</div>
          </div>
          <div v-if="!http.res.config.foodFinishAuto && !http.res.order.orderTakeout && http.res.order.status !== 'Finish' && http.res.order.status !== 'Cancel'">
            <div class="order_food_status order_food_status_wait" v-if="orderFood.status === 'Wait'">已下单</div>
            <div class="order_food_status order_food_status_cooking" v-if="orderFood.status === 'Cooking'">正在做</div>
            <div class="order_food_status order_food_status_cooked" v-if="orderFood.status === 'Cooked'">做好了</div>
            <div class="order_food_status order_food_status_finish" v-if="orderFood.status === 'Finish'">已上菜</div>
          </div>
          <div class="order_food_count">{{orderFood.count}}</div>
          <div class="order_food_price">{{orderFood.count * orderFood.foodPrice}}</div>
        </div>

        <div class="order_tableware">
          <div class="order_tableware_icon">餐位费</div>
          <div class="order_tableware_label">餐具</div>
          <div class="order_tableware_count">{{http.res.order.people}}</div>
          <div class="order_tableware_price">{{http.res.order.priceTableware}}</div>
        </div>

        <div class="order_tableware" v-if="http.res.order.priceTakeoutFee > 0">
          <div class="order_tableware_icon">配送费</div>
          <div class="order_tableware_label">外卖配送</div>
          <div class="order_tableware_price">{{http.res.order.priceTakeoutFee}}</div>
        </div>

        <div @click="btnChooseCoupon()" v-if="http.res.order.status === 'NotPaid'">
          <div class="order_coupon" v-if="http.res.order.couponDeductPrice > 0">
            <div class="order_coupon_icon">优惠券</div>
            <div class="order_coupon_label">优惠</div>
            <div class="order_coupon_content">{{http.res.order.couponDeductPrice}}</div>
          </div>
          <div class="order_coupon" v-else-if="http.res.coupon.valid.length > 0">
            <div class="order_coupon_icon">优惠券</div>
            <div class="order_coupon_label">优惠</div>
            <div class="order_coupon_count">{{http.res.coupon.valid.length}}张优惠券可用</div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="order_price">
          <div class="order_price_food_count">共计 {{getTotalFood()}} 份</div>
          <div class="order_price_total">{{http.res.order.price}}</div>
          <div class="order_price_total_original" v-if="http.res.order.price !== http.res.order.priceOriginal">{{http.res.order.priceOriginal}}</div>
          <div class="order_price_total_label">小计</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">人数</div>
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

            <div class="blank_10"></div>
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
          <div class="box_divide"></div>
          <div class="addition_item_label">支付方式</div>
          <div class="addition_item_content">{{
            http.res.order.payMethod === 'Wechat' ? '微信支付' :
            http.res.order.payMethod === 'Alipay' ? '支付宝支付' :
            http.res.order.payMethod === 'Offline' ? '线下结算' :
            http.res.order.payMethod === 'Cancel' ? '取消支付' : http.res.order.payMethod
            }}
          </div>
        </div>

        <div v-if="http.res.order.payPaidAt">
          <div class="box_divide"></div>
          <div class="addition_item">
            <div class="addition_item_label">支付时间</div>
            <div class="addition_item_content">{{dateFormat(new Date(parseInt(http.res.order.payPaidAt)))}}</div>
          </div>
        </div>

        <div v-if="http.res.order.remarks && http.res.order.remarks.length > 0">
          <div class="box_divide"></div>

          <div class="order_taste_note">
            <div class="order_taste_note_label">备注</div>
          </div>

          <div class="order_taste_note_history">
            <div class="order_taste_note_history_item" v-for="remark in http.res.order.remarks">
              <div class="order_taste_note_history_icon_ball"></div>
              <div class="order_taste_note_history_icon_line"></div>
              <div class="order_taste_note_history_content">{{remark}}</div>
            </div>
          </div>

          <div class="blank_10"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnWall(http.res.order)" v-if="http.res.order.status === 'Finish'">
          <div class="box_divide"></div>
          <div class="addition_item_label">留言墙</div>
          <div class="addition_item_link">{{ http.res.order.wallId ? '已留言' : '未留言' }}</div>
        </div>
      </div>
    </div>

    <div class="button_box" v-if="http.res.order.status === 'NotPaid'">
      <div v-if="http.res.order.type === 'ForHere'">
        <div class="button_small" @click="btnFood">加餐</div>
        <div class="button_small" @click="btnPay">立即支付</div>
      </div>
      <div v-else class="button_big" @click="btnPay">立即支付</div>
      <div v-else>
        <div class="button_big" @click="btnFood" v-if="http.res.order.type === 'ForHere'">加餐</div>
      </div>
      <div class="button_big" @click="btnCancel" v-if="http.res.order.type === 'Takeout'">取消订单</div>
    </div>
    <div class="button_box" v-else-if="http.res.order.status === 'Paid'">
      <div class="button_big" @click="btnFood" v-if="http.res.order.type === 'ForHere'">加餐</div>
    </div>
    <div v-else class="blank_30"></div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vCancel">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" data-src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">取消订单</div>

        <div class="blank_20"></div>

        <div class="choose_box">
          <div class="choose_remark">
            <div class="choose_remark_label">取消原因</div>

            <div class="blank_20"></div>

            <div class="choose_remark_text_area">
              <label>
                <textarea class="choose_remark_text_input" placeholder="请在此备注取消订单的原因。" v-model="http.req.cancel.remark"></textarea>
              </label>
            </div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" v-if="http.req.cancel.remark" @click="btnCancelConfirm">确认</div>
          <div class="button_big button_gray" v-else>确认</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import {httpCouponApi} from '../../../../../api/http/lt/httpCouponApi'
  import {userApi} from '../../../../../api/local/userApi'
  import {wechatApi} from '../../../../../api/local/wechatApi'
  import {alipayApi} from '../../../../../api/local/alipayApi'
  import {timeApi} from '../../../../../api/local/timeApi'
  import {scrollApi} from '../../../../../api/local/scrollApi'

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
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            cancel: {
              remark: null
            }
          },
          res: {
            order: {
              createdAt: new Date().getTime()
            },
            coupon: {
              valid: []
            },
            config: {},
            coupons: [],
          }
        },
        ui: {
          vCoverMask: false,
          vCancel: false
        }
      }
    },
    mounted() {
      this.httpOrder()
      this.httpConfig()
      this.httpCouponFetch()
    },
    methods: {
      httpCouponFetch() {
        httpCouponApi.getFetch(this.$route.params.shortId).then(res => {
          this.http.res.coupons = res
        })
      },
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res
          this.httpCoupon()
        })
      },

      httpConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.res.config = res
        })
      },
      httpCoupon() {
        httpCouponApi.getAll(this.$route.params.shortId, 0, 99).then(res => {
          if (res.currentPageSize === 0) {
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
        this.$router.push(`/c/${this.$route.params.shortId}/food`)
      },
      btnWall(order) {
        if (!Boolean(order.wallId)) {
          this.$router.push({
            path: `/c/${this.$route.params.shortId}/wall/create`,
            query: {
              orderOneId: order.id
            }
          })
        } else {
          this.$router.push(`/c/${this.$route.params.shortId}/wall/${order.wallId}`)
        }
      },
      btnChooseCoupon() {
        this.$router.push({
          path: `/c/${this.$route.params.shortId}/coupon/choose`,
          query: {
            orderOneId: this.$route.params.orderOneId,
            price: this.http.res.order.price + this.http.res.order.couponDeductPrice
          }
        })
      },
      btnPay() {
        if (!Boolean(this.http.res.config.openWechat) && !Boolean(this.http.res.config.openAlipay)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '店铺尚未开通在线支付，请您线下付款。'
          })

          return
        }

        this.$router.push({
          path: `/pay`,
          query: {
            type: 'order',
            shortId: this.$route.params.shortId,
            orderOneId: this.$route.params.orderOneId,
            price: this.http.res.order.price
          }
        })
      },
      btnCoverMask() {
        this.ui.vCancel = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)
      },
      btnCancel() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vCancel = true
      },
      btnCancelConfirm() {
        httpOrderApi.putCancel(this.$route.params.shortId, this.$route.params.orderOneId, this.http.req.cancel.remark).then(res => {
          this.ui.vCancel = false
          this.ui.vCoverMask = false
          scrollApi.enable(true)

          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消订单',
              content: '订单不存在。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消订单',
              content: '订单已关闭。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.paid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消订单',
              content: '订单已支付。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.notTakeout) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消订单',
              content: '仅允许取消外卖订单。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消订单',
              content: '订单已取消。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      },
      getLittleCoupon() {
        let price

        for (let index in this.http.res.coupons) {
          let coupon = this.http.res.coupons[index]

          if (!price || coupon.chargePrice < price) {
            return coupon
          }
        }

        return null
      },
      btnCouponFetch() {
        this.$router.push({
          path: `/c/${this.$route.params.shortId}/coupon/fetch`,
          query: {
            r: `/c/${this.$route.params.shortId}/order/${this.$route.params.orderOneId}`
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
  @import "~assets/c/coupon";
</style>
