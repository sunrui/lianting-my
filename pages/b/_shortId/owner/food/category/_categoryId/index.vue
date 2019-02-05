<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">餐食图片</div>
          <div class="addition_item_avatar_input">
            <div class="addition_item_avatar_img_add" v-if="!http.req.category.image"></div>
            <img class="addition_item_avatar_img" v-if="http.req.category.image" :src="http.req.category.image">
            <div class="addition_item_avatar_input_link" v-if="http.req.category.image">></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐食名称</div>
          <input class="addition_item_input" placeholder="请输入餐食名称" maxlength="20" v-model="http.req.category.name">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐食描述</div>
          <input class="addition_item_input" placeholder="请输入餐食描述" maxlength="64" v-model="http.req.category.detail">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐食状态</div>
          <div class="addition_item_content" @click="btnChangeStatus">
            <div v-bind:class="{
          food_status_online: http.req.category.status === 'ONLINE',
          food_status_offline: http.req.category.status === 'OFFLINE',
          food_status_sold_out: http.req.category.status === 'SOLD_OUT'
          }">
              {{
              http.req.category.status === 'ONLINE' ? '上架中' :
              http.req.category.status === 'OFFLINE' ? '下架中' :
              http.req.category.status === 'SOLD_OUT' ? '已售罄' : http.req.category.status
              }}
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">启用标签</div>

          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.tagEnable" @click="btnTag(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnTag(true)"></div>
          </div>

          <div v-if="ui.tagEnable">
            <div class="addition_item">
              <div class="addition_item_label">名称</div>
              <input class="addition_item_input" placeholder="请输入标签名称" maxlength="12" v-model="http.req.category.tagName">
            </div>

            <div class="box_divide"></div>

            <div class="addition_item">
              <div class="addition_item_label">样式</div>
              <div class="addition_item_tag">
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1" v-if="http.req.category.tagIndex === 1">{{http.req.category.tagName}}</div>
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_2" v-if="http.req.category.tagIndex === 2">{{http.req.category.tagName}}</div>
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_3" v-if="http.req.category.tagIndex === 3">{{http.req.category.tagName}}</div>
              </div>
            </div>

            <div class="box_divide"></div>

            <div class="addition_item">
              <div class="addition_item_label">选择样式</div>
              <div class="addition_item_tag">
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1" @click="btnChooseTagIndex(1)">店长推荐</div>
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_2" @click="btnChooseTagIndex(2)">最高人气</div>
                <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_3" @click="btnChooseTagIndex(3)">本地特色</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="food_price box_radius">
        <div class="food_price_title">
          <div class="food_price_title_label">餐食价格</div>
          <div class="food_price_table_add" @click="btnFoodAdd"></div>
        </div>

        <div v-for="food in http.req.category.foods">
          <div class="food_price_one">
            <div class="food_price_name">{{food.name}}</div>
            <div class="food_price_now">{{food.price}}</div>
            <div class="food_price_original">{{food.originalPrice}}</div>
            <div class="food_price_delete" @click="btnFoodDelete(food)"></div>
          </div>

          <div class="box_divide"></div>
        </div>
        <div v-if="http.req.category.foods.length === 0">
          <div class="food_price_empty">
            <div class="food_price_empty_image"></div>
            <div class="food_price_empty_label">暂无价格</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>

    <div class="modal_center" v-if="ui.v_price_add">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png">
      </div>

      <div class="modal_title">添加价格</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" placeholder="请输入类别，如：大份。" maxlength="10" v-model="ui.food.name">
        </div>
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <currency-input placeholder="请输入价格" v-model="ui.food.price"></currency-input>
        </div>
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <currency-input placeholder="请输入原价格" maxlength="8" v-model="ui.food.originalPrice"></currency-input>
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" @click="btnFoodAddConfirm">确定</div>
      </div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../../../components/common/TitleBar'
  import CurrencyInput from '../../../../../../../components/common/CurrencyInput'
  import { httpFoodAdminApi } from '../../../../../../../api/http/lt/httpFoodAdminApi'
  import { httpFoodApi } from '../../../../../../../api/http/lt/httpFoodApi'
  import { highlightApi } from '../../../../../../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '编辑餐食'
    },
    middleware: 'auth',
    components: { TitleBar, CurrencyInput },
    data() {
      return {
        title: {
          canBack: true,
          title: '编辑餐食',
          backUri: `/b/${this.$route.params.shortId}/owner/food`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            category: {
              id: null,
              name: null,
              image: 'url_image',
              detail: null,
              tagName: null,
              tagIndex: 0,
              foods: []
            }
          }
        },
        ui: {
          v_price_add: false,
          v_cover_mask: false,
          tagEnable: false,
          food: {
            name: null,
            price: null,
            originalPrice: null
          }
        }
      }
    },
    created() {
      this.httpFoodCategory()
    },
    mounted() {
    },
    methods: {
      httpFoodCategory() {
        httpFoodApi.getCategory(this.$route.params.shortId, this.$route.params.categoryId).then(res => {
          this.http.req.category = res
          this.ui.tagEnable = Boolean(res.tagName)
        })
      },
      btnCoverMask() {
        this.ui.v_price_add = false
        this.ui.v_cover_mask = false
      },
      btnTag(enable) {
        this.ui.tagEnable = enable
      },
      btnChooseTagIndex(index) {
        this.http.req.category.tagIndex = index
      },
      btnChangeStatus() {
        if (this.http.req.category.status === 'ONLINE') {
          this.http.req.category.status = 'OFFLINE'
        } else if (this.http.req.category.status === 'OFFLINE') {
          this.http.req.category.status = 'SOLD_OUT'
        } else {
          this.http.req.category.status = 'ONLINE'
        }
      },
      btnFoodAdd() {
        this.ui.v_price_add = true
        this.ui.v_cover_mask = true
        this.ui.food = {}
      },
      btnFoodDelete(food) {
        if (this.http.req.category.foods.length <= 1) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '删除价格',
            content: '唯一价格无法删除。'
          })

          return
        }


        httpFoodAdminApi.deleteFood(this.$route.params.shortId, food.id).then(res => {
          if (res.foodIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '删除价格',
              content: '价格不存在。'
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '删除价格',
              content: '删除成功。'
            })
          }

          this.httpFoodCategory()
        })
      },
      btnFoodAddConfirm() {
        if (!Boolean(this.ui.food.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加价格',
            content: '请输入类别，如：大份。'
          })

          return
        }

        if (!Boolean(this.ui.food.price)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加价格',
            content: '请输入价格。'
          })

          return
        }

        for (let index in this.ui.foods) {
          let one = this.ui.foods[index]

          if (one.name === this.ui.food.name) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加价格',
              content: `类别${highlightApi.highlight(one.name)}已存在。`
            })

            return
          }
        }

        if (!Boolean(this.ui.food.originalPrice)) {
          this.ui.food.originalPrice = this.ui.food.price
        }

        this.ui.food.foodCategoryId = this.$route.params.categoryId

        httpFoodAdminApi.postFood(this.$route.params.shortId, this.ui.food).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食价格',
              content: `已超过当前授权最大数目限制，如需升级授权请转至续费页或联系我们。`
            })

            return
          }

          if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食价格',
              content: `名称${highlightApi.highlight(one.name)}已存在。`
            })

            return
          }

          if (res.foodId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食',
              content: `添加成功。`
            })

            this.httpFoodCategory()
          }
        })

        this.ui.v_price_add = false
        this.ui.v_cover_mask = false
      },
      btnUpdate() {
        if (!Boolean(this.http.req.category.image)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐食',
            content: `请先上传餐食图片。`
          })

          return
        }

        if (!Boolean(this.http.req.category.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐食',
            content: `请输入餐食名称。`
          })

          return
        }

        if (!this.ui.tagEnable) {
          this.http.req.category.tagIndex = 0
          this.http.req.category.tagName = ''
        } else {
          if (this.http.req.category.tagIndex === 0) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食',
              content: `请选择标签样式。`
            })

            return
          }
        }

        httpFoodAdminApi.putCategory(this.$route.params.shortId, this.http.req.category).then(res => {
          if (res.foodCategoryIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐食',
              content: `餐食不存在。`
            })

            return
          }

          if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑餐食',
              content: `名称${highlightApi.highlight(this.http.req.category.name)}已存在。`
            })

            return
          }

          if (res.success) {
            this.$router.back()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_food';
  @import 'index';
</style>
