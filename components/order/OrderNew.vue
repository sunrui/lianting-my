<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

    <div class="box">
      <div class="order_table box_radius" v-if="ui.table.captchaTableId">
        <div class="order_table_number">{{ui.table.tableNumber}}</div>
        <div class="order_table_name">{{ui.table.tableName}}</div>
      </div>
      <div class="addition box_radius" v-else-if="roleType === 'c' && http.req.takeoutConfig.enable">
        <div class="addition_item">
          <div class="addition_item_label">外卖配送</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.takeoutEnable"
                 @click="btnTableOutEnable(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnTableOutEnable(true)"></div>
          </div>
        </div>

        <div v-if="ui.takeoutEnable">
          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label_text_area">地址</div>
            <div class="addition_item_text_area">
              <label>
                <textarea class="addition_item_text_input" placeholder="请输入您的配送地址" v-model="http.req.order.takeout.address"></textarea>
              </label>
            </div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">您的姓名</div>
            <label>
              <input class="addition_item_input" placeholder="请输入您的姓名" maxlength="20" v-model="http.req.order.takeout.name">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">手机号</div>
            <div class="addition_item_content" style="user-select: text;" v-if="phone">{{phone}}</div>
            <div class="addition_item_link" v-else @click="btnBindPhone">未绑定</div>
          </div>
        </div>
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

        <div v-if="cart.people">
          <div class="box_divide"></div>

          <div class="order_tableware">
            <div class="order_tableware_icon">餐位费</div>
            <div class="order_tableware_label">餐具</div>
            <div class="order_tableware_count">{{cart.people }}</div>
            <div class="order_tableware_price">{{cart.people * cart.perTablewarePrice}}</div>
          </div>
        </div>

        <div class="order_tableware" v-if="ui.takeoutEnable">
          <div class="box_divide"></div>

          <div class="order_tableware_icon">配送费</div>
          <div class="order_tableware_label">外卖配送</div>
          <div class="order_tableware_price">{{http.req.takeoutConfig.takeoutFee}}</div>
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
          <div class="addition_item_label">人数</div>
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
            <label>
              <textarea class="addition_item_text_input" :placeholder="roleType !== 'c' ? '请输入顾客的口味要求。' : '请输入您的口味要求，我们会尽量安排。'" v-model="ui.tasteNote"></textarea>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box" v-if="ui.takeoutEnable">
      <div class="button_big" @click="btnOrder">立即下单</div>
    </div>
    <div class="button_box" v-else>
      <div class="button_big" v-if="ui.table.captchaTableId" @click="btnOrder">立即下单</div>
      <div class="button_big" v-else @click="btnScanCaptcha">扫码下单</div>
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

  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {cartApi} from '../../api/local/cartApi'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {userApi} from '../../api/local/userApi'
  import {scrollApi} from '../../api/local/scrollApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {httpTakeoutApi} from '../../api/http/lt/httpTakeoutApi'
  import {timeApi} from '../../api/local/timeApi'
  import {alipayApi} from '../../api/local/alipayApi'

  export default {
    metaInfo: {
      title: '下单'
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
          title: '下单',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            takeoutConfig: {
              enable: false,
              takeoutFee: 0,
            },
            order: {
              type: 'ForHere',
              captchaTableId: null,
              takeout: {
                address: '',
                phone: '',
                name: ''
              },
              foods: [],
              tasteNote: '',
              people: 0
            }
          },
          res: {}
        },
        ui: {
          vPeople: false,
          vCoverMask: false,
          selectPeople: null,
          peopleChoose: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          tasteNote: '',
          table: {
            captchaTableId: null,
            tableNumber: null,
            tableName: null
          },
          takeoutEnable: false,
          orderOneId: null
        },
      }
    },
    computed: {
      cart() {
        let cart = this.$store.state.cart
        return cart.cart
      },
      phone() {
        return userApi.getUserPhone()
      }
    },
    mounted() {
      if (this.roleType === 'c') {
        this.title.backUri = `/c/${this.$route.params.shortId}/food`
      } else {
        this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}/food`
      }

      this.httpTakeoutConfig()
    },
    created() {
      this.$store.commit('cart/update', cartApi.getCart())

      cartApi.setPeople(null)
      cartApi.setTasteNote(null)

      if (!this.cart.select || this.cart.select === 0) {
        if (this.roleType === 'c') {
          this.$router.push(`/c/${this.$route.params.shortId}/food`)
        } else {
          this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/food`)
        }
        return
      }

      this.ui.table.captchaTableId = userApi.getCaptchaTableId()
      this.ui.table.tableName = userApi.getTableName()
      this.ui.table.tableNumber = userApi.getTableNumber()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpTakeoutConfig() {
        httpTakeoutApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.takeoutConfig = res
        })
      },
      getTotalPrice() {
        let price = 0

        for (let index in this.cart.foods) {
          let food = this.cart.foods[index]
          price += food.select * food.food.price
        }

        price += this.cart.people && this.cart.perTablewarePrice ? this.cart.people * this.cart.perTablewarePrice : 0

        if (this.ui.takeoutEnable) {
          price += this.http.req.takeoutConfig.takeoutFee
        }

        return price
      },
      btnPeople() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vPeople = true
        this.ui.selectPeople = this.cart.people
      },
      btnCoverMask() {
        this.ui.vPeople = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)
      },
      btnPeopleChoose(one) {
        this.ui.selectPeople = one
      },
      btnPeopleConfirm() {
        this.ui.vPeople = false
        this.ui.vCoverMask = false
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

        if (this.ui.takeoutEnable) {
          if (!Boolean(this.http.req.order.takeout.address)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '请输入您的配送地址。'
            })

            return
          }

          this.http.req.order.takeout.phone = this.phone

          if (!Boolean(this.http.req.order.takeout.phone)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '为了配送员更好的联系您，请先绑定手机。'
            })

            return
          }

          if (!Boolean(this.http.req.order.takeout.name)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '请输入您的姓名。'
            })

            return
          }

          this.http.req.order.type = 'Takeout'
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
        this.http.req.order.roleWaiter = this.roleType !== 'c'

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
              userApi.setCaptchaTableId(null)
              userApi.setTableName(null)
              userApi.setTableNumber(null)
              this.ui.table = {}

              if (this.roleType !== 'c') {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/table`)
              }
            })
          } else if (res.takeoutNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '没有外卖相关信息。'
            })
          } else if (res.foodNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '下单',
              content: '部分食品已下架，请重新下单。'
            }).then(async (val) => {
              cartApi.clearAll()
              this.$store.commit('cart/update', cartApi.getCart())

              if (this.roleType === 'c') {
                this.$router.push(`/c/${this.$route.params.shortId}/food`)
              } else {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/food`)
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

              if (this.roleType !== 'c') {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/table`)
              }
            })
          } else if (res.orderOneId) {
            let price = 0
            let select

            for (let index in this.cart.foods) {
              let food = this.cart.foods[index]
              price += food.select * food.food.price
            }

            let path

            if (this.roleType === 'c') {
              this.ui.orderOneId = res.orderOneId
              path = `/c/${this.$route.params.shortId}/order/${res.orderOneId}/success`
            } else {
              path = `/b/${this.$route.params.shortId}/${this.roleType}/order/${res.orderOneId}/success`
            }

            select = this.cart.select

            cartApi.clearAll()
            this.$store.commit('cart/update', cartApi.getCart())

            this.$router.push({
              path: path,
              query: {
                cartPrice: price,
                cartSelect: select
              }
            })
          }
        })
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
      btnTableOutEnable(enable) {
        this.ui.takeoutEnable = enable
      },
      btnBindPhone() {
        this.$router.push(`/c/${this.$route.params.shortId}/me/bind/phone`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
</style>
