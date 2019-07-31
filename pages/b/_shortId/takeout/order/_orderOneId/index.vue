<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

    <div class="box" v-if="http.res.order.orderTakeout">
      <div class="list_title box_radius_header">
        <div class="list_title_label">配送详情</div>
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

        <div class="order_coupon" v-if="http.res.order.couponDeductPrice || $route.query.deductPrice">
          <div class="order_coupon_icon">优惠券</div>
          <div class="order_coupon_label">优惠</div>
          <div class="order_coupon_content">{{http.res.order.couponDeductPrice ? http.res.order.couponDeductPrice : $route.query.deductPrice}}</div>
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
        </div>

        <div v-if="http.res.order.tasteNotes && http.res.order.tasteNotes.length > 0 ||
          http.res.order.remarks && http.res.order.remarks.length > 0" class="blank_10">
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
      </div>
    </div>

    <div class="button_box" v-if="http.res.order.status === 'NotPaid' || http.res.order.status === 'Paid'">
      <div class="button_big" @click="btnReply">回复订单</div>
    </div>
    <div class="blank_30" v-else></div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vReply">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">回复订单</div>

        <div class="blank_20"></div>

        <div class="choose_box">
          <div class="choose_remark">
            <div class="choose_remark_label">选择订单状态</div>

            <div class="blank_30"></div>

            <div class="choose_remark_one" v-for="orderType in ui.orderType">
              <div class="choose_remark_name" v-if="ui.selectOrderType !== orderType.status" @click="btnChooseStatus(orderType.status)">{{orderType.label}}</div>
              <div class="choose_remark_name_select" v-else>{{orderType.label}}</div>
            </div>

            <div v-if="ui.smsSendEnable">
              <div class="tip" v-if="ui.selectOrderType === 'TakeoutAccept'">
                <ul class="tip_ul">
                  <li>{{getSmsTypeLabel('TakeoutAccept')}}</li>
                </ul>
              </div>
              <div class="tip" v-else-if="ui.selectOrderType === 'TakeoutCancel'">
                <ul class="tip_ul">
                  <li>{{getSmsTypeLabel('TakeoutCancel')}}</li>
                </ul>
              </div>
              <div class="tip" v-else-if="ui.selectOrderType === 'TakeoutDeliver'">
                <ul class="tip_ul">
                  <li>{{getSmsTypeLabel('TakeoutSuccess')}}</li>
                </ul>
              </div>
            </div>

            <div v-if="ui.selectOrderType !== 'TakeoutAccept'">
              <div class="addition_item">
                <div class="addition_item_label">发送短信</div>
                <div class="addition_item_check">
                  <div class="addition_item_check_on" v-if="ui.smsSendEnable"
                       @click="btnSmsSendEnable(false)"></div>
                  <div class="addition_item_check_off" v-else @click="btnSmsSendEnable(true)"></div>
                </div>
              </div>
            </div>

            <div class="choose_remark_text_area" v-if="ui.selectOrderType !== 'TakeoutAccept'">
              <div class="blank_20"></div>
              <label>
                <textarea class="choose_remark_text_input" :placeholder="ui.selectOrderType === 'TakeoutDeliver' ? '请输入您的订单备注' : '请输入您取消订单的原因'" v-model="ui.orderRemark"></textarea>
              </label>
            </div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnReplyConfirm" v-if="ui.selectOrderType === 'TakeoutAccept' || ui.selectOrderType === 'TakeoutDeliver'">确认</div>
          <div class="button_big button_gray" v-else-if="!ui.orderRemark">确认</div>
          <div class="button_big" @click="btnReplyConfirm" v-else>确认</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpOrderApi} from '../../../../../../api/http/lt/httpOrderApi'
  import {scrollApi} from '../../../../../../api/local/scrollApi'
  import {httpOrderAdminApi} from '../../../../../../api/http/lt/httpOrderAdminApi'
  import {highlightApi} from '../../../../../../api/local/highlightApi'
  import {httpShopApi} from '../../../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../../../api/http/lt/httpInfoApi'
  import {httpSmsAdminApi} from '../../../../../../api/http/lt/httpSmsAdminApi'
  import {timeApi} from '../../../../../../api/local/timeApi'

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
          backUri: `/b/${this.$route.params.shortId}/takeout`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            shop: {},
            info: {},
            order: {
              orderTakeout: {},
              createdAt: new Date().getTime()
            }
          }
        },
        ui: {
          vReply: false,
          vCoverMask: false,
          orderType: [
            {status: 'TakeoutAccept', label: '回复接单短信'},
            {status: 'TakeoutDeliver', label: '派送完成'},
            {status: 'TakeoutCancel', label: '取消订单'},
          ],
          selectOrderType: 'TakeoutAccept',
          smsSendEnable: true,
          orderRemark: ''
        }
      }
    },
    mounted() {
      this.httpShop()
      this.httpInfo()
      this.httpOrder()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpInfo() {
        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.http.res.info = res
        })
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res

          if (res.status === 'Paid' || res.status === 'Finish') {
            this.ui.orderType.push({status: 'Refund', label: '取消订单并退款'})
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
      getSmsTypeLabel(status) {
        let name = this.http.res.order.orderTakeout.name || '匿名用户'
        let shop = this.http.res.shop.name || '恋厅'
        let phone = this.http.res.info.phone || ''
        let reason = this.ui.orderRemark || '未在线说明'

        if (status === 'TakeoutAccept') {
          return `尊敬的${name}，您在${shop}的外卖订单已确认。我们将尽快送达到您的手中，请保持电话畅通。商家电话：${phone}`
        } else if (status === 'TakeoutCancel') {
          return `尊敬的${name}，您在${shop}的外卖订单暂时无法受理。原因：${reason}。商家电话：${phone}。`
        } else if (status === 'TakeoutSuccess') {
          return `尊敬的${name}，您在${shop}的外卖已由骑手为您派送，请留意接听。如未收到请联系商家电话：${phone}。`
        }
      },
      btnCoverMask() {
        this.ui.vReply = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)
      },
      btnChooseStatus(status) {
        this.ui.selectOrderType = status
      },
      btnReply() {
        if (this.http.res.order.status === 'NotPaid') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '订单提示',
            content: `该订单${highlightApi.highlight('尚未支付完成')}，如您要继续派送，请务必确认顾客已线下付款。`
          }).then(async (val) => {
            this.ui.vCoverMask = true
            scrollApi.enable(false)

            this.ui.vReply = true
          })
        } else {
          this.ui.vCoverMask = true
          scrollApi.enable(false)

          this.ui.vReply = true
        }
      },
      btnSmsSendEnable(enable) {
        this.ui.smsSendEnable = enable
      },
      replyConfirm() {
        if (this.ui.selectOrderType === 'TakeoutCancel') {
          httpOrderAdminApi.putCancel(this.$route.params.shortId, this.$route.params.orderOneId, this.ui.orderRemark).then(res => {
            this.httpOrder()

            if (res.orderOneIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '取消订单',
                content: '订单不存在。'
              })
            } else if (res.closed) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '取消订单',
                content: '订单已关闭。'
              })
            } else if (res.success) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '取消订单',
                content: '订单已取消。'
              })
            }
          })
        } else if (this.ui.selectOrderType === 'TakeoutDeliver') {
          httpOrderAdminApi.putPayOffline(this.$route.params.shortId, this.$route.params.orderOneId, this.ui.orderRemark).then(res => {
            this.httpOrder()

            if (res.orderOneIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '派送订单',
                content: '订单不存在。'
              })
            } else if (res.closed) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '派送订单',
                content: '订单已关闭。'
              })
            } else if (res.success) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '派送订单',
                content: '订单已完成。'
              })
            }
          })
        }
      },
      btnReplyConfirm() {
        this.ui.vReply = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)

        if (this.ui.smsSendEnable) {
          if (!Boolean(this.http.res.info.phone)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '发送短信',
              content: '没有设置商家电话，请先在资料页设置。'
            })

            return
          }

          let reason

          if (this.ui.selectOrderType === 'TakeoutCancel') {
            reason = this.ui.orderRemark
          }

          httpSmsAdminApi.postSendTakeout(this.$route.params.shortId, this.ui.selectOrderType, reason, this.$route.params.orderOneId).then(res => {
            if (res.orderOneIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '发送短信',
                content: '订单号不存在。'
              })
            } else if (res.notTakeout) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '发送短信',
                content: '非外卖订单。'
              })
            } else if (res.noShopPhone) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '发送短信',
                content: '没有设置商家电话，请先在资料页设置。'
              })
            } else if (res.noLeft) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '发送短信',
                content: '没有可剩余的短信数目，请续费短信包后使用。'
              })
            } else if (res.success) {
              this.replyConfirm()
            }
          })
        } else {
          this.replyConfirm()
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
</style>
