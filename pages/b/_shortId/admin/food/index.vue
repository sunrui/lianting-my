<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="content_box">
      <div class="blank_10"></div>

      <div class="menu_box">
        <div class="menu">
          <div class="menu_item" v-for="foodGroup in http.res.foodGroups.elements">
            <a :id="'menu_' + foodGroup.id"
               :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
               :href="'#' + foodGroup.id" @click="selectMenu(foodGroup.id, false)">
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
        </div>

        <div class="food_box box" @click="btnChangeStatus(foodCategory)" v-for="foodCategory in foodGroup.foodCategories">
          <div class="blank_10"></div>

          <div class="food box_radius">
            <div class="food_category_anchor" :id="foodCategory.id"></div>
            <img class="food_image" :src="foodCategory.image">
            <div v-if="foodCategory.tagName" v-bind:class="{
            addition_item_tag_color_1: foodCategory.tagIndex === 1,
            addition_item_tag_color_2: foodCategory.tagIndex === 2,
            addition_item_tag_color_3: foodCategory.tagIndex === 3
            }" class="addition_item_tag_label food_image_tag"
            >{{foodCategory.tagName}}
            </div>

            <div class="food_info">
              <div class="food_name">{{foodCategory.name}}</div>
              <div class="food_detail">{{foodCategory.detail}}</div>
              <div v-if="foodCategory.foods.length > 0">
                <div class="food_price_box">
                  <div class="food_price_now">{{foodCategory.foods[0].price}}</div>
                  <div class="food_price_original"
                       v-if="foodCategory.foods[0].price !== foodCategory.foods[0].originalPrice">
                    {{foodCategory.foods[0].originalPrice}}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="food_status_online" v-if="foodCategory.status === 'ONLINE'"></div>
              <div class="food_status_offline" v-if="foodCategory.status === 'OFFLINE'"></div>
              <div class="food_status_sold_out" v-if="foodCategory.status === 'SOLD_OUT'"></div>
            </div>
          </div>

          <div class="blank_20" v-if="foodCategory !== foodGroup.foodCategories[foodGroup.foodCategories.length - 1]"></div>
          <div class="blank_10" v-if="foodCategory === foodGroup.foodCategories[foodGroup.foodCategories.length - 1]"></div>
        </div>

      </div>

      <div class="blank_30"></div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.v_select_status">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png">
        </div>

        <div class="modal_title">选择状态</div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'ONLINE'}"
             @click="btnChooseStatus('ONLINE')">上架中
        </div>
        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'OFFLINE'}"
             @click="btnChooseStatus('OFFLINE')">下架中
        </div>
        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'SOLD_OUT'}"
             @click="btnChooseStatus('SOLD_OUT')">已售罄
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnChangeStatusConfirm">确认</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'
  import { httpInfoApi } from '../../../../../api/http/ltorder/httpInfoApi'
  import { httpFoodApi } from '../../../../../api/http/ltorder/httpFoodApi'
  import { httpFoodAdminApi } from '../../../../../api/http/ltorder/httpFoodAdminApi'
  import { scrollApi } from '../../../../../api/local/scrollApi'
  import { highlightApi } from '../../../../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '上下架餐食'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '上下架餐食',
          backUri: `/b/${this.$route.params.shortId}/admin`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          v_menu_extend: false,
          v_cover_mask: false,
          v_select_status: false,
          selectMenuId: null,
          status: {
            foodCategory: null,
            selectStatus: ''
          }
        },
        http: {
          req: {
            group: {
              name: ''
            }
          },
          res: {
            shop: {},
            info: {},
            foodGroups: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
      this.httpFoodGroup()
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    methods: {
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
      btnCoverMask() {
        this.ui.v_group_add = false
        this.ui.v_group_edit = false
        this.ui.v_menu_extend = false
        this.ui.v_select_status = false
        this.ui.v_cover_mask = false

        scrollApi.enable(true)
      },
      navToHash() {
        let hash = window.location.hash

        if (Boolean(hash)) {
          let id = window.location.hash.substring(1)
          let node = document.getElementById(id)
          if (node != null) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
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
          }

          for (let groupIndex in this.http.res.foodGroups.elements) {
            let categories = this.http.res.foodGroups.elements[groupIndex]
            categories.foodCategories.sort(function(a, b) {
              return a.orderIndex - b.orderIndex
            })
          }

          setTimeout(this.navToHash, 100)
        })
      },
      onScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

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

          setTimeout(function() {
            let node = document.getElementById(foodGroupId)
            if (node != null) {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
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
      btnLeaf(extend) {
        this.ui.v_menu_extend = extend
        this.ui.v_cover_mask = extend

        if (extend) {
          window.scroll(0, 0)
        }

        scrollApi.enable(!extend)
      },
      btnChooseStatus(status) {
        this.ui.status.selectStatus = status
      },
      btnChangeStatus(foodCategory) {
        this.ui.v_cover_mask = true
        this.ui.v_select_status = true

        this.ui.status.foodCategory = foodCategory
        this.ui.status.selectStatus = foodCategory.status
      },
      btnChangeStatusConfirm() {
        this.ui.status.foodCategory.status = this.ui.status.selectStatus

        httpFoodAdminApi.putCategory(this.$route.params.shortId, this.ui.status.foodCategory).then(res => {
          this.ui.v_select_status = false
          this.ui.v_cover_mask = false

          if (res.foodCategoryIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: foodCategory.name,
              content: '餐食不存在。'
            })
          } else if (res.success) {
            this.httpFoodGroup()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/food';
</style>
