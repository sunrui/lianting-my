<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-if="ui.orderAnyOne.orderTakeOut">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">地址</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入您的配送地址" readonly v-model="ui.orderAnyOne.orderTakeOut.address"></textarea>
            </label>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">订单人</div>
          <div class="addition_item_content" style="user-select: text;">{{ui.orderAnyOne.orderTakeOut.name}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">手机号</div>
          <div class="addition_item_content" style="user-select: text;">{{ui.orderAnyOne.orderTakeOut.phone}}</div>
        </div>
      </div>
    </div>

    <div class="box" v-if="ui.table.captchaTableId">
      <div class="order_table box_radius">
        <div class="order_table_number">{{ui.table.tableNumber}}</div>
        <div class="order_table_name">{{ui.table.tableName}}</div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_add_food_icon"></div>
        <div class="list_time_label">待新增餐食</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_add_content box_radius_footer">
        <div class="order_food" v-for="food in cart.foods">
          <img class="order_food_image" :src="food.category.image" :alt="food.category.name">
          <div class="order_food_name_detail">
            <div class="order_food_name_detail_name">{{food.category.name}}</div>
            <div class="order_food_name_detail_name_category">{{food.food.name}}</div>
          </div>
          <div class="order_food_status order_food_status_new">新增</div>
          <div class="order_food_count">{{food.select}}</div>
          <div class="order_food_price">{{food.select * food.food.price}}</div>
        </div>

        <div class="blank_10"></div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date())}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div>
          <div class="order_food" v-for="orderFood in ui.orderedFoods">
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
        </div>

        <div v-if="ui.orderAnyOne.people">
          <div class="box_divide"></div>

          <div class="order_tableware">
            <div class="order_tableware_icon">餐位费</div>
            <div class="order_tableware_label">餐具</div>
            <div class="order_tableware_count">{{ui.orderAnyOne.people}}</div>
            <div class="order_tableware_price">{{ui.orderAnyOne.priceTableware}}</div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="order_price">
          <div class="order_price_food_count">共计 {{getTotalFood()}} 份</div>
          <div class="order_price_total">{{getTotalPrice()}}</div>
          <div class="order_price_total_label">小计</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">就餐人数</div>
          <div class="addition_item_content">{{ui.orderAnyOne.people}} 人</div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-if="ui.table.captchaTableId" @click="btnOrder">立即下单</div>
      <div class="button_big" v-else @click="btnScanCaptcha">扫码下单</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {cartApi} from '../../api/local/cartApi'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {userApi} from '../../api/local/userApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {timeApi} from '../../api/local/timeApi'
  import {alipayApi} from '../../api/local/alipayApi'

  export default {
    metaInfo: {
      title: '加餐'
    },
    middleware: 'auth',
    components: {TitleBar},
    props: {
      roleWaiter: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '加餐',
          backUri: this.roleWaiter ? `/b/${this.$route.params.shortId}/waiter` : `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          tasteNote: '',
          orderedFoods: [],
          orderAnyOne: {},
          table: {
            captchaTableId: null,
            tableNumber: null,
            tableName: null
          }
        },
        http: {
          req: {
            order: {
              type: 'ForHere',
              tableOneId: null,
              foods: [],
              tasteNote: '',
              people: 0
            }
          }
        }
      }
    },
    computed: {
      cart() {
        let cart = this.$store.state.cart
        return cart.cart
      }
    },
    created() {
      this.$store.commit('cart/update', cartApi.getCart())

      if (!this.cart.select || this.cart.select === 0) {
        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
        } else {
          this.$router.push(`/c/${this.$route.params.shortId}/food`)
        }
        return
      }

      this.ui.table.captchaTableId = userApi.getCaptchaTableId()
      this.ui.table.tableNumber = userApi.getTableNumber()
      this.ui.table.tableName = userApi.getTableName()

      if (!Boolean(this.ui.table.captchaTableId)) {
        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/table`)
        } else {
          this.$router.push(`/c/${this.$route.params.shortId}/order/new`)
        }

        return
      }

      this.httpOrderAllByCaptchaTableId()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      checkOrderFood(res) {
        for (let index in res.elements) {
          let orderOne = res.elements[index]
          if (orderOne.type !== 'ForHere') {
            continue
          }

          for (let foodIndex in orderOne.orderFoods) {
            let orderFood = orderOne.orderFoods[foodIndex]
            this.ui.orderedFoods.push(orderFood)
          }

          this.ui.orderAnyOne = orderOne
        }

        if (this.ui.orderedFoods.length === 0) {
          if (this.roleWaiter) {
            this.$router.push(`/b/${this.$route.params.shortId}/waiter/order/new`)
          } else {
            this.$router.push(`/c/${this.$route.params.shortId}/order/new`)
          }
        }
      },
      httpOrderLive() {
        httpOrderApi.getAllByLive(this.$route.params.shortId, 0, 99).then(res => {
          this.checkOrderFood(res)
        })
      },
      httpOrderAllByCaptchaTableId() {
        httpOrderApi.getAllByCaptchaTableId(this.$route.params.shortId, this.ui.table.captchaTableId, 0, 99).then(res => {
          if (res.expired) {
            userApi.setCaptchaTableId(null)
            userApi.setTableName(null)
            userApi.setTableNumber(null)
            this.ui.table = {}

            if (!this.roleWaiter) {
              this.httpOrderLive()
            }
            return
          }

          this.checkOrderFood(res.orderOnes)
        })
      },
      getTotalFood() {
        let count = 0

        for (let index in this.ui.orderedFoods) {
          let orderFood = this.ui.orderedFoods[index]
          count += orderFood.count
        }

        for (let index in this.cart.foods) {
          let food = this.cart.foods[index]
          count += food.select
        }

        return count
      },
      getTotalPrice() {
        let price = 0

        for (let index in this.ui.orderedFoods) {
          let orderFood = this.ui.orderedFoods[index]
          price += orderFood.count * orderFood.foodPrice
        }

        for (let index in this.cart.foods) {
          let food = this.cart.foods[index]
          price += food.select * food.food.price
        }

        price += this.ui.orderAnyOne.priceTableware

        return price
      },
      btnScanCaptcha() {
        if (!wechatApi.inWechat() && !alipayApi.inAlipay()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '扫码下单',
            content: '请使用微信或支付宝打开。'
          })

          return
        }

        this.$router.push('/scan')
      },
      btnOrder() {
        let cart = cartApi.getCart()

        let foods = []
        for (let index in cart.foods) {
          let cartFood = cart.foods[index]
          foods.push({
            foodId: cartFood.food.id,
            count: cartFood.select
          })
        }

        let order = {}

        order.type = 'ForHere'
        order.foods = foods
        order.tasteNote = this.ui.tasteNote
        order.people = this.cart.people
        order.captchaTableId = userApi.getCaptchaTableId()
        order.roleWaiter = this.roleWaiter

        httpOrderApi.postOrder(this.$route.params.shortId, order).then(res => {
          if (res.shopClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '店铺已打烊。'
            })
          } else if (res.tableNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '餐桌二维码已过期，请重新扫码。'
            }).then(async (val) => {
              userApi.setCaptchaTableId(null)
              userApi.setTableName(null)
              userApi.setTableNumber(null)
              this.ui.table = {}

              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/table`)
              }
            })
          } else if (res.otherTableOngoing) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '同时只能在一个餐桌下单，请重新扫码。'
            }).then(async (val) => {
              userApi.setCaptchaTableId(null)
              userApi.setTableName(null)
              userApi.setTableNumber(null)
              this.ui.table = {}

              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/table`)
              }
            })
          }  else if (res.foodNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '部分食品已下架，请重新下单。'
            }).then(async (val) => {
              cartApi.clearAll()
              this.$store.commit('cart/update', cartApi.getCart())
              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
              } else {
                this.$router.push(`/c/${this.$route.params.shortId}/food`)
              }
            })
          } else if (res.orderOneId) {
            let price = 0
            let select

            for (let index in this.cart.foods) {
              let food = this.cart.foods[index]
              price += food.select * food.food.price
            }

            select = this.cart.select

            cartApi.clearAll()
            this.$store.commit('cart/update', cartApi.getCart())

            let path

            if (this.roleWaiter) {
              path = `/b/${this.$route.params.shortId}/waiter/order/${this.ui.orderAnyOne.id}/success`
            } else {
              path = `/c/${this.$route.params.shortId}/order/${this.ui.orderAnyOne.id}/success`
            }

            this.$router.push({
              path: path,
              query: {
                cartPrice: price,
                cartSelect: select
              }
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
  @import 'OrderAdd';
</style>
