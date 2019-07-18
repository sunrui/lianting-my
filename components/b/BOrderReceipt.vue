<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

    <div class="box" v-if="ui.receipt.orderFirst.orderTable">
      <div class="order_table box_radius">
        <div class="order_table_number">{{ui.receipt.orderFirst.orderTable.tableFullNumber}}</div>
        <div class="order_table_name">{{ui.receipt.orderFirst.orderTable.tableGroupName}}</div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date(parseInt(ui.receipt.orderFirst.createdAt)))}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>
    </div>

    <div class="box" v-for="(orderFood, index) in ui.receipt.orderFoods">
      <div class="order_content" v-bind:class="{
      box_radius_footer: index === 0,
      box_radius: index !== 0
      }">
        <div class="order_food">
          <img class="order_food_image" :src="orderFood.foodCategoryImage" :alt="orderFood.foodCategoryName">
          <div class="order_food_name_detail">
            <div class="order_food_name_detail_name">{{orderFood.foodCategoryName}}</div>
            <div class="order_food_name_detail_name_category">{{orderFood.foodName}}</div>
          </div>
          <div class="order_food_count order_food_count_2">{{orderFood.count}}</div>
          <div class="order_food_price order_food_price_2">{{orderFood.count * orderFood.foodPrice}}</div>
          <div class="order_food_button button_gray" v-if="orderFood.status === 'Cancel'">已取消</div>
          <div class="order_food_button order_food_button_return" v-else-if="roleType === 'admin'" @click="btnFoodReturn(orderFood)">退菜</div>
          <div class="order_food_button order_food_button_return" v-else-if="roleType === 'retailer' && orderFood.status !== 'Finish'"
               @click="btnChangeStatus(orderFood, 'Finish')">传菜
          </div>
          <div v-else>
            <div class="order_food_button order_food_button_finish" v-if="orderFood.status === 'Cooked'" @click="btnChangeStatus(orderFood, 'Finish')">传菜</div>
            <div class="order_food_button order_food_button_cooking" v-if="orderFood.status === 'Wait'" @click="btnChangeStatus(orderFood, 'Cooking')">开始做</div>
            <div class="order_food_button order_food_button_cooked" v-if="orderFood.status === 'Cooking'" @click="btnChangeStatus(orderFood, 'Cooked')">做好了</div>
          </div>
        </div>

        <div class="order_operator">
          <div class="order_operator_one" @click="btnStatusReset(orderFood, 'Wait')">
            <div class="order_operator_status">
              <div class="order_operator_line_right" v-bind:class="{order_food_button_cooking: orderFood.status === 'Wait'}"></div>
              <div class="order_operator_ball">
                <div class="order_operator_ball_dot"></div>
              </div>
            </div>
            <div class="blank_30"></div>
            <div class="order_operator_label" v-bind:class="{order_operator_label_wait: orderFood.status === 'Wait'}">下单</div>
            <div class="order_operator_label_time" v-bind:class="{order_operator_label_wait: orderFood.status === 'Wait'}">{{getTime(orderFood.createdAt)}}</div>
          </div>
          <div class="order_operator_one" @click="btnStatusReset(orderFood, 'Cooking')">
            <div class="order_operator_status">
              <div class="order_operator_line_left" v-bind:class="{order_food_button_cooking: orderFood.status === 'Wait'}"></div>
              <div class="order_operator_line_right" v-bind:class="{order_food_button_cooked: orderFood.status === 'Cooking'}"></div>
              <div class="order_operator_ball" v-bind:class="{order_operator_ball_cooking: orderFood.status === 'Wait'}">
                <div class="order_operator_ball_dot" v-bind:class="{order_operator_ball_dot_cooking: orderFood.status === 'Wait'}"></div>
              </div>
            </div>
            <div class="blank_30"></div>
            <div class="order_operator_label" v-bind:class="{order_operator_label_cooking: orderFood.status === 'Cooking'}">开始做</div>
            <div class="order_operator_label_time" v-bind:class="{order_operator_label_cooking: orderFood.status === 'Cooking'}">{{getTime(orderFood.cookingAt)}}</div>
          </div>
          <div class="order_operator_one" @click="btnStatusReset(orderFood, 'Cooked')">
            <div class="order_operator_status">
              <div class="order_operator_line_left" v-bind:class="{order_food_button_cooked: orderFood.status === 'Cooking'}"></div>
              <div class="order_operator_line_right" v-bind:class="{order_food_button_finish: orderFood.status === 'Cooked'}"></div>
              <div class="order_operator_ball" v-bind:class="{order_operator_ball_cooked: orderFood.status === 'Cooking'}">
                <div class="order_operator_ball_dot" v-bind:class="{order_operator_ball_dot_cooked: orderFood.status === 'Cooking'}"></div>
              </div>
            </div>
            <div class="blank_30"></div>
            <div class="order_operator_label" v-bind:class="{order_operator_label_cooked: orderFood.status === 'Cooked'}">做好了</div>
            <div class="order_operator_label_time" v-bind:class="{order_operator_label_cooked: orderFood.status === 'Cooked'}">{{getTime(orderFood.cookedAt)}}</div>
          </div>
          <div class="order_operator_one" @click="btnStatusReset(orderFood, 'Finish')">
            <div class="order_operator_status">
              <div class="order_operator_line_left" v-bind:class="{order_food_button_finish: orderFood.status === 'Cooked'}"></div>
              <div class="order_operator_ball"
                   v-bind:class="{order_operator_ball_finish: orderFood.status === 'Cooked', order_operator_ball_wait: orderFood.status === 'Finish'}">
                <div class="order_operator_ball_dot"
                     v-bind:class="{order_operator_ball_dot_finish: orderFood.status === 'Cooked', order_operator_ball_wait: orderFood.status === 'Finish'}"></div>
              </div>
            </div>
            <div class="blank_30"></div>
            <div class="order_operator_label" v-bind:class="{order_operator_label_finish: orderFood.status === 'Finish'}">传菜</div>
            <div class="order_operator_label_time" v-bind:class="{order_operator_label_finish: orderFood.status === 'Finish'}">{{getTime(orderFood.finishAt)}}</div>
          </div>
        </div>
      </div>
      <div class="blank_20"></div>
    </div>

    <div class="box">
      <div class="order_content box_radius">
        <div class="order_tableware">
          <div class="order_tableware_icon">餐位费</div>
          <div class="order_tableware_label">餐具</div>
          <div class="order_tableware_count">{{ui.receipt.orderFirst.people}}</div>
          <div class="order_tableware_price">{{getTotalPriceTableware()}}</div>
        </div>

        <div class="order_coupon" v-if="getTotalCouponDeductPrice() > 0">
          <div class="order_coupon_icon">优惠券</div>
          <div class="order_coupon_label">优惠</div>
          <div class="order_coupon_content">{{getTotalCouponDeductPrice()}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="order_price">
          <div class="order_price_food_count">共计 {{getTotalFood()}} 份</div>
          <div class="order_price_total">{{getTotalPrice()}}</div>
          <div class="order_price_total_original" v-if="getTotalPrice() !== getTotalPriceOriginal()">{{getTotalPriceOriginal()}}</div>
          <div class="order_price_total_label">小计</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnPeople">
          <div class="addition_item_label">人数</div>
          <div class="addition_item_content">{{ui.receipt.orderFirst.people}} 人</div>
        </div>

        <div v-if="ui.receipt.tasteNotes && ui.receipt.tasteNotes.length > 0">
          <div class="box_divide"></div>

          <div class="order_taste_note">
            <div class="order_taste_note_label">口味</div>
          </div>

          <div class="order_taste_note_history">
            <div class="order_taste_note_history_item" v-for="taskNote in ui.receipt.tasteNotes">
              <div class="order_taste_note_history_icon_ball"></div>
              <div class="order_taste_note_history_icon_line"></div>
              <div class="order_taste_note_history_content">{{taskNote}}</div>
            </div>
          </div>

          <div class="blank_10"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnOrderStatus">
          <div class="addition_item_label">订单状态</div>
          <div class="addition_item_content">{{
            ui.receipt.orderFirst.status === 'Paid' ? '已支付' :
            ui.receipt.orderFirst.status === 'NotPaid' ? '待支付' :
            ui.receipt.orderFirst.status === 'Finish' ? '已完成' :
            ui.receipt.orderFirst.status === 'Closed' ? '已关闭' : ui.receipt.orderFirst.status
            }}
          </div>
        </div>

        <div class="addition_item" v-if="ui.receipt.orderFirst.payMethod">
          <div class="box_divide"></div>

          <div class="addition_item_label">支付方式</div>
          <div class="addition_item_content">{{
            ui.receipt.orderFirst.payMethod === 'Wechat' ? '微信支付' :
            ui.receipt.orderFirst.payMethod === 'Alipay' ? '支付宝支付' :
            ui.receipt.orderFirst.payMethod === 'Offline' ? '线下结算' :
            ui.receipt.orderFirst.payMethod === 'Cancel' ? '取消支付' : ui.receipt.orderFirst.payMethod
            }}
          </div>
        </div>

        <div v-if="ui.receipt.orderFirst.payPaidAt">
          <div class="box_divide"></div>
          <div class="addition_item">
            <div class="addition_item_label">支付时间</div>
            <div class="addition_item_content">{{dateFormat(new Date(parseInt(ui.receipt.orderFirst.payPaidAt)))}}</div>
          </div>
        </div>

        <div v-if="ui.receipt.remarks && ui.receipt.remarks.length > 0">
          <div class="box_divide"></div>

          <div class="order_taste_note">
            <div class="order_taste_note_label">备注</div>
          </div>

          <div class="order_taste_note_history">
            <div class="order_taste_note_history_item" v-for="remark in ui.receipt.remarks">
              <div class="order_taste_note_history_icon_ball"></div>
              <div class="order_taste_note_history_icon_line"></div>
              <div class="order_taste_note_history_content">{{remark}}</div>
            </div>
          </div>

          <div class="blank_10"></div>
        </div>
      </div>
    </div>

    <div class="blank_30" v-if="ui.receipt.orderFirst.status === 'Finish' || ui.receipt.orderFirst.status === 'Closed'"></div>
    <div class="button_box" v-else-if="ui.receipt.orderFirst.status === 'NotPaid' && roleType !== 'admin' && roleType !== 'retailer'">
      <div class="button_small" @click="btnPayOffline" v-if="roleType === 'cashier'">线下结算</div>
    </div>
    <div class="button_box" v-else-if="roleType === 'admin' || roleType === 'retailer'">
      <div class="button_big" v-if="ui.receipt.orderFirst.status !== 'Paid'" @click="btnPayOffline">线下结算</div>
      <div class="button_big" @click="btnCancel">取消订单</div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vPeople">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">请选择人数</div>

        <div class="people_box">
          <div class="people_one" v-for="one in ui.peopleChoose">
            <div class="people_one_name_select" v-if="one === ui.selectPeople">{{one}}</div>
            <div class="people_one_name" v-if="one !== ui.selectPeople" @click="btnPeopleChoose(one)">{{one}}</div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" v-if="ui.selectPeople" @click="btnPeopleConfirm">选好了</div>
          <div class="button_big button_gray" v-else>选好了</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vCancel">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
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

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vPayOffline">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">线下结算</div>

        <div class="blank_20"></div>

        <div class="choose_box">
          <div class="choose_remark">
            <div class="choose_remark_label">支付方式</div>

            <div class="blank_30"></div>

            <div class="choose_remark_one" v-for="remark in ui.offlinePayRemarks">
              <div class="choose_remark_name" v-if="http.req.payOffline.remark !== remark" @click="btnChooseOfflinePayRemark(remark)">{{remark}}</div>
              <div class="choose_remark_name_select" v-else>{{remark}}</div>
            </div>

            <div class="blank_20"></div>

            <div class="choose_remark_text_area">
              <label>
                <textarea class="choose_remark_text_input" placeholder="请在此备注线下结算方式。" v-model="http.req.payOffline.remark"></textarea>
              </label>
            </div>
          </div>
        </div>

        <div class="addition_item">
          <div class="addition_item_label">打印顾客收据</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.printReceipt" @click="btnPrintReceipt(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrintReceipt(true)"></div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" v-if="http.req.payOffline.remark" @click="btnPayOfflineConfirm">确认</div>
          <div class="button_big button_gray" v-else>确认</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vReturn">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">退菜</div>

        <div class="blank_20"></div>

        <div class="choose_box">
          <div class="return_food">
            <div class="return_food_category_name">{{ui.selectOrderFood.foodCategoryName}}</div>
            <div class="return_food_name">({{ui.selectOrderFood.foodName}})</div>
            <div class="return_food_count">{{ui.selectOrderFood.count}} 份</div>
          </div>

          <div class="blank_20"></div>
          <div class="box_divide"></div>
          <div class="blank_20"></div>

          <div class="return_count">
            <div class="return_count_label">退菜份数</div>
            <div class="return_count_option">
              <drop-down :options="ui.returnCounts"
                         :selected="ui.returnCounts[0]"
                         v-on:updateOption="btnChooseReturnCount">
              </drop-down>
            </div>
          </div>

          <div class="blank_20"></div>
          <div class="box_divide"></div>
          <div class="blank_20"></div>

          <div class="choose_remark">
            <div class="choose_remark_label">退菜原因</div>

            <div class="blank_30"></div>

            <div class="choose_remark_one" v-for="remark in ui.returnRemarks">
              <div class="choose_remark_name" v-if="http.req.return.remark !== remark" @click="btnChooseReturnRemark(remark)">{{remark}}</div>
              <div class="choose_remark_name_select" v-else>{{remark}}</div>
            </div>

            <div class="blank_20"></div>

            <div class="choose_remark_text_area">
              <label>
                <textarea class="choose_remark_text_input" placeholder="请在此备注退菜的原因。" v-model="http.req.return.remark"></textarea>
              </label>
            </div>
          </div>

          <div class="modal_button_box">
            <div class="button_big" v-if="http.req.return.remark" @click="btnFoodReturnConfirm">确认</div>
            <div class="button_big button_gray" v-else>确认</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {httpOrderAdminApi} from '../../api/http/lt/httpOrderAdminApi'
  import {scrollApi} from '../../api/local/scrollApi'
  import {timeApi} from '../../api/local/timeApi'
  import DropDown from '../common/DropDown'
  import CurrencyInput from '../common/CurrencyInput'
  import {highlightApi} from '../../api/local/highlightApi'
  import {roleApi} from '../../api/local/roleApi'
  import {httpPrinterAdminApi} from '../../api/http/lt/httpPrinterAdminApi'

  export default {
    metaInfo: {
      title: '订单详情'
    },
    middleware: 'auth',
    components: {CurrencyInput, TitleBar, DropDown},
    props: {
      roleType: {
        type: String,
        default: 'waiter'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '订单详情',
          backUri: `/b/${this.$route.params.shortId}/${this.roleType}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            payOffline: {
              remark: ''
            },
            cancel: {
              remark: ''
            },
            return: {
              orderFoodId: '',
              count: 1,
              remark: ''
            },
            changePrice: {
              price: 0,
              remark: ''
            }
          },
          res: {
            printerStatus: {},
            orderOnes: {}
          }
        },
        ui: {
          receipt: {
            orderFirst: {
              createdAt: new Date().getTime()
            },
            orderFoods: [],
            tasteNotes: [],
            remarks: []
          },
          remarks: [],
          vPeople: false,
          vCoverMask: false,
          vPayOffline: false,
          vReturn: false,
          selectPeople: null,
          selectOrderFood: {},
          peopleChoose: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          vCancel: false,
          returnRemarks: [
            '不想要了', '点错菜', '点重菜'
          ],
          returnCounts: [],
          offlinePayRemarks: [
            '现金收银', '微信转账', '支付宝转账'
          ],
          printReceipt: false
        }
      }
    },
    mounted() {
      this.title.title = '订单详情 - ' + roleApi.getRoleTypeName(this.roleType)

      this.httpOrder()
      this.httpPrinterStatus()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      btnChooseReturnCount(payload) {
        this.http.req.return.count = payload.name
      },
      httpPrinterStatus() {
        httpPrinterAdminApi.getStatus(this.$route.params.shortId).then(res => {
          this.http.res.printerStatus = res
          this.ui.printReceipt = res.printerOnline > 0 && res.printerReceiptOk > 0
        })
      },
      httpOrder() {
        httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, this.$route.query.tableOneId, true, 0, 20).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order`)
            return
          }

          this.ui.receipt.orderFirst = res.elements[0]
          this.ui.selectPeople = res.elements[0].people

          let priceTableware = null
          let orderOneId = null

          for (let orderOneIndex in res.elements) {
            let orderOne = res.elements[orderOneIndex]
            if (orderOne.priceTableware > 0) {
              if (priceTableware === null) {
                priceTableware = orderOne.priceTableware
                orderOneId = orderOne.id

                continue
              }

              this.$msgBox.doModal({
                type: 'yesOrNo',
                title: '多个餐具费',
                content: '多个订单存在餐具费，您需要将其它订单的餐具费更为零吗?'
              }).then(async (val) => {
                if (val !== 'Yes') {
                  return
                }

                for (let orderOneIndex in res.elements) {
                  let orderOne = res.elements[orderOneIndex]

                  if (orderOne.priceTableware === 0) {
                    continue
                  }

                  if (orderOne.id === orderOneId) {
                    continue
                  }

                  let changePrice = {
                    price: 0,
                    remark: '免餐具费: ' + orderOne.priceTableware
                  }

                  httpOrderAdminApi.putPriceTableware(this.$route.params.shortId, orderOne.id, changePrice).then(res => {
                    if (res.orderOneIdNotExists) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '更改价格',
                        content: '订单不存在。'
                      })
                    } else if (res.paid) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '更改价格',
                        content: '已支付，无法更改价格。'
                      })
                    } else if (res.closed) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '更改价格',
                        content: '订单已关闭。'
                      })
                    } else if (res.success) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '更改价格',
                        content: '已更改价格。'
                      }).then(async (val) => {
                        this.httpOrder()
                      })
                    }
                  })
                }
              })
            }
          }

          this.http.res.orderOnes = res

          let _orderFoods = []

          this.ui.receipt.tasteNotes = []
          this.ui.receipt.remarks = []

          for (let orderOneIndex in res.elements) {
            let orderOne = res.elements[orderOneIndex]

            if (orderOne.tasteNotes && orderOne.tasteNotes.length > 0) {
              this.ui.receipt.tasteNotes = this.ui.receipt.tasteNotes.concat(orderOne.tasteNotes)
            }

            if (orderOne.remarks && orderOne.remarks.length > 0) {
              this.ui.receipt.remarks = this.ui.receipt.remarks.concat(orderOne.remarks)
            }

            for (let index in orderOne.orderFoods) {
              let orderFood = orderOne.orderFoods[index]
              _orderFoods.push(orderFood)
            }
          }

          let orderFoods = []

          function addFood(orderFood) {
            let have = false
            for (let i in orderFoods) {
              let one = orderFoods[i]

              if (one.id === orderFood.id) {
                have = true
                break
              }
            }

            if (!have) {
              orderFoods.push(orderFood)
            }
          }

          for (let index in _orderFoods) {
            let orderFood = _orderFoods[index]

            if (orderFood.status === 'Cooked') {
              addFood(orderFood)
            }
          }

          for (let index in _orderFoods) {
            let orderFood = _orderFoods[index]

            if (orderFood.status === 'Cooking') {
              addFood(orderFood)
            }
          }

          for (let index in _orderFoods) {
            let orderFood = _orderFoods[index]

            if (orderFood.status === 'Wait') {
              addFood(orderFood)
            }
          }

          for (let index in _orderFoods) {
            let orderFood = _orderFoods[index]

            if (orderFood.status === 'Finish') {
              addFood(orderFood)
            }
          }

          for (let index in _orderFoods) {
            let orderFood = _orderFoods[index]
            addFood(orderFood)
          }

          this.ui.receipt.orderFoods = orderFoods
        })
      },
      getOrderOneIdByOrderFoodId(orderFoodId) {
        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          for (let orderFoodIndex in orderOne.orderFoods) {
            let orderFood = orderOne.orderFoods[orderFoodIndex]

            if (orderFood.id === orderFoodId) {
              return orderOne.id
            }
          }
        }

        return null
      },
      getTotalFood() {
        let count = 0

        for (let index in this.ui.receipt.orderFoods) {
          let orderFood = this.ui.receipt.orderFoods[index]
          count += orderFood.count
        }

        return count
      },
      getTotalPriceOriginal() {
        let priceOriginal = 0

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          priceOriginal += orderOne.priceOriginal
        }

        return priceOriginal
      },
      getTotalPrice() {
        let price = 0

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          price += orderOne.price
        }

        return price
      },
      getTotalPriceTableware() {
        let priceTableware = 0

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          priceTableware += orderOne.priceTableware
        }

        return priceTableware
      },
      getTotalCouponDeductPrice() {
        let couponDeductPrice = 0

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          couponDeductPrice += orderOne.couponDeductPrice
        }

        return couponDeductPrice
      },
      getStatusLabel(status) {
        switch (status) {
          case 'Wait':
            return '下单'
          case 'Cooking':
            return '开始做'
          case 'Cooked':
            return '做好了'
          case 'Finish':
            return '传菜'
        }
      },
      btnChangeStatus(orderFood, status) {
        if (orderFood.status === status) {
          return
        }

        if (status === 'Cooking' || status === 'Cooked') {
          if (this.roleType !== 'admin' && this.roleType !== 'cooker') {
            this.$msgBox.doModal({
              type: 'yes',
              title: '烹饪餐食',
              content: `仅允许${highlightApi.highlight('店长')}、${highlightApi.highlight('厨师')}可以操作，您只有查看权限。`
            })

            return
          }
        }

        if (status === 'Finish') {
          if (this.roleType !== 'admin' && this.roleType !== 'waiter' && this.roleType !== 'retailer') {
            this.$msgBox.doModal({
              type: 'yes',
              title: '传菜',
              content: `仅允许${highlightApi.highlight('店长')}、${highlightApi.highlight('服务员')}、${highlightApi.highlight('零售员')}可以操作，您只有查看权限。`
            })

            return
          }
        }

        let content

        switch (status) {
          case 'Wait':
            content = `确认将${highlightApi.highlight(orderFood.foodCategoryName)}的状态重置为${highlightApi.highlight(this.getStatusLabel(status))}吗？`
            break
          case 'Cooking':
            content = `即将为${highlightApi.highlight(orderFood.foodCategoryName)}烹饪计时，确定${highlightApi.highlight(this.getStatusLabel(status))}吗？`
            break
          case 'Cooked':
            content = `确认${highlightApi.highlight(orderFood.foodCategoryName)}已经${highlightApi.highlight(this.getStatusLabel(status))}吗？`
            break
          case 'Finish':
            content = `确认${highlightApi.highlight(orderFood.foodCategoryName)}已为顾客${highlightApi.highlight(this.getStatusLabel(status))}？`
            break
        }

        let title = status === 'Wait' ? '状态重置' :
            status === 'Finish' ? '传菜' : '烹饪餐食'

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: title,
          content: content
        }).then(async (val) => {
          if (val === 'Yes') {
            httpOrderAdminApi.putFoodStatus(this.$route.params.shortId, this.getOrderOneIdByOrderFoodId(orderFood.id), orderFood.id, status).then(res => {
              if (res.orderOneIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '烹饪餐食',
                  content: '订单不存在。'
                })
              } else if (res.orderFoodIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '烹饪餐食',
                  content: '餐食不存在。'
                })
              } else if (res.closed) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '烹饪餐食',
                  content: '订单已关闭。'
                })
              } else if (res.success) {
                if (status === 'Cooked') {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '烹饪餐食',
                    content: '已推送服务员传菜通知。'
                  }).then(async (val) => {
                    this.httpOrder()
                  })
                } else {
                  this.httpOrder()
                }
              }
            })
          }
        })
      },
      btnCoverMask() {
        this.ui.vPeople = false
        this.ui.vCancel = false
        this.ui.vPayOffline = false
        this.ui.vReturn = false
        this.ui.vCoverMask = false

        scrollApi.enable(true)
      },
      btnPeople() {
        if (this.roleType === 'cooker') {
          return
        }

        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vPeople = true
        this.ui.selectPeople = this.ui.receipt.orderFirst.people
      },
      btnPeopleChoose(one) {
        this.ui.selectPeople = one
      },
      btnPeopleConfirm() {
        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          httpOrderAdminApi.putPeople(this.$route.params.shortId, orderOne.id, this.ui.selectPeople).then(res => {
            this.ui.vPeople = false
            this.ui.vCoverMask = false
            scrollApi.enable(true)

            if (res.orderOneIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '更改人数',
                content: '订单不存在。'
              })
            } else if (res.paid) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '更改人数',
                content: '订单已支付。'
              })
            } else if (res.closed) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '更改人数',
                content: '订单已关闭。'
              })
            } else if (res.success) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '更改人数',
                content: '人数已更改。'
              })
            }

            this.httpOrder()
          })
        }
      },
      getTime(time) {
        if (!Boolean(time)) {
          return ''
        }

        return timeApi.dateFormat(new Date(time), 'HH:mm')
      },
      btnStatusReset(orderFood, status) {
        if (this.roleType !== 'admin') {
          return
        }

        this.btnChangeStatus(orderFood, status)
      },
      btnOrderStatus() {
        if (this.roleType !== 'admin' && this.roleType !== 'cashier' && this.roleType !== 'retailer') {
          return
        }

        this.btnPayOffline()
      },
      btnPayOffline() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vPayOffline = true
      },
      btnPayOfflineConfirm() {
        let payProcess = 0

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          httpOrderAdminApi.putPayOffline(this.$route.params.shortId, orderOne.id, this.http.req.payOffline.remark).then(res => {
            this.ui.vPayOffline = false
            this.ui.vCoverMask = false
            scrollApi.enable(true)

            if (res.orderOneIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '线下结算',
                content: '订单不存在。'
              }).then(async (val) => {
                this.httpOrder()
              })
            } else if (res.closed) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '线下结算',
                content: '订单已关闭。'
              }).then(async (val) => {
                this.httpOrder()
              })
            } else if (res.success) {
              payProcess++

              if (payProcess === this.http.res.orderOnes.elements.length) {
                if (this.ui.printReceipt) {
                  let orderOneIds = []

                  for (let orderOneIndex in this.http.res.orderOnes.elements) {
                    let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

                    orderOneIds.push(orderOne.id)
                  }

                  httpPrinterAdminApi.postReceipt(this.$route.params.shortId, orderOneIds).then(res => {
                    if (res.orderIdNotExists) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '无法打印顾客收据',
                        content: '部分订单号不存在。'
                      }).then(async (val) => {
                        this.httpOrder()
                      })
                    }

                    if (res.printerTaskId) {
                      this.$msgBox.doModal({
                        type: 'yes',
                        title: '顾客收据',
                        content: '顾客收据已打印。'
                      }).then(async (val) => {
                        this.httpOrder()
                      })
                    }
                  })
                }
              } else {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '线下结算',
                  content: '线下结算已完成。'
                }).then(async (val) => {
                  this.httpOrder()
                })
              }
            }
          })
        }
      },
      btnCancel() {
        if (this.roleType !== 'admin' && this.roleType !== 'retailer') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '线下结算',
            content: '仅允许店长可以操作，您只有查看权限。。'
          })

          return
        }

        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vCancel = true
      },
      btnCancelConfirm() {
        scrollApi.enable(true)

        for (let orderOneIndex in this.http.res.orderOnes.elements) {
          let orderOne = this.http.res.orderOnes.elements[orderOneIndex]

          httpOrderAdminApi.putCancel(this.$route.params.shortId, orderOne.id, this.http.req.cancel.remark).then(res => {
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
        }
      },
      btnChooseReturnRemark(remark) {
        this.http.req.return.remark = remark
      },
      btnChooseOfflinePayRemark(remark) {
        this.http.req.payOffline.remark = remark
      },
      btnFoodReturn(orderFood) {
        this.http.req.return.count = 1
        this.ui.selectOrderFood = orderFood
        this.http.req.return.orderFoodId = orderFood.id

        this.ui.returnCounts = []
        for (let i = 0; i < orderFood.count; i++) {
          this.ui.returnCounts.push({name: i + 1})
        }

        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vReturn = true
      },
      btnFoodReturnConfirm() {
        this.ui.vReturn = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)

        httpOrderAdminApi.putReturn(this.$route.params.shortId, this.getOrderOneIdByOrderFoodId(this.http.req.return.orderFoodId), this.http.req.return).then(res => {
          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '订单不存在。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.orderFoodIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '餐食不存在。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.paid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '已支付，无法退菜。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '订单已关闭。'
            }).then(async (val) => {
              this.httpOrder()
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '已退菜完成。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      },
      btnPrintReceipt(enable) {
        if (enable) {
          if (this.http.res.printerStatus.printerOnline === 0) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '无法打印顾客收据',
              content: '没有在线的打印机。'
            })

            return
          }

          if (this.http.res.printerStatus.printerReceiptOk === 0) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '无法打印顾客收据',
              content: `有在线 ${this.http.res.printerStatus.printerOnline} 台打印机，但是没有允许打印顾客收据。`
            })

            return
          }
        }

        this.ui.printReceipt = enable
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
  @import 'BOrderOne';
</style>
