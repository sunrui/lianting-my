<template>
  <div>
    <title-bar ref="titleBar" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

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
    </div>

    <div class="box" v-for="(orderFood, index) in http.res.order.orderFoods">
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
          <div class="order_food_button order_food_button_return" v-else-if="role === 'admin'" @click="btnFoodReturn(orderFood)">退菜</div>
          <div v-else>
            <div class="order_food_button order_food_button_finish" v-if="orderFood.status === 'Cooked'" @click="btnChangeStatus(orderFood, 'Finish')">上菜</div>
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
            <div class="order_operator_label" v-bind:class="{order_operator_label_finish: orderFood.status === 'Finish'}">上菜</div>
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
          <div class="order_tableware_count">{{http.res.order.people}}</div>
          <div class="order_tableware_price">{{http.res.order.priceTableware}}</div>
        </div>

        <div class="order_coupon" v-if="http.res.order.couponDeductPrice > 0">
          <div class="order_coupon_icon">优惠券</div>
          <div class="order_coupon_label">优惠</div>
          <div class="order_coupon_content">{{http.res.order.couponDeductPrice}}</div>
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
        <div class="addition_item" @click="btnPeople">
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

    <div class="button_box" v-if="http.res.order.status === 'NotPaid'">
      <div class="button_big" @click="btnFood" v-if="role === 'waiter'">加餐</div>
      <div class="button_small" @click="btnChangePrice" v-if="role === 'cashier'">改价</div>
      <div class="button_small" @click="btnPayOffline" v-if="role === 'cashier'">线下支付</div>
      <div class="button_big" @click="btnCancel" v-if="role === 'admin'">取消订单</div>
    </div>
    <div class="blank_30" v-else></div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_people">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">请选择就餐人数</div>

        <div class="people_box">
          <div class="people_one" v-for="one in ui.peopleChoose">
            <div class="people_one_name_select" v-if="one === ui.selectPeople">{{one}}</div>
            <div class="people_one_name" v-if="one !== ui.selectPeople" @click="btnPeopleChoose(one)">{{one}}</div>
          </div>
        </div>

        <div class="blank_20"></div>

        <div class="modal_button_box">
          <div class="button_big" v-if="ui.selectPeople" @click="btnPeopleConfirm">选好了</div>
          <div class="button_big button_gray" v-else>选好了</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_cancel">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">取消订单</div>

        <div class="addition">
          <div class="addition_item">
            <div class="addition_item_label_text_area">备注</div>
            <div class="addition_item_text_area">
              <textarea class="addition_item_text_input" placeholder="您可以在此备注取消订单的原因。" v-model="http.req.cancel.remark"></textarea>
            </div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnCancelConfirm">确认</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_pay_offline">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">线下支付</div>

        <div class="addition">
          <div class="addition_item">
            <div class="addition_item_label_text_area">备注</div>
            <div class="addition_item_text_area">
              <textarea class="addition_item_text_input" placeholder="您可以在此备注离线支付情况。" v-model="http.req.payOffline.remark"></textarea>
            </div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnPayOfflineConfirm">确认</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_return">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">退菜</div>

        <div class="blank_20"></div>

        <div class="return">
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

          <div class="blank_30"></div>

          <div class="return_remark">
            <div class="return_remark_label">退菜备注</div>

            <div class="blank_20"></div>

            <div class="return_remark_one" v-for="remark in ui.returnRemarks">
              <div class="return_remark_name" v-if="http.req.return.remark !== remark" @click="btnChooseReturnRemark(remark)">{{remark}}</div>
              <div class="return_remark_name_select" v-else>{{remark}}</div>
            </div>

            <div class="blank_20"></div>

            <div class="return_remark_text_area">
              <textarea class="return_remark_text_input" placeholder="您可以在此备注退菜原因。" v-model="http.req.return.remark"></textarea>
            </div>
          </div>

          <div class="modal_button_box">
            <div class="button_big" @click="btnFoodReturnConfirm">确认</div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_change_price">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">改价</div>

        <div class="change_price_label">请输入新价格 (原价: {{http.res.order.price}} 元)</div>

        <div class="box">
          <div class="modal_input_box">
            <div class="modal_input_area">
              <currency-input placeholder="请输入新价格" v-model="http.req.changePrice.price"></currency-input>
            </div>
          </div>
        </div>

        <div class="addition">
          <div class="addition_item">
            <div class="addition_item_label_text_area">备注</div>
            <div class="addition_item_text_area">
              <textarea class="addition_item_text_input" placeholder="您可以在此备注您的改价原因。" v-model="http.req.changePrice.remark"></textarea>
            </div>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnChangePriceConfirm">确认</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {httpOrderAdminApi} from '../../api/http/lt/httpOrderAdminApi'
  import {httpCaptchaApi} from '../../api/http/lt/httpCaptchaApi'
  import {scrollApi} from '../../api/local/scrollApi'
  import {timeApi} from '../../api/local/timeApi'
  import {stateApi} from '../../api/local/stateApi'
  import DropDown from '../common/DropDown'
  import CurrencyInput from '../common/CurrencyInput'
  import {highlightApi} from '../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '订单详情'
    },
    middleware: 'auth',
    components: {CurrencyInput, TitleBar, DropDown},
    props: {
      role: {
        type: String,
        default: 'waiter'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '订单详情',
          backUri: `/b/${this.$route.params.shortId}/waiter`,
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
            order: {
              orderFoods: []
            }
          }
        },
        ui: {
          v_people: false,
          vCoverMask: false,
          v_pay_offline: false,
          v_return: false,
          v_change_price: false,
          selectPeople: null,
          selectOrderFood: {},
          peopleChoose: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          v_cancel: false,
          returnRemarks: [
            '不想要了', '点错菜', '点重菜'
          ],
          returnCounts: []
        }
      }
    },
    created() {
      this.httpOrder()
    },
    mounted() {
      this.title.backUri = `/b/${this.$route.params.shortId}/${this.role}/order`
      this.$refs.titleBar.setBackUri(this.title.backUri)
    },
    methods: {
      btnChooseReturnCount(payload) {
        this.http.req.return.count = payload.name
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res

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

          for (let index in this.http.res.order.orderFoods) {
            let orderFood = this.http.res.order.orderFoods[index]

            if (Boolean(orderFood.finishAt)) {
              addFood(orderFood)
            }
          }

          for (let index in this.http.res.order.orderFoods) {
            let orderFood = this.http.res.order.orderFoods[index]

            if (Boolean(orderFood.cookedAt)) {
              addFood(orderFood)
            }
          }

          for (let index in this.http.res.order.orderFoods) {
            let orderFood = this.http.res.order.orderFoods[index]

            if (Boolean(orderFood.cookingAt)) {
              addFood(orderFood)
            }
          }

          for (let index in this.http.res.order.orderFoods) {
            let orderFood = this.http.res.order.orderFoods[index]
            addFood(orderFood)
          }

          this.http.res.order.orderFoods = orderFoods
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
      getStatusLabel(status) {
        switch (status) {
          case 'Wait':
            return '下单'
          case 'Cooking':
            return '开始做'
          case 'Cooked':
            return '做好了'
          case 'Finish':
            return '上菜'
        }
      },
      btnChangeStatus(orderFood, status) {
        if (this.http.res.order.status === 'Finish' || this.http.res.order.status === 'Closed') {
          return
        }

        if (status === 'Cooking' || status === 'Cooked') {
          if (this.role !== 'admin' && this.role !== 'cooker') {
            this.$msgBox.doModal({
              type: 'yes',
              title: '更改状态',
              content: '仅允许店长、厨师可以操作，您只有查看权限。'
            })

            return
          }
        }

        if (status === 'Finish') {
          if (this.role !== 'admin' && this.role !== 'waiter') {
            this.$msgBox.doModal({
              type: 'yes',
              title: '更改状态',
              content: '仅允许店长、服务员可以操作，您只有查看权限。'
            })

            return
          }
        }

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '更改状态',
          content: `确认将${highlightApi.highlight(orderFood.foodCategoryName)}的状态更为${highlightApi.highlight(this.getStatusLabel(status))}</span>吗?`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpOrderAdminApi.putFoodStatus(this.$route.params.shortId, this.$route.params.orderOneId, orderFood.id, status).then(res => {
              if (res.orderOneIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '更改状态',
                  content: '订单不存在。'
                })
              } else if (res.orderFoodIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '更改状态',
                  content: '餐食不存在。'
                })
              } else if (res.closed) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '更改状态',
                  content: '订单已关闭。'
                })
              } else if (res.success) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '更改状态',
                  content: '已更新。'
                }).then(async (val) => {
                  this.httpOrder()
                })
              }
            })
          }
        })
      },
      btnCoverMask() {
        this.ui.v_people = false
        this.ui.v_cancel = false
        this.ui.v_pay_offline = false
        this.ui.v_return = false
        this.ui.v_change_price = false
        this.ui.vCoverMask = false

        scrollApi.enable(true)
      },
      btnPeople() {
        if (this.http.res.order.status === 'Paid' || this.http.res.order.status === 'Finish' || this.http.res.order.status === 'Closed') {
          return
        }

        if (this.role === 'cooker') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '更改人数',
            content: '仅允许店长、服务员、收银可以更改，您只有查看权限。'
          })

          return
        }

        this.ui.vCoverMask = true
        this.ui.v_people = true
        this.ui.selectPeople = this.http.res.order.people

        scrollApi.enable(false)
      },
      btnPeopleChoose(one) {
        this.ui.selectPeople = one
      },
      btnPeopleConfirm() {
        httpOrderAdminApi.putPeople(this.$route.params.shortId, this.$route.params.orderOneId, this.ui.selectPeople).then(res => {
          this.ui.v_people = false
          this.ui.vCoverMask = false

          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '订单',
              content: '订单不存在。'
            })
          } else if (res.paid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '订单',
              content: '已支付。'
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '订单',
              content: '已关闭。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '订单',
              content: '已更新。'
            })
          }

          this.httpOrder()
        })
      },
      getTime(time) {
        if (!Boolean(time)) {
          return ''
        }

        return timeApi.dateFormat(new Date(time), 'HH:mm')
      },
      btnFood() {
        let tableId = this.http.res.order.orderTable.tableOneId

        httpCaptchaApi.postCaptchaTable(this.$route.params.shortId, tableId).then(res => {
          if (res.tableOneNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '无效餐桌',
              content: '餐桌二维码已过期，请重新扫码或联系服务员。'
            })

            stateApi.table.setCaptchaTableId(null)
            stateApi.table.setTableName(null)
            stateApi.table.setTableNumber(null)
          } else {
            stateApi.table.setCaptchaTableId(res.captchaTableId)
            stateApi.table.setTableName(res.tableName)
            stateApi.table.setTableNumber(res.tableNumber)

            this.$router.push({
              path: `/b/${this.$route.params.shortId}/waiter/food`,
              query: {
                tableId: tableId
              }
            })
          }
        })
      },
      btnStatusReset(orderFood, status) {
        if (this.http.res.order.status === 'Finish' || this.http.res.order.status === 'Closed') {
          return
        }

        if (this.role !== 'admin') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '重置状态',
            content: '仅允许店长可以操作，您只有查看权限。'
          })

          return
        }

        if (this.http.res.order.status === 'Finish' || this.http.res.order.status === 'Closed') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '重置状态',
            content: '订单已关闭。'
          })

          return
        }

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '重置状态',
          content: '您确认要重置状态吗?'
        }).then(async (val) => {
          if (val === 'Yes') {
            this.btnChangeStatus(orderFood, status)
          }
        })
      },
      btnChangePrice() {
        this.ui.v_change_price = true
        this.ui.vCoverMask = true

        this.http.req.changePrice.price = this.http.res.order.price
      },
      btnChangePriceConfirm() {
        this.ui.v_change_price = false
        this.ui.vCoverMask = false

        if (this.role !== 'admin' && this.role !== 'cashier') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '改价',
            content: '仅允许店长、收银可以操作，您只有查看权限。。'
          })

          return
        }

        if (this.http.req.changePrice.price <= 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '改价',
            content: '更改价格不能为零，如您需取消订单请联系店长。'
          })

          return
        }

        httpOrderAdminApi.putPrice(this.$route.params.shortId, this.$route.params.orderOneId, this.http.req.changePrice).then(res => {
          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '改价',
              content: '订单不存在。'
            })
          } else if (res.paid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '改价',
              content: '已支付，无法改价。'
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '改价',
              content: '订单已关闭。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '改价',
              content: '已改价。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      },
      btnPayOffline() {
        this.ui.v_pay_offline = true
        this.ui.vCoverMask = true
      },
      btnPayOfflineConfirm() {
        if (this.role !== 'admin' && this.role !== 'cashier') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '离线支付',
            content: '没有权限。'
          })

          return
        }

        httpOrderAdminApi.putPayOffline(this.$route.params.shortId, this.$route.params.orderOneId, this.http.req.payOffline.remark).then(res => {
          this.ui.v_pay_offline = false
          this.ui.vCoverMask = false

          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '离线支付',
              content: '订单不存在。'
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '离线支付',
              content: '订单已关闭。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '离线支付',
              content: '已离线支付。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      },
      btnCancel() {
        if (this.role !== 'admin') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '离线支付',
            content: '仅允许店长可以操作，您只有查看权限。。'
          })

          return
        }

        this.ui.vCoverMask = true
        this.ui.v_cancel = true

        scrollApi.enable(false)
      },
      btnCancelConfirm() {
        scrollApi.enable(true)

        httpOrderAdminApi.putCancel(this.$route.params.shortId, this.$route.params.orderOneId, this.http.req.cancel.remark).then(res => {
          this.ui.v_cancel = false
          this.ui.vCoverMask = false

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
              content: '已取消。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      },
      btnChooseReturnRemark(remark) {
        this.http.req.return.remark = remark
      },
      btnFoodReturn(orderFood) {
        if (this.http.res.order.status === 'Finish' || this.http.res.order.status === 'Closed') {
          this.$msgBox.doModal({
            type: 'yes',
            title: '更改状态',
            content: '订单已关闭。'
          })

          return
        }

        this.http.req.return.count = 1
        this.ui.selectOrderFood = orderFood
        this.http.req.return.orderFoodId = orderFood.id

        this.ui.returnCounts = []
        for (let i = 0; i < orderFood.count; i++) {
          this.ui.returnCounts.push({name: i + 1})
        }

        this.ui.vCoverMask = true
        this.ui.v_return = true

        scrollApi.enable(false)
      },
      btnFoodReturnConfirm() {
        this.ui.v_return = false
        this.ui.vCoverMask = false

        scrollApi.enable(true)

        httpOrderAdminApi.putReturn(this.$route.params.shortId, this.$route.params.orderOneId, this.http.req.return).then(res => {
          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '订单不存在。'
            })
          } else if (res.orderFoodIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '餐食不存在。'
            })
          } else if (res.paid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '已支付，无法退菜。'
            })
          } else if (res.closed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '订单已关闭。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '退菜',
              content: '已退菜。'
            }).then(async (val) => {
              this.httpOrder()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
  @import 'BOrderOne';
</style>
