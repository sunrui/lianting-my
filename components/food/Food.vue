<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMaskCart}" @click="btnCoverMask"></div>
    </transition>
    <transition name="fade">
      <div :class="{ cover_mask_11: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <transition name="fade">
      <div :class="{ cover_mask_11: ui.vCoverMaskLeaf}" @click="btnLeaf(false)"></div>
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
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎您的光临。'}}</div>
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
          <div class="menu_item" v-if="foodGroup.foodCategories && foodGroup.foodCategories.length > 0" v-for="(foodGroup, index) in http.res.foodGroups.elements">
            <div :id="'menu_' + foodGroup.id"
                 :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
                 @click="selectMenu(index, foodGroup.id, false)">
              <div class="menu_item_badge" v-if="menuBadge(foodGroup.id) > 0">{{menuBadge(foodGroup.id)}}</div>
              <div class="menu_item_label">{{foodGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(foodGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="leaf_box" @click="btnLeaf(true)">
          <div class="leaf"></div>
        </div>
      </div>

      <div class="menu_box_extend" v-if="ui.vMenuExtend">
        <div class="menu_extend">
          <div class="menu_item menu_item_extend" v-if="foodGroup.foodCategories && foodGroup.foodCategories.length > 0" v-for="(foodGroup, index) in http.res.foodGroups.elements">
            <div :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
                 @click="selectMenu(index, foodGroup.id, true)">
              <div class="menu_item_badge" v-if="menuBadge(foodGroup.id) > 0">{{menuBadge(foodGroup.id)}}</div>
              <div class="menu_item_label">{{foodGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(foodGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="leaf_box_extend" @click="btnLeaf(false)">
          <div class="leaf_extend"></div>
        </div>
      </div>

      <div class="food_group_box" :id="'box_' + foodGroup.id" v-if="foodGroup.foodCategories && foodGroup.foodCategories.length > 0"
           v-for="foodGroup in http.res.foodGroups.elements">
        <div class="food_group">
          <div class="food_group_anchor" :id="foodGroup.id"></div>
          <div class="food_group_name">{{foodGroup.name}}</div>
          <div class="food_group_count">({{foodGroup.foodCategories.length}})</div>
          <div class="food_group_mode" v-if="!foodGroup.groupModeBig" @click="btnGroupModeBig(foodGroup, true)">
            <img class="food_group_mode_icon" src="/img/c/food/group_mode_big.png" alt="">
            <div class="food_group_mode_label">大图模式</div>
          </div>
          <div class="food_group_mode" v-else @click="btnGroupModeBig(foodGroup, false)">
            <img class="food_group_mode_icon" src="/img/c/food/group_mode_small.png" alt="">
            <div class="food_group_mode_label">小图模式</div>
          </div>
        </div>

        <div class="box" v-for="(foodCategory, index) in foodGroup.foodCategories" v-lazy-container="{ selector: 'img' }">
          <div class="blank_20" v-if="index !== 0"></div>

          <div v-bind:class="{
          food_big: foodGroup.groupModeBig,
          food: !foodGroup.groupModeBig
          }" class="box_radius">
            <div class="food_category_anchor" :id="foodCategory.id"></div>
            <div v-bind:class="{
            food_image_big_box:foodGroup.groupModeBig,
            food_image_box: !foodGroup.groupModeBig,
            }" class="">
              <img class="food_image" :data-src="foodCategory.image + getXOssProcess()" :alt="foodCategory.name" @click="btnPreview(foodGroup, foodCategory)">
              <div class="addition_item_tag_label food_image_tag" v-if="foodCategory.tagName" v-bind:class="{
                   addition_item_tag_color_1: foodCategory.tagIndex === 1,
                   addition_item_tag_color_2: foodCategory.tagIndex === 2,
                   addition_item_tag_color_3: foodCategory.tagIndex === 3
            }">{{foodCategory.tagName}}
              </div>
            </div>
            <div v-bind:class="{
            food_info_big_box: foodGroup.groupModeBig,
            food_info_box: !foodGroup.groupModeBig,
            }">
              <div class="food_info">
                <div class="food_name">{{foodCategory.name}}</div>
                <div class="food_detail">{{foodCategory.detail}}</div>
                <div v-if="foodCategory.foods && foodCategory.foods.length > 0 && foodCategory.status === 'ONLINE'">
                  <div class="food_price_box">
                    <div class="food_price_now">{{getCategoryOneFood(foodCategory, true).price}}</div>
                    <div class="food_price_original"
                         v-if="getCategoryOneFood(foodCategory, true).price !== getCategoryOneFood(foodCategory, true).originalPrice">
                      {{getCategoryOneFood(foodCategory, true).originalPrice}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="food_button" v-if="foodCategory.foods && foodCategory.foods.length > 0 && foodCategory.status === 'ONLINE'">
                <div v-if="foodCategory.select > 0">
                  <div class="food_button_add" @click="btnFoodAdd($event, foodGroup.id, foodCategory)" @click.stop.prevent="eventFoodAdd($event, foodCategory)"></div>
                  <div class="food_button_count">{{foodCategory.select}}</div>
                  <div class="food_button_minus" @click="btnFoodMinus(foodCategory)"></div>
                </div>
                <div v-else>
                  <div class="food_button_zero" @click="btnFoodAdd($event, foodGroup.id, foodCategory)" @click.stop.prevent="eventFoodAdd($event, foodCategory)"></div>
                </div>
              </div>
            </div>
            <div class="food_status_offline" v-if="foodCategory.status === 'OFFLINE'"></div>
            <div class="food_status_sold_out" v-if="!foodCategory.foods || foodCategory.foods.length === 0 || foodCategory.status === 'SOLD_OUT'"></div>
          </div>

          <div class="blank_20" v-if="index !== foodGroup.foodCategories.length - 1"></div>
        </div>

      </div>

      <div class="blank_100"></div>
    </div>

    <transition name="toggle">
      <div class="cart" v-if="ui.vCart">
        <div class="cart_title">
          <div class="cart_title_label">已选餐食 ({{cart.select}})</div>
          <div class="cart_title_delete">
            <div class="cart_title_delete_icon"></div>
            <div class="cart_title_delete_label" @click="btnCartClear()">清空</div>
          </div>
        </div>

        <div class="cart_box">
          <div v-if="cart.foods" v-for="cartFood in cart.foods">
            <div class="cart_food">
              <div class="box_divide" v-if="cartFood !== cart.foods[0]"></div>

              <div class="cart_food_info">
                <div class="cart_food_name">{{cartFood.category.name}}</div>
                <div class="cart_food_detail">({{cartFood.food.name}})
                </div>
              </div>
              <div class="cart_food_price">{{cartFood.food.price}}</div>
              <div class="cart_food_button">
                <div class="cart_food_button_add"
                     @click="btnCartFoodAdd(cartFood.foodGroupId, cartFood.category, cartFood.food)"></div>
                <label>
                  <input class="cart_food_button_count" type="number"
                         oninput="value=value.replace(/[^0-9]/g,'');
                          if (value.length === 0) value = 1;
                          if (parseInt(value) > 999) value = 999;"
                         @input="btnCartFoodInput($event, cartFood.category, cartFood.food)" v-model="cartFood.select">
                </label>
                <div class="cart_food_button_minus" @click="btnCartFoodMinus(cartFood.category, cartFood.food)"></div>
              </div>
            </div>

            <div class="cart_food_garnish" v-if="cartFood.garnishes && cartFood.garnishes.length > 0">
              <div class="cart_food_garnish_one" v-for="garnish in cartFood.garnishes">
                <div class="cart_food_garnish_one_name">{{garnish.name}} (¥{{garnish.price}})</div>
              </div>
            </div>

          </div>

          <div class="blank_20"></div>
        </div>
      </div>
    </transition>

    <div class="footer">
      <div class="footer_cart_box" @click="btnCart">
        <div v-bind:class="{footer_cart:!ui.vCart, footer_cart_extend: ui.vCart}"></div>
        <div class="footer_cart_badge" v-show="!ui.vCart && cart.select > 0">{{cart.select}}</div>
      </div>
      <div class="footer_price">{{cart.price ? Math.round(parseFloat(cart.price) * 100) / 100 : '0.00'}}</div>
      <div class="footer_button" v-if="cart.select > 0" @click="btnOrder">立即下单</div>
      <div class="footer_button footer_button_gray" v-else>立即下单</div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vCategory">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="category_food">
          <img class="category_food_image" :src="ui.modalCategory.category.image + getXOssProcess()" :alt="ui.modalCategory.selectFood.name">

          <div class="category_food_info">
            <div class="category_food_name">{{ui.modalCategory.category.name}}</div>
            <div class="category_food_detail">已选：{{ui.modalCategory.selectFood.name}}</div>
            <div class="category_food_price">
              <div class="category_food_price_now">{{ui.modalCategory.selectFood.price}}</div>
              <div class="category_food_price_original"
                   v-if="ui.modalCategory.selectFood.price !== ui.modalCategory.selectFood.originalPrice">
                {{ui.modalCategory.selectFood.originalPrice}}
              </div>
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="category_label_box">
          <div class="category_label">规格</div>
          <div class="category_box">
            <div class="category_one" v-if="ui.modalCategory.category.foods" v-for="food in ui.modalCategory.category.foods">
              <div class="category_one_name_select" v-if="food.id === ui.modalCategory.selectFood.id">{{food.name}}</div>
              <div class="category_one_name" v-if="food.id !== ui.modalCategory.selectFood.id"
                   @click="btnCategoryChoose(food)">{{food.name}}
              </div>
            </div>
          </div>
        </div>

<!--        <div class="blank_100"></div>-->
<!--        <div class="box_divide"></div>-->

<!--        <div class="category_label_box">-->
<!--          <div class="category_label">配菜</div>-->
<!--          <div class="category_box">-->
<!--            <div class="category_one" v-if="ui.modalCategory.garnishes" v-for="garnish in ui.modalCategory.garnishes">-->
<!--              <div class="category_one_name_select" v-if="isGarnishChoose(garnish)" @click="btnGarnishUnchoose(garnish)">{{garnish.name}} (¥{{garnish.price}})</div>-->
<!--              <div class="category_one_name" v-else @click="btnGarnishChoose(garnish)">{{garnish.name}} (¥{{garnish.price}})</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <div class="blank_50"></div>
        <div class="blank_30"></div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnCategoryConfirm()">选好了</div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="modal_center preview_modal_center" v-if="ui.vPreview">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <img class="preview_image" :src="ui.modalPreview.foodCategory.image + getXOssProcess()" alt="" @click="btnCoverMask">
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
  import {userApi} from '../../api/local/userApi'
  import {imageApi} from '../../api/local/imageApi'
  import {logApi} from '../../api/local/logApi'

  export default {
    metaInfo: {
      title: '点餐'
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
          title: '点餐',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          loading: true,
          vCoverMask: false,
          vCoverMaskCart: false,
          vCoverMaskLeaf: false,
          vCart: false,
          vCategory: false,
          vMenuExtend: false,
          vPreview: false,
          modalCategory: {
            foodGroupId: null,
            category: null,
            selectFood: null,
            selectEvent: null,
            garnishes: [],
            selectGarnishes: []
          },
          modalPreview: {
            foodGroup: null,
            foodCategory: null,
          },
          selectMenuId: null,
          balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
          ballsDrop: [],
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
    },
    mounted() {
      if (this.roleType === 'c') {
        this.title.backUri = `/c/${this.$route.params.shortId}`
      } else {
        this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}`
      }

      window.addEventListener('scroll', this.onScroll)

      this.httpShop()
      this.httpInfo()
      this.httpFoodGroup()
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },
    computed: {
      cart() {
        let cart = this.$store.state.cart
        return cart.cart
      }
    },
    methods: {
      getXOssProcess() {
        return imageApi.getXOssProcess()
      },
      eventFoodAdd(event, foodCategory) {
        if (this.cart.select >= 999) {
          return
        }

        if (!foodCategory.foods || foodCategory.foods.length > 1) {
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
          let rect = el.getBoundingClientRect()
          let x = rect.left + rect.width / 2
          let y = -rect.height / 2

          el.style.webkitTransform = `translate3d(${x}px, ${y}px, 0)`
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
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
            scrollApi.scrollAnimation(0, posY)
          }
        }
      },
      getCategoryOneFood(foodCategory, cheaper) {
        let selectFood = foodCategory.foods[0]

        for (let index in foodCategory.foods) {
          let food = foodCategory.foods[index]

          if (cheaper) {
            if (food.price < selectFood.price) {
              selectFood = food
            }
          } else {
            if (food.price > selectFood.price) {
              selectFood = food
            }
          }
        }

        return selectFood
      },
      httpFoodGroup() {
        httpFoodApi.getGroupAll(this.$route.params.shortId, 0, 999).then(res => {
          this.http.res.foodGroups = res
          let haveFood = false

          if (res.elements.length > 0) {
            for (let index in res.elements) {
              let categories = res.elements[index].foodCategories
              if (categories && categories.length > 0) {
                haveFood = true
                break
              }
            }
          }

          if (!haveFood) {
            if (this.roleType === 'c') {
              this.$router.push(`/c/${this.$route.params.shortId}/food/empty`)
            } else {
              this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/food/empty`)
            }

            return
          }

          res.elements.sort(function (a, b) {
            if (a.orderIndex !== b.orderIndex) {
              return a.orderIndex - b.orderIndex
            }

            return a.createdAt - b.createdAt
          })

          for (let index in res.elements) {
            let foodGroup = res.elements[index]
            if (foodGroup.foodCategories && foodGroup.foodCategories.length > 0) {
              foodGroup.foodCategories.sort(function (a, b) {
                if (a.orderIndex !== b.orderIndex) {
                  return a.orderIndex - b.orderIndex
                }

                return a.createdAt - b.createdAt
              })
            }
          }

          this.http.res.foodGroups = res
          this.ui.selectMenuId = res.elements[0].id
          this.computedCartSelect()
          this.ui.loading = false
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
            let nextIndex = index
            if (nextIndex === groupBoxes.length) {
              nextIndex = groupBoxes.length - 1
            }

            selectId = groupBoxes[nextIndex].id.substring('box_'.length)
          }
        }

        this.scrollMenu(selectId)
      },
      isSelectMenu(foodGroupId) {
        return this.ui.selectMenuId === foodGroupId
      },
      scrollMenu(selectId) {
        this.ui.selectMenuId = selectId
        let menu = document.querySelector('.menu')
        let menuItem = document.getElementById('menu_' + selectId)
        let left = menuItem.getBoundingClientRect().left - menuItem.getBoundingClientRect().width

        if (left < 0) {
          menu.scrollLeft = 0
        } else if (menu.scrollLeft < left) {
          menu.scrollLeft = left
        }
      },
      selectMenu(index, selectId, closeLeaf) {
        if (closeLeaf) {
          this.btnLeaf(false)
        }

        if (index === 0) {
          scrollApi.scrollAnimation(document.documentElement.scrollTop || document.body.scrollTop, 0)
          return
        }

        setTimeout(function () {
          let node = document.getElementById(selectId)
          if (node != null) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let posY = node.getBoundingClientRect().top + scrollTop
            scrollApi.scrollAnimation(document.documentElement.scrollTop || document.body.scrollTop, posY)
          }
        }, 100)
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
                  content: `${highlightApi.highlight(foodCategory.name)}已下架。`
                })
                return false
              }

              if (one.status === 'SOLD_OUT') {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '购物车',
                  content: `${highlightApi.highlight(foodCategory.name)}已售罄。`
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
          content: `${highlightApi.highlight(foodCategory.name)}已下架。`
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
      btnGroupModeBig(foodGroup, groupModeBig) {
        foodGroup.groupModeBig = groupModeBig
      },
      btnCartFoodAdd(foodGroupId, foodCategory, food) {
        if (this.cart.select >= 999) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '点餐',
            content: '餐食最多允许添加999份，如您有特殊需求请联系服务员。'
          })

          return
        }

        cartApi.increase(foodGroupId, cloneApi.clone(foodCategory), cloneApi.clone(food), this.ui.modalCategory.selectGarnishes)

        this.$store.commit('cart/update', cartApi.getCart())
        this.computedCartSelect()
      },
      btnFoodAdd(event, foodGroupId, foodCategory) {
        this.ui.modalCategory.selectGarnishes = []
        this.ui.modalCategory.garnishes = []

        if (foodCategory.foods && foodCategory.foods.length === 1) {
          this.btnCartFoodAdd(foodGroupId, foodCategory, foodCategory.foods[0])
        } else {
          this.ui.modalCategory.foodGroupId = foodGroupId
          this.ui.modalCategory.category = foodCategory
          this.ui.modalCategory.selectFood = this.getCategoryOneFood(foodCategory, false)
          this.ui.modalCategory.selectEvent = event

          // this.httpFoodGarnish(foodCategory.id)

          scrollApi.enable(false)
          this.ui.vCart = false
          this.ui.vCoverMaskCart = true
          this.ui.vCategory = true
        }
      },
      btnCartFoodInput(event, foodCategory, food) {
        let select = event.currentTarget.value
        select = parseInt(select)

        if (select <= 0) {
          event.currentTarget.value = 1
        }

        if (select > 999) {
          event.currentTarget.value = 999
        }

        select = event.currentTarget.value
        select = parseInt(select)

        cartApi.update(cloneApi.clone(foodCategory), cloneApi.clone(food), select)
        this.$store.commit('cart/update', cartApi.getCart())
        this.computedCartSelect()
        this.computedFoodSelect()

        if (this.cart.select === 0) {
          this.ui.vCoverMaskCart = false
          this.ui.vCart = false
          scrollApi.enable(true)
        }
      },
      btnCartFoodMinus(foodCategory, food) {
        cartApi.decrease(cloneApi.clone(foodCategory), cloneApi.clone(food))
        this.$store.commit('cart/update', cartApi.getCart())
        this.computedCartSelect()
        this.computedFoodSelect()

        if (this.cart.select === 0) {
          this.ui.vCoverMaskCart = false
          this.ui.vCart = false
          scrollApi.enable(true)
        }
      },
      btnFoodMinus(foodCategory) {
        let selectCategoryCount = 0

        if (!Boolean(foodCategory.foods)) {
          foodCategory.foods = []
        }

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
        this.ui.modalCategory.selectFood = food
      },
      isGarnishChoose(garnish) {
        for (let index in this.ui.modalCategory.selectGarnishes) {
          let garnishOne = this.ui.modalCategory.selectGarnishes[index]
          if (garnishOne.id === garnish.id) {
            return true
          }
        }

        return false
      },
      btnGarnishChoose(garnish) {
        if (this.ui.modalCategory.selectGarnishes.length >= 5) {
          this.btnCoverMask()

          this.$msgBox.doModal({
            type: 'yes',
            title: '选择配菜',
            content: '您最多可以选择 5 个配菜。'
          })

          return
        }

        for (let index in this.ui.modalCategory.selectGarnishes) {
          let garnishOne = this.ui.modalCategory.selectGarnishes[index]
          if (garnishOne.id === garnish.id) {
            return true
          }
        }

        this.ui.modalCategory.selectGarnishes.push(garnish)
      },
      btnGarnishUnchoose(garnish) {
        for (let index in this.ui.modalCategory.selectGarnishes) {
          let garnishOne = this.ui.modalCategory.selectGarnishes[index]
          if (garnishOne.id === garnish.id) {
            this.ui.modalCategory.selectGarnishes.splice(index, 1)
            break
          }
        }
      },
      btnCategoryConfirm() {
        scrollApi.enable(true)
        this.btnCartFoodAdd(this.ui.modalCategory.foodGroupId, this.ui.modalCategory.category, this.ui.modalCategory.selectFood)
        this.ui.vCategory = false
        this.ui.vCoverMaskCart = false

        this.$nextTick(() => {
          this.ballDrop(this.ui.modalCategory.selectEvent.target)
        })
      },
      btnCoverMask() {
        this.ui.vCoverMask = false
        this.ui.vCoverMaskCart = false
        this.ui.vCoverMaskLeaf = false
        this.ui.vCart = false
        this.ui.vCategory = false
        this.ui.vMenuExtend = false
        this.ui.vPreview = false

        scrollApi.enable(true)
      },
      btnCart() {
        this.ui.vCart = !this.ui.vCart
        if (this.ui.vCart) {
          this.ui.vCart = !cartApi.isEmpty()
        }

        this.ui.vCoverMaskCart = this.ui.vCart
        this.ui.vCategory = false

        scrollApi.enable(!this.ui.vCoverMaskCart)
      },
      btnCartClear() {
        this.ui.vCart = false
        this.ui.vCoverMaskCart = false
        scrollApi.enable(true)

        cartApi.clearAll()
        this.$store.commit('cart/update', cartApi.getCart())

        this.computedFoodSelect()
        this.computedCartSelect()
      },
      btnOrder() {
        scrollApi.enable(true)

        this.ui.vCategory = false
        this.ui.vCoverMaskCart = false
        this.ui.vCart = false

        if (!this.http.res.shop.open) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '点餐',
            content: '店铺已打烊。'
          })

          return
        }

        if (Boolean(this.$route.query.tableId)) {
          httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, this.$route.query.tableId, true, 0, 999).then(res => {
            if (res.currentPageSize > 0) {
              if (this.roleType === 'c') {
                this.$router.push(`/c/${this.$route.params.shortId}/order/add`)
              } else {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/add`)
              }

              return
            }

            if (this.roleType === 'c') {
              this.$router.push(`/c/${this.$route.params.shortId}/order/new`)
            } else {
              this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/new`)
            }
          })
        } else {
          let captchaTableId = userApi.getCaptchaTableId()
          if (!Boolean(captchaTableId)) {
            if (this.roleType === 'c') {
              this.$router.push(`/c/${this.$route.params.shortId}/order/new`)
            } else {
              this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/new`)
            }

            return
          }

          if (this.roleType === 'c') {
            this.$router.push(`/c/${this.$route.params.shortId}/order/add`)
          } else {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/add`)
          }
        }
      },
      btnSearch() {
        if (this.roleType === 'c') {
          this.$router.push(`/c/${this.$route.params.shortId}/food/search`)
        } else {
          this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/food/search`)
        }
      },
      btnLeaf(extend) {
        this.ui.vMenuExtend = extend
        this.ui.vCoverMaskLeaf = extend

        if (extend) {
          window.scroll(0, 0)
        }

        scrollApi.enable(!extend)
      },
      btnPreview(foodGroup, foodCategory) {
        if (foodGroup.groupModeBig) {
          return
        }

        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.modalPreview.foodGroup = foodGroup
        this.ui.modalPreview.foodCategory = foodCategory
        this.ui.vPreview = true
      },
      httpFoodGarnish(categoryId) {
        httpFoodApi.getGarnish(this.$route.params.shortId, categoryId, 0, 10).then(res => {
          this.ui.modalCategory.garnishes = res.elements
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/food';
  @import '~assets/c/shop';
  @import "Food";
</style>
