<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>

    <div class="box" v-show="ui.table.captchaTableId">
      <div class="order_table box_radius">
        <div class="order_table_number">{{ui.table.tableNumber}}</div>
        <div class="order_table_name">{{ui.table.tableName}}</div>
      </div>
    </div>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{new Date().toLocaleString()}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_content box_radius_footer">
        <div>
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
        </div>

        <div class="box_divide"></div>

        <div class="order_tableware">
          <div class="order_tableware_icon">餐位费</div>
          <div class="order_tableware_label">餐具</div>
          <div class="order_tableware_count">{{cart.people ? cart.people : 0}}</div>
          <div class="order_tableware_price">{{cart.people && cart.perTablewarePrice ? cart.people * cart.perTablewarePrice : 0 }}</div>
        </div>

        <div class="box_divide"></div>

        <div class="order_price">
          <div class="order_price_food_count">共计 {{cart.select}} 份</div>
          <div class="order_price_total">{{getTotalPrice()}}</div>
          <div class="order_price_total_label">小计</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnPeople">
          <div class="addition_item_label">就餐人数</div>
          <div class="addition_item_content" v-show="cart.people">{{cart.people}} 人</div>
          <div class="addition_item_link" v-show="!cart.people">请选择人数</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">口味</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" :placeholder="roleWaiter ? '请输入顾客的口味要求。' : '请输入您的口味要求，我们会尽量安排。'" v-model="ui.tasteNote"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-show="ui.table.captchaTableId" @click="btnOrder">立即下单</div>
      <div class="button_big" v-show="!ui.table.captchaTableId" @click="btnScanCaptcha">扫码下单</div>
    </div>

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

  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {cartApi} from '../../api/local/cartApi'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {stateApi} from '../../api/local/stateApi'
  import {scrollApi} from '../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '下单'
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
          title: '下单',
          backUri: this.roleWaiter ? `/b/${this.$route.params.shortId}/waiter` : `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          v_people: false,
          v_cover_mask: false,
          selectPeople: null,
          peopleChoose: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          tasteNote: '',
          table: {}
        },
        http: {
          req: {
            order: {
              type: 'ForHere',
              captchaTableId: null,
              foods: [],
              tasteNote: '',
              people: 0
            }
          },
          res: {}
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
      cartApi.setPeople(null)
      cartApi.setTasteNote(null)
      this.$store.commit('cart/update', cartApi.getCart())

      if (!this.cart.select || this.cart.select === 0) {
        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/food`)
        }
        return
      }

      this.ui.table.captchaTableId = stateApi.table.getCaptchaTableId()
      this.ui.table.tableName = stateApi.table.getTableName()
      this.ui.table.tableNumber = stateApi.table.getTableNumber()
    },
    methods: {
      getTotalPrice() {
        let price = 0

        for (let index in this.cart.foods) {
          let food = this.cart.foods[index]
          price += food.select * food.food.price
        }

        price += this.cart.people && this.cart.perTablewarePrice ? this.cart.people * this.cart.perTablewarePrice : 0

        return price
      },
      btnPeople() {
        this.ui.v_cover_mask = true
        this.ui.v_people = true
        this.ui.selectPeople = this.cart.people
        scrollApi.enable(false)
      },
      btnCoverMask() {
        this.ui.v_people = false
        this.ui.v_cover_mask = false
        scrollApi.enable(true)
      },
      btnPeopleChoose(one) {
        this.ui.selectPeople = one
      },
      btnPeopleConfirm() {
        this.ui.v_people = false
        this.ui.v_cover_mask = false
        scrollApi.enable(true)

        cartApi.setPeople(this.ui.selectPeople)
        this.$store.commit('cart/update', cartApi.getCart())

        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          cartApi.setPerTablewarePrice(res.perTablewarePrice)
          this.$store.commit('cart/update', cartApi.getCart())
        })
      },
      btnOrder() {
        if (!this.cart.people) {
          this.btnPeople()
          return
        }

        this.http.req.order.foods = []
        for (let index in this.cart.foods) {
          let cartFood = this.cart.foods[index]
          this.http.req.order.foods.push({
            foodId: cartFood.food.id,
            count: cartFood.select
          })
        }

        this.http.req.order.tasteNote = this.ui.tasteNote
        this.http.req.order.people = this.cart.people
        this.http.req.order.captchaTableId = this.ui.table.captchaTableId

        httpOrderApi.postOrder(this.$route.params.shortId, this.http.req.order).then(res => {
          if (res.shopClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '店铺已打烊。'
            })
          } else if (res.tableNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '餐桌二维码已过期，请重新扫码。'
            }).then(async (val) => {
              stateApi.table.setCaptchaTableId(null)
              stateApi.table.setTableName(null)
              stateApi.table.setTableNumber(null)

              this.ui.table = {}

              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/table`)
              }
            })
          } else if (res.foodNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '部分食品已下架，请重新下单。'
            }).then(async (val) => {
              cartApi.clear()

              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/food`)
              } else {
                this.$router.push(`/m/${this.$route.params.shortId}/food`)
              }
            })
          } else if (res.orderOneId) {
            let price = 0

            for (let index in this.cart.foods) {
              let food = this.cart.foods[index]
              price += food.select * food.food.price
            }

            cartApi.clear()

            let path

            if (this.roleWaiter) {
              path = `/b/${this.$route.params.shortId}/waiter/order/${res.orderOneId}/success`
            } else {
              path = `/m/${this.$route.params.shortId}/order/${res.orderOneId}/success`
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
      },
      btnScanCaptcha() {
        if (!this.cart.people) {
          this.btnPeople()
          return
        }

        console.log('scan to order')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/order';
</style>
