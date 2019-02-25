<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.v_cover_mask_cart}" @click="btnCoverMaskCart"></div>
    </transition>
    <transition name="fade">
      <div :class="{ cover_mask_11: ui.v_cover_mask_leaf}" @click="btnLeaf(false)"></div>
    </transition>

    <div v-for="ball in ui.balls">
      <transition name="drop" @before-enter="ballDropBeforeEnter" @enter="ballDropEnter" @after-enter="ballDropAfterEnter">
        <div v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="search_box" @click="btnSearch">
      <div class="search">
        <div class="search_icon"></div>
        <div class="search_label">搜索...</div>
      </div>
    </div>

    <div class="content_box">
      <div class="blank_50"></div>

      <div class="menu_box">
        <div class="menu">
          <div class="menu_item" v-for="foodGroup in http.res.foodGroups.elements">
            <a :id="'menu_' + foodGroup.id"
               :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
               :href="'#' + foodGroup.id" @click="selectMenu(foodGroup.id, false)">
              <div class="menu_item_badge" v-if="menuBadge(foodGroup.id) > 0">{{menuBadge(foodGroup.id)}}</div>
              <div class="menu_item_label">{{foodGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(foodGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </a>
          </div>
        </div>

        <div class="leaf_box" @click="btnLeaf(true)">
          <div class="leaf"></div>
        </div>
      </div>

      <div class="menu_box_extend" v-if="ui.v_menu_extend">
        <div class="menu_extend">
          <div class="menu_item menu_item_extend" v-for="foodGroup in http.res.foodGroups.elements">
            <a :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
               @click="selectMenu(foodGroup.id, true)">
              <div class="menu_item_badge" v-if="menuBadge(foodGroup.id) > 0">{{menuBadge(foodGroup.id)}}</div>
              <div class="menu_item_label">{{foodGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(foodGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </a>
          </div>
        </div>

        <div class="leaf_box_extend" @click="btnLeaf(false)">
          <div class="leaf_extend"></div>
        </div>
      </div>

      <div class="food_group_box" :id="'box_' + foodGroup.id" v-for="foodGroup in http.res.foodGroups.elements">
        <div class="group_box">
          <div class="food_group_anchor" :id="foodGroup.id"></div>
          <div class="group_name">{{foodGroup.name}}</div>
          <div class="group_count">({{foodGroup.foodCategories.length}})</div>
          <div class="group_mode" v-if="ui.groupMode === 'Small'" @click="btnGroupMode('Big')">
            <img class="group_mode_icon" src="/img/m/food/group_mode_big.png" alt="">
            <div class="group_mode_label">大图模式</div>
          </div>
          <div class="group_mode" v-else @click="btnGroupMode('Small')">
            <img class="group_mode_icon" src="/img/m/food/group_mode_small.png" alt="">
            <div class="group_mode_label">小图模式</div>
          </div>
        </div>

        <div class="box" v-for="(foodCategory, index) in foodGroup.foodCategories">
          <div class="blank_20" v-if="index !== 0"></div>

          <div v-bind:class="{
          food_big: ui.groupMode === 'Big',
          food: ui.groupMode !== 'Big',
          }" class="box_radius">
            <div class="food_category_anchor" :id="foodCategory.id"></div>
            <div v-bind:class="{
            food_image_big_box: ui.groupMode === 'Big',
            food_image_box: ui.groupMode !== 'Big',
            }" class="">
              <img class="food_image" :src="foodCategory.image" :alt="foodCategory.name">
              <div class="addition_item_tag_label food_image_tag" v-if="foodCategory.tagName" v-bind:class="{
                   addition_item_tag_color_1: foodCategory.tagIndex === 1,
                   addition_item_tag_color_2: foodCategory.tagIndex === 2,
                   addition_item_tag_color_3: foodCategory.tagIndex === 3
            }">{{foodCategory.tagName}}
              </div>
            </div>
            <div v-bind:class="{
            food_info_big_box: ui.groupMode === 'Big',
            food_info_box: ui.groupMode !== 'Big',
            }">
              <div class="food_info">
                <div class="food_name">{{foodCategory.name}}</div>
                <div class="food_detail">{{foodCategory.detail}}</div>
                <div v-if="foodCategory.foods.length > 0 && foodCategory.status === 'ONLINE'">
                  <div class="food_price_box">
                    <div class="food_price_now">{{foodCategory.foods[0].price}}</div>
                    <div class="food_price_original"
                         v-if="foodCategory.foods[0].price !== foodCategory.foods[0].originalPrice">
                      {{foodCategory.foods[0].originalPrice}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="food_button" v-if="foodCategory.status === 'ONLINE'">
                <div v-if="foodCategory.select > 0">
                  <div class="food_button_add" @click="btnFoodAdd(foodGroup.id, foodCategory)" @click.stop.prevent="eventFoodAdd"></div>
                  <div class="food_button_count">{{foodCategory.select}}</div>
                  <div class="food_button_minus" @click="btnFoodMinus(foodCategory)"></div>
                </div>
                <div v-else>
                  <div class="food_button_zero" @click="btnFoodAdd(foodGroup.id, foodCategory)" @click.stop.prevent="eventFoodAdd"></div>
                </div>
              </div>
            </div>
            <div class="food_status_offline" v-if="foodCategory.status === 'OFFLINE'"></div>
            <div class="food_status_sold_out" v-if="foodCategory.foods.length === 0 || foodCategory.status === 'SOLD_OUT'"></div>
          </div>

          <div class="blank_20" v-if="index !== foodGroup.foodCategories.length - 1"></div>
        </div>

      </div>

      <div class="blank_100"></div>
      <div class="blank_50"></div>
    </div>

    <transition name="toggle">
      <div class="cart" v-if="ui.v_cart">
        <div class="cart_title">
          <div class="cart_title_label">已选餐食 ({{cart.select}})</div>
          <div class="cart_title_delete">
            <div class="cart_title_delete_icon"></div>
            <div class="cart_title_delete_label" @click="btnCartClear()">清空</div>
          </div>
        </div>

        <div class="cart_box">
          <div class="cart_food" v-for="cartFood in cart.foods">
            <div class="box_divide" v-if="cartFood !== cart.foods[0]"></div>

            <div class="cart_food_info">
              <div class="cart_food_name">{{cartFood.category.name}}</div>
              <div class="cart_food_detail">({{cartFood.food.name}})</div>
            </div>
            <div class="cart_food_price">{{cartFood.food.price}}</div>
            <div class="cart_food_button">
              <div class="cart_food_button_add"
                   @click="btnCartFoodAdd(cartFood.foodGroupId, cartFood.category, cartFood.food)"></div>
              <div class="cart_food_button_count">{{cartFood.select}}</div>
              <div class="cart_food_button_minus" @click="btnCartFoodMinus(cartFood.category, cartFood.food)"></div>
            </div>
          </div>

          <div class="blank_20"></div>
        </div>
      </div>
    </transition>

    <div class="footer">
      <div class="footer_cart_box" @click="btnCart">
        <div v-bind:class="{footer_cart:!ui.v_cart, footer_cart_extend: ui.v_cart}"></div>
        <div class="footer_cart_badge" v-show="!ui.v_cart && cart.select > 0">{{cart.select}}</div>
      </div>
      <div class="footer_price">{{cart.price}}</div>
      <div class="footer_button" v-if="cart.select > 0" @click="btnOrder">立即下单</div>
      <div class="footer_button footer_button_gray" v-else>立即下单</div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if=" ui.v_category">
        <div class="modal_close_box" @click="btnCoverMaskCart">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="category_food">
          <img class="category_food_image" :src="ui.modal_category.category.image" :alt="ui.modal_category.selectFood.name">

          <div class="category_food_info">
            <div class="category_food_name">{{ui.modal_category.category.name}}</div>
            <div class="category_food_detail">已选：{{ui.modal_category.selectFood.name}}</div>
            <div class="category_food_price">
              <div class="category_food_price_now">{{ui.modal_category.selectFood.price}}</div>
              <div class="category_food_price_original"
                   v-if="ui.modal_category.selectFood.price !== ui.modal_category.selectFood.originalPrice">
                {{ui.modal_category.selectFood.originalPrice}}
              </div>
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="category_label">规格</div>
        <div class="category_box">
          <div class="category_one" v-for="food in ui.modal_category.category.foods">
            <div class="category_one_name_select" v-if="food.id === ui.modal_category.selectFood.id">{{food.name}}</div>
            <div class="category_one_name" v-if="food.id !== ui.modal_category.selectFood.id"
                 @click="btnCategoryChoose(food)">{{food.name}}
            </div>
          </div>
        </div>

        <div class="category_blank"></div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnCategoryConfirm">选好了</div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {httpFoodApi} from '../../api/http/lt/httpFoodApi'
  import {cartApi} from '../../api/local/cartApi'
  import {cloneApi} from '../../api/local/cloneApi'
  import TitleBar from '../common/TitleBar'
  import {scrollApi} from '../../api/local/scrollApi'
  import {httpShopApi} from '../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../api/http/lt/httpInfoApi'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {httpOrderAdminApi} from '../../api/http/lt/httpOrderAdminApi'
  import {highlightApi} from '../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '点餐'
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
          title: '点餐',
          backUri: this.roleWaiter ? `/b/${this.$route.params.shortId}/waiter` : `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          v_cover_mask_cart: false,
          v_cover_mask_leaf: false,
          v_cart: false,
          v_category: false,
          v_menu_extend: false,
          groupMode: 'Small',
          modal_category: {
            foodGroupId: null,
            category: null,
            selectFood: null
          },
          selectMenuId: null,
          scrollDelay: null,
          balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
          ballsDrop: []
        },
        http: {
          res: {
            shop: {},
            info: {},
            foodGroups: {}
          }
        }
      }
    },
    created() {
      this.$store.commit('cart/update', cartApi.getCart())

      this.httpShop()
      this.httpInfo()
      this.httpFoodGroup()
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    computed: {
      cart() {
        let cart = this.$store.state.cart
        return cart.cart
      }
    },
    methods: {
      eventFoodAdd(event) {
        if (this.cart.select >= 99) {
          return
        }

        this.$nextTick(() => {
          this.ballDrop(event.target)
        })
      },
      ballDrop(el) {
        for (let i = 0; i < this.ui.balls.length; i++) {
          let ball = this.ui.balls[i]
          if (ball.show === false) {
            ball.show = true
            ball.el = el
            this.ui.ballsDrop.push(ball)
            return
          }
        }
      },
      ballDropBeforeEnter(el) {
        let count = this.ui.balls.length
        while (count--) {
          let ball = this.ui.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - rect.width / 2
            let y = -(window.innerHeight - rect.bottom - rect.height / 2)

            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px,0)`
            el.style.transform = `translate3d(0, ${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      ballDropEnter(el, done) {
        el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(2em, 2em, 0)'
          el.style.transform = 'translate3d(2em, 2em, 0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
          el.addEventListener('transitionend', done)
        })
      },
      ballDropAfterEnter(el) {
        let ball = this.ui.ballsDrop.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
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
      menuBadge(foodGroupId) {
        return cartApi.countByFoodGroupId(foodGroupId)
      },
      navToHash() {
        let hash = window.location.hash

        if (Boolean(hash)) {
          let id = window.location.hash.substring(1)
          let node = document.getElementById(id)
          if (node != null) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let posY = node.getBoundingClientRect().top + scrollTop
            window.scroll(0, posY)
          }
        }
      },
      httpFoodGroup() {
        httpFoodApi.getGroupAll(this.$route.params.shortId, 0, 99).then(res => {
          this.http.res.foodGroups = res

          if (this.http.res.foodGroups.elements.length > 0) {
            this.ui.selectMenuId = this.http.res.foodGroups.elements[0].id

            let haveFood = false
            for (let index in this.http.res.foodGroups.elements) {
              let categories = this.http.res.foodGroups.elements[index].foodCategories
              if (categories.length > 0) {
                haveFood = true
                break
              }
            }

            if (!haveFood) {
              if (this.roleWaiter) {
                this.$router.push(`/b/${this.$route.params.shortId}/waiter/food/empty`)
              } else {
                this.$router.push(`/m/${this.$route.params.shortId}/food/empty`)
              }

              return
            }

          } else {
            if (this.roleWaiter) {
              this.$router.push(`/b/${this.$route.params.shortId}/waiter/food/empty`)
            } else {
              this.$router.push(`/m/${this.$route.params.shortId}/food/empty`)
            }

            return
          }

          for (let index in this.http.res.foodGroups.elements) {
            let categories = this.http.res.foodGroups.elements[index]
            categories.foodCategories.sort(function (a, b) {
              return a.orderIndex - b.orderIndex
            })
          }

          this.computedCartSelect()
          setTimeout(this.navToHash, 100)
        })
      },
      onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

        let groupBoxes = document.querySelectorAll('.food_group_box')
        if (!Boolean(groupBoxes) || groupBoxes.length === 0) {
          return
        }

        let selectId = groupBoxes[0].id.substring('box_'.length)

        for (let index = 0; index < groupBoxes.length; index++) {
          let groupBox = groupBoxes[index]

          if (!Boolean(groupBox.id)) {
            continue
          }

          let foodGroupTop = groupBox.getBoundingClientRect().top + scrollTop

          if (foodGroupTop < scrollTop) {
            let nextIndex = index + 1
            if (nextIndex === groupBoxes.length) {
              nextIndex = groupBoxes.length - 1
            }

            selectId = groupBoxes[nextIndex].id.substring('box_'.length)
          }
        }

        this.selectMenu(selectId)
      },
      isSelectMenu(foodGroupId) {
        return this.ui.selectMenuId === foodGroupId
      },
      selectMenu(foodGroupId, closeLeaf) {
        if (closeLeaf) {
          this.btnLeaf(false)

          setTimeout(function () {
            let node = document.getElementById(foodGroupId)
            if (node != null) {
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
              let posY = node.getBoundingClientRect().top + scrollTop
              window.scroll(0, posY)
            }
          }, 100)
        }

        this.ui.selectMenuId = foodGroupId
        let menu = document.querySelector('.menu')
        let menuItem = document.getElementById('menu_' + foodGroupId)
        let left = menuItem.getBoundingClientRect().left - menuItem.getBoundingClientRect().width

        if (left < 0) {
          menu.scrollLeft = 0
        } else if (menu.scrollLeft < left) {
          menu.scrollLeft = left
        }
      },
      setSelectByFoodCategoryId(foodCategory, select) {
        for (let foodGroupIndex in this.http.res.foodGroups.elements) {
          let foodGroup = this.http.res.foodGroups.elements[foodGroupIndex]

          for (let foodCategoryIndex in foodGroup.foodCategories) {
            let one = foodGroup.foodCategories[foodCategoryIndex]
            if (one.id === foodCategory.id) {
              if (one.status === 'OFFLINE') {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '购物车',
                  content: `${highlightApi.highlight(foodCategory.name)}已下架，请重新加入购物车。`
                })
                return false
              }

              if (one.status === 'SOLD_OUT') {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '购物车',
                  content: `${highlightApi.highlight(foodCategory.name)}已售罄，请重新加入购物车。`
                })
                return false
              }

              one.select = select
              return true
            }
          }
        }

        this.$msgBox.doModal({
          type: 'yes',
          title: '购物车',
          content: `${highlightApi.highlight(foodCategory.name)}已下架，请重新加入购物车。`
        })

        return false
      },
      computedCartSelect() {
        let cart = cartApi.getCart()
        for (let index in cart.foods) {
          let cartFood = cart.foods[index]
          let foodCategoryId = cartFood.category.id

          let select = cartApi.countSelectByFoodCategoryId(foodCategoryId)

          let setOk = this.setSelectByFoodCategoryId(cartFood.category, select)
          if (!setOk) {
            cartApi.removeByFoodCategoryId(foodCategoryId)
            this.$store.commit('cart/update', cartApi.getCart())
          }
        }
      },
      computedFoodSelect() {
        for (let foodGroupIndex in this.http.res.foodGroups.elements) {
          let foodGroup = this.http.res.foodGroups.elements[foodGroupIndex]

          for (let foodCategoryIndex in foodGroup.foodCategories) {
            let foodCategory = foodGroup.foodCategories[foodCategoryIndex]
            foodCategory.select = cartApi.countSelectByFoodCategoryId(foodCategory.id)
          }
        }
      },
      btnGroupMode(mode) {
        this.ui.groupMode = mode
      },
      btnCartFoodAdd(foodGroupId, foodCategory, food) {
        if (this.cart.select >= 99) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '点餐',
            content: '餐食最多允许添加99份，如您有特殊需求请联系服务员。'
          })

          return
        }

        cartApi.increase(foodGroupId, cloneApi.clone(foodCategory), cloneApi.clone(food))
        this.$store.commit('cart/update', cartApi.getCart())
        this.computedCartSelect()
      },
      btnFoodAdd(foodGroupId, foodCategory) {
        if (foodCategory.foods.length === 1) {
          this.btnCartFoodAdd(foodGroupId, foodCategory, foodCategory.foods[0])
        } else {
          this.ui.modal_category.foodGroupId = foodGroupId
          this.ui.modal_category.category = foodCategory
          this.ui.modal_category.selectFood = foodCategory.foods[0]

          this.ui.v_cart = false
          this.ui.v_cover_mask_cart = true
          this.ui.v_category = true
        }
      },
      btnCartFoodMinus(foodCategory, food) {
        cartApi.decrease(cloneApi.clone(foodCategory), cloneApi.clone(food))
        this.$store.commit('cart/update', cartApi.getCart())
        this.computedCartSelect()
        this.computedFoodSelect()

        if (this.cart.select === 0) {
          this.ui.v_cover_mask_cart = false
          this.ui.v_cart = false
          scrollApi.enable(true)
        }
      },
      btnFoodMinus(foodCategory) {
        let selectCategoryCount = 0

        for (let foodIndex in foodCategory.foods) {
          let food = foodCategory.foods[foodIndex]

          let select = cartApi.countSelectByFoodCategoryIdAndFoodId(foodCategory.id, food.id)
          if (select > 0) {
            selectCategoryCount++
          }
        }

        if (selectCategoryCount > 1) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '无法删除',
            content: '同一餐食已选中多个规格，如需删除请打开购物车。'
          })
          return
        }

        for (let foodIndex in foodCategory.foods) {
          let food = foodCategory.foods[foodIndex]

          let select = cartApi.countSelectByFoodCategoryIdAndFoodId(foodCategory.id, food.id)
          if (select > 0) {
            this.btnCartFoodMinus(foodCategory, food)
          }
        }
      },
      btnCategoryChoose(food) {
        this.ui.modal_category.selectFood = food
      },
      btnCategoryConfirm() {
        this.btnCartFoodAdd(this.ui.modal_category.foodGroupId, this.ui.modal_category.category, this.ui.modal_category.selectFood)
        this.ui.v_category = false
        this.ui.v_cover_mask_cart = false
      },
      btnCoverMaskCart() {
        this.ui.v_cover_mask_cart = false
        this.ui.v_cart = false
        this.ui.v_category = false
        this.ui.v_menu_extend = false

        scrollApi.enable(true)
      },
      btnCart() {
        this.ui.v_cart = !this.ui.v_cart
        if (this.ui.v_cart) {
          this.ui.v_cart = !cartApi.isEmpty()
        }

        this.ui.v_cover_mask_cart = this.ui.v_cart
        this.ui.v_category = false

        scrollApi.enable(!this.ui.v_cover_mask_cart)
      },
      btnCartClear() {
        this.ui.v_cart = false
        this.ui.v_cover_mask_cart = false
        scrollApi.enable(true)

        cartApi.clear()
        this.$store.commit('cart/update', cartApi.getCart())

        this.computedFoodSelect()
        this.computedCartSelect()
      },
      orderRouter(res) {
        if (res.currentPageSize > 0) {
          let notPaidCount = 0
          let notPaidOrder = null

          for (let index in res.elements) {
            let order = res.elements[index]
            if (order.status === 'NotPaid') {
              notPaidCount += 1

              if (notPaidOrder == null) {
                notPaidOrder = order
              }
            }
          }

          if (notPaidCount === 1) {
            if (this.roleWaiter) {
              this.$router.push(`/b/${this.$route.params.shortId}/waiter/order/${notPaidOrder.id}/add`)
              return
            } else {
              this.$router.push(`/m/${this.$route.params.shortId}/order/${notPaidOrder.id}/add`)
              return
            }
          }
        }

        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/order/new`)
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/order/new`)
        }
      },
      btnOrder() {
        this.ui.v_category = false
        this.ui.v_cover_mask_cart = false
        this.ui.v_cart = false

        if (!this.http.res.shop.open) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '点餐',
            content: '店铺已打烊。'
          })

          return
        }

        if (Boolean(this.$route.query.tableId)) {
          httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, this.$route.query.tableId, true, 0, 99).then(res => {
            this.orderRouter(res)
          })
        } else {
          httpOrderApi.getAll(this.$route.params.shortId, 1, 0, 20).then(res => {
            this.orderRouter(res)
          })
        }
      },
      btnSearch() {
        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/food/search`)
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/food/search`)
        }
      },
      btnLeaf(extend) {
        this.ui.v_menu_extend = extend
        this.ui.v_cover_mask_leaf = extend

        if (extend) {
          window.scroll(0, 0)
        }

        scrollApi.enable(!extend)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/food';
  @import "Food";
</style>
