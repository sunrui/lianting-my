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
        <div class="list_time_label">{{new Date(parseInt(http.res.order.createdAt)).toLocaleString()}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div>
          <div class="order_food" v-for="orderFood in http.res.order.orderFoods">
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

        <div class="box_divide"></div>

        <div class="order_tableware">
          <div class="order_tableware_icon">餐位费</div>
          <div class="order_tableware_label">餐具</div>
          <div class="order_tableware_count">{{http.res.order.people}}</div>
          <div class="order_tableware_price">{{http.res.order.priceTableware}}</div>
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
          <div class="addition_item_content">{{http.res.order.people}} 人</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition"
           v-bind:class="{box_radius_header: http.res.order.tasteNotes && http.res.order.tasteNotes.length > 0,
              box_radius: !http.res.order.tasteNotes || http.res.order.tasteNotes.length === 0}">
        <div class="addition_item">
          <div class="addition_item_label_text_area">口味</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" :placeholder="roleWaiter ? '请输入顾客的口味要求。' : '请输入您的口味要求，我们会尽量安排。'" v-model="ui.tasteNote"></textarea>
            </label>
          </div>
        </div>
      </div>

      <div v-if="http.res.order.tasteNotes && http.res.order.tasteNotes.length > 0">
        <div class="box_divide_radius">
          <div class="box_divide_radius_line"></div>
        </div>

        <div class="order_taste_note_history box_radius_footer">
          <div class="order_taste_note_history_item" v-for="taskNote in http.res.order.tasteNotes">
            <div class="order_taste_note_history_icon_ball"></div>
            <div class="order_taste_note_history_icon_line"></div>
            <div class="order_taste_note_history_content">{{taskNote}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnOrder">立即下单</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import { cartApi } from '../../api/local/cartApi'
  import { httpOrderApi } from '../../api/http/lt/httpOrderApi'

  export default {
    metaInfo: {
      title: '加餐'
    },
    middleware: 'auth',
    components: { TitleBar },
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
          tasteNote: ''
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
          },
          res: {
            order: {}
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

      this.httpOrder()
    },
    methods: {
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res
        })
      },
      getTotalFood() {
        let count = 0

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
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

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
          price += orderFood.count * orderFood.foodPrice
        }

        for (let index in this.cart.foods) {
          let food = this.cart.foods[index]
          price += food.select * food.food.price
        }

        price += this.http.res.order.priceTableware

        return price
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

        let model = {
          foods: foods,
          tasteNote: this.ui.tasteNote
        }

        httpOrderApi.postOrderFood(this.$route.params.shortId, this.http.res.order.id, model).then(res => {
          if (res.shopClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '店铺已打烊。'
            })
          } else if (res.orderNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '订单不存在。'
            })
          } else if (res.orderClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '订单已关闭。'
            })
          } else if (res.orderPaid) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '订单已支付，请重新下单。'
            }).then(async (val) => {
              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
              } else {
                this.$router.push(`/c/${this.$route.params.shortId}/food`)
              }
            })
          } else if (res.foodNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '加餐',
              content: '部分食品已下架，请重新下单。'
            }).then(async (val) => {
              cartApi.clear()
              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
              } else {
                this.$router.push(`/c/${this.$route.params.shortId}/food`)
              }
            })
          } else if (res.success) {
            let price = 0

            for (let index in this.cart.foods) {
              let food = this.cart.foods[index]
              price += food.select * food.food.price
            }

            cartApi.clear()

            let path

            if (this.roleWaiter) {
              path = `/b/${this.$route.params.shortId}/waiter/order/${this.http.res.order.id}/success`
            } else {
              path = `/c/${this.$route.params.shortId}/order/${this.http.res.order.id}/success`
            }

            this.$router.push({
              path: path,
              query: {
                cartPrice: price,
                cartSelect: this.cart.select
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
