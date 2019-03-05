<template>
  <div>
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
          <div class="menu_item" v-for="(foodGroup, index) in http.res.foodGroups.elements">
            <div :id="'menu_' + foodGroup.id"
               :class="{menu_item_href:!isSelectMenu(foodGroup.id), menu_item_href_select:isSelectMenu(foodGroup.id)}"
               @click="selectMenu(index, foodGroup.id, false)">
              <div class="badge_delete menu_item_badge_delete" @click="btnGroupDelete(foodGroup)"></div>
              <div class="menu_item_label">{{foodGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(foodGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="leaf_box" @click="btnGroupAdd()">
          <div class="add"></div>
        </div>
      </div>

      <div class="empty_center" v-if="http.res.foodGroups.elements.length === 0">
        <img class="empty_image" src="/img/no/no_food.png" alt="餐食">
        <div class="empty_label">要添加餐食组，请点击右上角 + 号。</div>
      </div>
      <div class="food_group_box" v-else :id="'box_' + foodGroup.id" v-for="foodGroup in http.res.foodGroups.elements">
        <div class="food_group">
          <div class="food_group_anchor" :id="foodGroup.id"></div>
          <div class="food_group_name" @click="btnGroupEdit(foodGroup)">{{foodGroup.name}}</div>
          <div class="food_group_count">({{foodGroup.foodCategories.length}})</div>
          <div class="food_group_order">
            <div class="food_group_order_icon"></div>
            <div class="food_group_order_label" @click="btnOrder(foodGroup)">排序</div>
          </div>
        </div>

        <div class="box" v-for="(foodCategory, index) in foodGroup.foodCategories">
          <div class="blank_20" v-if="index !== 0"></div>

          <div class="food box_radius">
            <div class="badge_delete" @click="btnCategoryDelete(foodCategory)"></div>
            <div class="food_category_anchor" :id="foodCategory.id"></div>
            <div class="food_image_box" @click="btnCategory(foodCategory)">
              <img class="food_image" :src="foodCategory.image" :alt="foodCategory.name">
              <div class="addition_item_tag_label food_image_tag" v-if="foodCategory.tagName" v-bind:class="{
                   addition_item_tag_color_1: foodCategory.tagIndex === 1,
                   addition_item_tag_color_2: foodCategory.tagIndex === 2,
                   addition_item_tag_color_3: foodCategory.tagIndex === 3
            }">{{foodCategory.tagName}}
              </div>
            </div>
            <div class="food_info_box">
              <div class="food_info" @click="btnCategory(foodCategory)">
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
            </div>
            <div @click="btnCategory(foodCategory)">
              <div class="food_status_online" v-if="foodCategory.status === 'ONLINE'"></div>
              <div class="food_status_offline" v-if="foodCategory.status === 'OFFLINE'"></div>
              <div class="food_status_sold_out" v-if="foodCategory.status === 'SOLD_OUT'"></div>
            </div>
          </div>

          <div class="blank_20" v-if="index !== foodGroup.foodCategories.length - 1"></div>
          <div class="blank_10" v-if="index === foodGroup.foodCategories.length - 1"></div>
        </div>

        <div class="box">
          <div class="food_add box_radius" @click="btnCategoryAdd(foodGroup)">
            <div class="food_add_icon"></div>
            <div class="food_add_label">添加餐食</div>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </div>

    <div class="modal_center" v-if="ui.v_group_add">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">添加餐食组</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" placeholder="请输入餐食组名称" maxlength="10" v-model="http.req.group.name">
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" @click="btnGroupAddConfirm">确定</div>
      </div>
    </div>

    <div class="modal_center" v-if="ui.v_group_edit">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">编辑餐食组</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" placeholder="请输入新餐食组名称" maxlength="10" v-model="http.req.group.name">
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" @click="btnGroupEditConfirm">确定</div>
      </div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../../api/http/lt/httpInfoApi'
  import {httpFoodAdminApi} from '../../../../../api/http/lt/httpFoodAdminApi'
  import {highlightApi} from '../../../../../api/local/highlightApi'
  import {scrollApi} from '../../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '餐食'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '餐食',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          vCoverMask: false,
          v_group_add: false,
          v_group_edit: false,
          selectMenuId: null
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
            foodGroups: {
              elements: []
            }
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
        this.ui.vCoverMask = false
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
        httpFoodAdminApi.getGroupAll(this.$route.params.shortId, 0, 0, 99).then(res => {
          this.http.res.foodGroups = res

          if (this.http.res.foodGroups.elements.length > 0) {
            this.ui.selectMenuId = this.http.res.foodGroups.elements[0].id
          }

          for (let groupIndex in this.http.res.foodGroups.elements) {
            let categories = this.http.res.foodGroups.elements[groupIndex]
            categories.foodCategories.sort(function (a, b) {
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
      btnOrder(foodGroup) {
        if (foodGroup.foodCategories.length === 0) {
          return
        }

        this.$router.push(`/b/${this.$route.params.shortId}/owner/food/group/${foodGroup.id}/order`)
      },
      btnGroupAdd() {
        this.ui.vCoverMask = true
        this.ui.v_group_add = true
        this.http.req.group.name = ''
      },
      btnGroupEdit(foodGroup) {
        this.ui.vCoverMask = true
        this.ui.v_group_edit = true
        this.http.req.group.id = foodGroup.id
        this.http.req.group.name = foodGroup.name
        this.http.req.group.orderIndex = foodGroup.orderIndex
      },
      btnGroupAddConfirm() {
        httpFoodAdminApi.postGroup(this.$route.params.shortId, this.http.req.group).then(res => {
          this.ui.v_group_add = false
          this.ui.vCoverMask = false

          if (res.let) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食组',
              content: '已超过当前授权最大数目限制，如需升级授权请转至续费页或联系我们。'
            })
            return
          }

          if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食组',
              content: '名称已存在。'
            })
            return
          }

          if (res.foodGroupId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食组',
              content: '添加成功。'
            }).then(async (val) => {
              this.httpFoodGroup()
            })
          }
        })
      },
      btnGroupEditConfirm() {
        httpFoodAdminApi.putGroup(this.$route.params.shortId, this.http.req.group.id, this.http.req.group).then(res => {
          this.ui.v_group_edit = false
          this.ui.vCoverMask = false

          if (res.foodGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐食组',
              content: '餐食组不存在。'
            })
          } else if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐食组',
              content: '名称已存在。'
            })
          } else if (res.success) {
            this.httpFoodGroup()
          }
        })
      },
      btnGroupDelete(foodGroup) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除餐食组',
          content: `当前组下所有的餐食将会被删除，确定要删除${highlightApi.highlight(foodGroup.name)}吗？`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpFoodAdminApi.deleteGroup(this.$route.params.shortId, foodGroup.id).then(res => {
              if (res.foodGroupIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除餐食组',
                  content: '餐食组不存在。'
                })
              } else if (res.success) {
                this.httpFoodGroup()
              }
            })
          }
        })
      },
      btnCategory(foodCategory) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/food/category/${foodCategory.id}`)
      },
      btnCategoryDelete(foodCategory) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除餐食',
          content: `确定要删除${highlightApi.highlight(foodCategory.name)}吗？`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpFoodAdminApi.deleteCategory(this.$route.params.shortId, foodCategory.id).then(res => {
              if (res.foodCategoryIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除餐食',
                  content: '餐食不存在。'
                })
              } else if (res.success) {
                this.httpFoodGroup()
              }
            })
          }
        })
      },
      btnCategoryAdd(foodGroup) {
        this.$router.push({
          path: `/b/${this.$route.params.shortId}/owner/food/category/create`,
          query: {
            foodGroupId: foodGroup.id
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/food';
</style>
