<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎您的光临。'}}</div>
    </div>

    <div class="blank_50"></div>
    <div class="blank_40"></div>

    <div class="content_box">
      <div class="blank_10"></div>

      <div class="menu_box">
        <div class="menu" id="food_group_item">
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
        <img class="empty_image" data-src="/img/no/no_food.png" alt="餐食">
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
              <img class="food_image" :data-src="foodCategory.image + getXOssProcess()" :alt="foodCategory.name">
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
                <div v-if="foodCategory.foods && foodCategory.foods.length > 0">
                  <div class="food_price_box">
                    <div class="food_price_now">{{getCheaperFood(foodCategory).price}}</div>
                    <div class="food_price_original"
                         v-if="getCheaperFood(foodCategory).price !== getCheaperFood(foodCategory).originalPrice">
                      {{getCheaperFood(foodCategory).originalPrice}}
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
          <div class="blank_10"></div>
          <div class="food_add box_radius" @click="btnCategoryAdd(foodGroup)">
            <div class="food_add_icon"></div>
            <div class="food_add_label">添加餐食</div>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </div>

    <div class="modal_center" v-if="ui.vGroupAdd">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" data-src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">添加餐食组</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <label>
            <input class="modal_input" placeholder="请输入餐食组名称，如：热菜。" minlength="1" maxlength="20" v-model="http.req.group.name">
          </label>
        </div>
      </div>

      <div class="addition">
        <div class="addition_item">
          <div class="addition_item_label">默认启用大图模式</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.group.groupModeBig" @click="btnGroupModeBig(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnGroupModeBig(true)"></div>
          </div>
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" v-if="http.req.group.name" @click="btnGroupAddConfirm">确定</div>
        <div class="button_big button_gray" v-else>确定</div>
      </div>
    </div>

    <div class="modal_center" v-if="ui.vGroupEdit">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" data-src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">更新餐食组</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <label>
            <input class="modal_input" placeholder="请输入新餐食组名称" minlength="1" maxlength="20" v-model="http.req.group.name">
          </label>
        </div>
      </div>

      <div class="addition">
        <div class="addition_item">
          <div class="addition_item_label">默认启用大图模式</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.group.groupModeBig" @click="btnGroupModeBig(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnGroupModeBig(true)"></div>
          </div>
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" v-if="http.req.group.name" @click="btnGroupEditConfirm">确定</div>
        <div class="button_big button_gray" v-else>确定</div>
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
  import {imageApi} from '../../../../../api/local/imageApi'

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
          vGroupAdd: false,
          vGroupEdit: false,
          selectMenuId: null,
          sortable: null
        },
        http: {
          req: {
            group: {
              name: '',
              groupModeBig: false
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
    mounted() {
      window.addEventListener('scroll', this.onScroll)

      this.httpShop()
      this.httpInfo()
      this.httpFoodGroup()
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)

      if (this.ui.sortable) {
        this.ui.sortable.destroy()
        this.ui.sortable = null
      }
    },
    methods: {
      getXOssProcess() {
        return imageApi.getXOssProcess()
      },
      sortableFoodGroup() {
        let {Sortable} = require('sortablejs')
        let el = document.getElementById('food_group_item')

        let pThis = this

        this.ui.sortable = new Sortable(el, {
          animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
          easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
          preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
          swapThreshold: 1, // Threshold of the swap zone
          invertSwap: false, // Will always use inverted swap zone if set to true
          invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
          direction: 'horizontal', // Direction of Sortable (will be detected automatically if not given)
          forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
          fallbackClass: 'sortable-fallback',  // Class name for the cloned DOM Element when using forceFallback
          fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
          fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
          dragoverBubble: false,
          removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
          emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
          setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
            dataTransfer.setData('Text', dragEl.textContent) // `dataTransfer` object of HTML5 DragEvent
          },
          // Element dragging ended
          onEnd: function (/**Event*/evt) {
            if (evt.oldIndex === evt.newIndex) {
              return
            }

            let oldFoodGroup = pThis.http.res.foodGroups.elements[evt.oldIndex]
            let newFoodGroup = pThis.http.res.foodGroups.elements[evt.newIndex]

            for (let index in pThis.http.res.foodGroups.elements) {
              if (parseInt(index) === parseInt(evt.oldIndex)) {
                pThis.http.res.foodGroups.elements[index] = newFoodGroup
              } else if (parseInt(index) === parseInt(evt.newIndex)) {
                pThis.http.res.foodGroups.elements[index] = oldFoodGroup
              }
            }

            for (let index in pThis.http.res.foodGroups.elements) {
              let foodGroup = pThis.http.res.foodGroups.elements[index]
              pThis.http.res.foodGroups.elements[index].orderIndex = parseInt(index)
              foodGroup.orderIndex = parseInt(index)

              httpFoodAdminApi.putGroup(pThis.$route.params.shortId, foodGroup.id, foodGroup).then(res => {
                if (res.foodGroupIdNotExists) {
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '更新餐食组',
                    content: '餐食组不存在。'
                  })
                } else if (res.nameExists) {
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '更新餐食组',
                    content: '餐食组名称重复。'
                  })
                } else if (res.success) {
                  location.reload()
                }
              })
            }
          }
        })
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
      btnCoverMask() {
        this.ui.vGroupAdd = false
        this.ui.vGroupEdit = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)
      },
      getCheaperFood(foodCategory) {
        let cheaperFood = foodCategory.foods[0]

        for (let index in foodCategory.foods) {
          let food = foodCategory.foods[index]
          if (food.price < cheaperFood.price) {
            cheaperFood = food;
          }
        }

        return cheaperFood
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
          res.elements.sort(function (a, b) {
            if (a.orderIndex !== b.orderIndex) {
              return a.orderIndex - b.orderIndex
            }

            return a.createdAt - b.createdAt
          })

          for (let groupIndex in res.elements) {
            let categories = res.elements[groupIndex]
            if (!categories.foodCategories) {
              res.elements[groupIndex].foodCategories = []
            }

            res.elements[groupIndex].foodCategories.sort(function (a, b) {
              if (a.orderIndex !== b.orderIndex) {
                return a.orderIndex - b.orderIndex
              }

              return a.createdAt - b.createdAt
            })
          }

          this.http.res.foodGroups = res

          if (res.elements.length > 0) {
            this.ui.selectMenuId = res.elements[0].id
          }

          setTimeout(this.navToHash, 100)
          this.sortableFoodGroup()
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
      btnOrder(foodGroup) {
        if (foodGroup.foodCategories.length === 0) {
          return
        }

        this.$router.push(`/b/${this.$route.params.shortId}/owner/food/group/${foodGroup.id}/order`)
      },
      btnGroupAdd() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vGroupAdd = true
        this.http.req.group.name = ''
      },
      btnGroupEdit(foodGroup) {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vGroupEdit = true
        this.http.req.group.id = foodGroup.id
        this.http.req.group.name = foodGroup.name
        this.http.req.group.orderIndex = foodGroup.orderIndex
        this.http.req.group.groupModeBig = foodGroup.groupModeBig
      },
      btnGroupModeBig(groupModeBig) {
        this.http.req.group.groupModeBig = groupModeBig
      },
      btnGroupAddConfirm() {
        httpFoodAdminApi.postGroup(this.$route.params.shortId, this.http.req.group).then(res => {
          this.ui.vGroupAdd = false
          this.ui.vCoverMask = false
          scrollApi.enable(true)

          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
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
          this.ui.vGroupEdit = false
          this.ui.vCoverMask = false
          scrollApi.enable(true)

          if (res.foodGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '餐食组',
              content: '餐食组不存在。'
            })
          } else if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '餐食组',
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
  @import '~assets/c/shop';
</style>
