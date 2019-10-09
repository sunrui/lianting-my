<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

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

      <div class="order_content box_radius_footer">
        <div class="order_food" v-for="(orderFood, index) in ui.receipt.orderFoods">
          <img class="order_food_image" :src="orderFood.foodCategoryImage" :alt="orderFood.foodCategoryName">
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
        <div class="addition_item">
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
        <div class="addition_item">
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

    <div class="button_box" v-if="ui.receipt.orderFirst.status === 'NotPaid'">
      <div class="button_small" @click="btnFood">加餐</div>
      <div class="button_small" @click="btnPay">立即支付</div>
    </div>
    <div class="button_box" v-else-if="ui.receipt.orderFirst.status === 'Paid'">
      <div class="button_big" @click="btnFood" v-if="ui.receipt.orderFirst.type === 'ForHere'">加餐</div>
    </div>
    <div v-else class="blank_30"></div>
  </div>
</template>

<script>
  import {timeApi} from '../../../../api/local/timeApi'
  import TitleBar from '../../../../components/common/TitleBar'
  import DropDown from '../../../../components/common/DropDown'
  import CurrencyInput from '../../../../components/common/CurrencyInput'
  import {httpOrderApi} from '../../../../api/http/lt/httpOrderApi'

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
          backUri: `/c/${this.$route.params.shortId}/order/history`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {},
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
          remarks: []
        }
      }
    },
    mounted() {
      this.httpOrder()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpOrder() {
        httpOrderApi.getAllByTableOneId(this.$route.params.shortId, this.$route.query.tableOneId, true, 0, 20).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}/order`)
            return
          }

          this.ui.receipt.orderFirst = res.elements[0]
          this.ui.selectPeople = res.elements[0].people

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

        return parseFloat(price).toFixed(2)
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
            return '上菜'
        }
      },
      getTime(time) {
        if (!Boolean(time)) {
          return ''
        }

        return timeApi.dateFormat(new Date(time), 'HH:mm')
      },
      btnPay() {
        this.$msgBox.doModal({
          type: 'yes',
          title: '立即支付',
          content: '多个订单将转至订单列表。'
        }).then(async (val) => {
          this.$router.push(`/c/${this.$route.params.shortId}/order/history`)
        })
      },
      btnFood() {
        this.$router.push(`/c/${this.$route.params.shortId}/food`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
</style>
