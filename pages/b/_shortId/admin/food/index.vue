<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="blank_50"></div>
    <div class="blank_40"></div>

    <div class="content_box">
      <div class="blank_10"></div>

      <div class="menu_box">
        <div class="menu">
          <div class="menu_item" v-if="foodGroup.foodCategories.length > 0" v-for="(foodGroup, index) in http.res.foodGroups.elements">
            <div :id="'menu_' + foodGroup.id"
                 :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
                 @click="selectMenu(index, foodGroup.id, false)">
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
          <div class="menu_item menu_item_extend" v-if="foodGroup.foodCategories.length > 0" v-for="(foodGroup, index) in http.res.foodGroups.elements">
            <div :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
                 @click="selectMenu(index, foodGroup.id, true)">
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

      <div class="food_group_box" :id="'box_' + foodGroup.id" v-if="foodGroup.foodCategories.length > 0" v-for="foodGroup in http.res.foodGroups.elements">
        <div class="food_group">
          <div class="food_group_anchor" :id="foodGroup.id"></div>
          <div class="food_group_name">{{foodGroup.name}}</div>
          <div class="food_group_count">({{foodGroup.foodCategories.length}})</div>
        </div>

        <div class="box" @click="btnChangeStatus(foodCategory)" v-for="(foodCategory, index) in foodGroup.foodCategories">
          <div class="blank_20" v-if="index !== 0"></div>

          <div class="food box_radius">
            <div class="food_category_anchor" :id="foodCategory.id"></div>
            <div class="food_image_box">
              <img class="food_image" :src="foodCategory.image" :alt="foodCategory.name">
              <div class="addition_item_tag_label food_image_tag" v-if="foodCategory.tagName" v-bind:class="{
                   addition_item_tag_color_1: foodCategory.tagIndex === 1,
                   addition_item_tag_color_2: foodCategory.tagIndex === 2,
                   addition_item_tag_color_3: foodCategory.tagIndex === 3
            }">{{foodCategory.tagName}}
              </div>
            </div>
            <div class="food_info_box">
              <div class="food_info">
                <div class="food_name">{{foodCategory.name}}</div>
                <div class="food_detail">{{foodCategory.detail}}</div>
                <div v-if="foodCategory.foods && foodCategory.foods.length > 0">
                  <div class="food_price_box">
                    <div class="food_price_now">{{foodCategory.foods[0].price}}</div>
                    <div class="food_price_original" v-if="foodCategory.foods[0].price !== foodCategory.foods[0].originalPrice">
                      {{foodCategory.foods[0].originalPrice}}
                    </div>
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

          <div class="blank_20" v-if="index !== foodGroup.foodCategories.length - 1"></div>
          <div class="blank_10" v-if="index === foodGroup.foodCategories.length - 1"></div>
        </div>

      </div>

      <div class="blank_30"></div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vSelectStatus">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">选择状态</div>

        <div class="modal_menu" v-if="ui.status.foodCategory.status !== 'ONLINE'" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'ONLINE'}"
             @click="btnChooseStatus('ONLINE')">上架中
        </div>
        <div class="modal_menu" v-if="ui.status.foodCategory.status !== 'OFFLINE'" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'OFFLINE'}"
             @click="btnChooseStatus('OFFLINE')">下架中
        </div>
        <div class="modal_menu" v-if="ui.status.foodCategory.status !== 'SOLD_OUT'" v-bind:class="{modal_menu_select: ui.status.selectStatus === 'SOLD_OUT'}"
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
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../../api/http/lt/httpInfoApi'
  import {httpFoodAdminApi} from '../../../../../api/http/lt/httpFoodAdminApi'
  import {scrollApi} from '../../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '上下架餐食'
    },
    middleware: 'auth',
    components: {TitleBar},
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
          loading: true,
          vMenuExtend: false,
          vCoverMask: false,
          vSelectStatus: false,
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
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
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
        this.ui.vMenuExtend = false
        this.ui.vSelectStatus = false
        this.ui.vCoverMask = false

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
        httpFoodAdminApi.getGroupAll(this.$route.params.shortId, 0, 99).then(res => {
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
            this.$router.push(`/b/${this.$route.params.shortId}/admin/food/empty`)
            return
          }

          for (let index in res.elements) {
            let foodGroup = res.elements[index]
            this.$set(foodGroup, 'groupMode', 'Small')
            if (foodGroup.foodCategories && foodGroup.foodCategories.length > 0) {
              foodGroup.foodCategories.sort(function (a, b) {
                return a.orderIndex - b.orderIndex
              })
            }
          }

          this.ui.selectMenuId = res.elements[0].id
          this.http.res.foodGroups = res

          this.ui.loading = false
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
          scrollApi.scrollAnimation(scrollApi.getCurrentY(), 0)
          return
        }

        setTimeout(function () {
          let node = document.getElementById(selectId)
          if (node != null) {
            let posY = node.getBoundingClientRect().top + scrollApi.getCurrentY()
            scrollApi.scrollAnimation(scrollApi.getCurrentY(), posY)
          }
        }, 100)
      },
      btnLeaf(extend) {
        this.ui.vMenuExtend = extend
        this.ui.vCoverMask = extend

        if (extend) {
          window.scroll(0, 0)
        }

        scrollApi.enable(!extend)
      },
      btnChooseStatus(status) {
        this.ui.status.selectStatus = status
      },
      btnChangeStatus(foodCategory) {
        this.ui.vCoverMask = true
        this.ui.vSelectStatus = true

        this.ui.status.foodCategory = foodCategory
        this.ui.status.selectStatus = foodCategory.status
      },
      btnChangeStatusConfirm() {
        httpFoodAdminApi.putCategoryStatus(this.$route.params.shortId, this.ui.status.foodCategory.id, this.ui.status.selectStatus).then(res => {
          this.ui.vSelectStatus = false
          this.ui.vCoverMask = false

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
  @import '~assets/c/food';
  @import '~assets/c/shop';
</style>
