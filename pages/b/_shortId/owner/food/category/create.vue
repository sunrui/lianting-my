<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">餐食图片</div>
          <div class="addition_item_avatar_input">
            <image-upload type="b" :file-url="http.req.category.image" v-on:uploadSuccess="uploadSuccess"></image-upload>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐食名称</div>
          <label>
            <input class="addition_item_input" placeholder="请输入餐食名称" maxlength="20" v-model="http.req.category.name">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐食描述</div>
          <label>
            <input class="addition_item_input" placeholder="请输入餐食描述" maxlength="64" v-model="http.req.category.detail">
          </label>
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
              <label>
                <input class="addition_item_input" placeholder="请输入标签名称" maxlength="12" v-model="http.req.category.tagName">
              </label>
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

    <div class="blank_20"></div>

    <div class="box">
      <div class="food_price box_radius">
        <div class="food_price_title">
          <div class="food_price_title_label">餐食价格</div>
          <div class="food_price_table_add" @click="btnFoodAdd"></div>
        </div>

        <div v-if="ui.foods" v-for="food in ui.foods">
          <div class="food_price_one">
            <div class="food_price_name">{{food.name}}</div>
            <div class="food_price_now">{{food.price}}</div>
            <div class="food_price_original">{{food.originalPrice}}</div>
            <div class="food_price_delete" @click="btnFoodDelete(food)"></div>
          </div>

          <div class="box_divide"></div>
        </div>
        <div v-if="!ui.foods || ui.foods.length === 0">
          <div class="food_price_empty">
            <div class="food_price_empty_image"></div>
            <div class="food_price_empty_label">暂无价格</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加</div>
    </div>

    <div class="modal_center" v-if="ui.vPriceAdd">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">添加价格</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <label>
            <input class="modal_input" placeholder="请输入类别，如：一盘。" maxlength="10" v-model="ui.food.name">
          </label>
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
        <div class="button_big" v-if="ui.food.name && ui.food.price !== undefined && ui.food.price !== null" @click="btnFoodAddConfirm">确定</div>
        <div class="button_big button_gray" v-else>确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpFoodAdminApi} from '../../../../../../api/http/lt/httpFoodAdminApi'
  import TitleBar from '../../../../../../components/common/TitleBar'
  import CurrencyInput from '../../../../../../components/common/CurrencyInput'
  import {highlightApi} from '../../../../../../api/local/highlightApi'
  import ImageUpload from "../../../../../../components/common/ImageUpload"
  import {scrollApi} from '../../../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '添加餐食'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput, ImageUpload},
    data() {
      return {
        title: {
          canBack: true,
          title: '添加餐食',
          backUri: `/b/${this.$route.params.shortId}/owner/food`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            category: {
              foodGroupId: null,
              name: null,
              image: null,
              detail: null,
              tagName: null,
              tagIndex: 0,
              foods: []
            }
          }
        },
        ui: {
          vPriceAdd: false,
          vCoverMask: false,
          tagEnable: false,
          foods: [],
          food: {
            name: null,
            price: null,
            originalPrice: null
          },
          finishFood: 0
        }
      }
    },
    mounted() {
      if (!Boolean(this.$route.query.foodGroupId)) {
        this.$msgBox.doModal({
          type: 'yes',
          title: '添加餐食',
          content: `餐食组不存在。`
        })
      }
    },
    methods: {
      uploadSuccess(fileName) {
        this.http.req.category.image = fileName
      },
      btnCoverMask() {
        this.ui.vPriceAdd = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)
      },
      btnTag(enable) {
        this.ui.tagEnable = enable
      },
      btnChooseTagIndex(index) {
        this.http.req.category.tagIndex = index

        if (!Boolean(this.http.req.category.tagName)) {
          switch (index) {
            case 1:
              this.http.req.category.tagName = '店长推荐'
              break;
            case 2:
              this.http.req.category.tagName = '最高人气'
              break;
            case 3:
              this.http.req.category.tagName = '本地特色'
              break;
          }
        }
      },
      btnFoodAdd() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vPriceAdd = true
        this.ui.food = {}
      },
      btnFoodDelete(food) {
        for (let index in this.ui.foods) {
          let one = this.ui.foods[index]

          if (one.name === food.name) {
            this.ui.foods.splice(index, 1)

            break
          }
        }
      },
      btnFoodAddConfirm() {
        this.ui.vPriceAdd = false
        this.ui.vCoverMask = false
        scrollApi.enable(true)

        if (!this.ui.food.name) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加价格',
            content: '请输入类别，如：一盘。'
          })

          return
        }

        if (this.ui.food.price === null || this.ui.food.price === undefined) {
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

        if (this.ui.food.originalPrice === null || this.ui.food.originalPrice === undefined) {
          this.ui.food.originalPrice = this.ui.food.price
        }

        this.ui.foods.push(this.ui.food)
      },
      btnCreate() {
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

          if (!Boolean(this.http.req.category.tagName)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食',
              content: `请输入标签名称。`
            })

            return
          }

        }

        if (!this.ui.foods || this.ui.foods.length === 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加餐食',
            content: `请先添加餐食价格。`
          })

          return
        }

        this.http.req.category.foodGroupId = this.$route.query.foodGroupId

        httpFoodAdminApi.postCategory(this.$route.params.shortId, this.http.req.category).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.nameExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐食',
              content: `名称${highlightApi.highlight(this.http.req.category.name)}已存在。`
            })

            return
          }

          if (res.foodCategoryId) {
            for (let index in this.ui.foods) {
              let one = this.ui.foods[index]
              one.foodCategoryId = res.foodCategoryId

              httpFoodAdminApi.postFood(this.$route.params.shortId, one).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
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
                  this.ui.finishFood++
                  if (this.ui.finishFood === this.ui.foods.length) {
                    this.$msgBox.doModal({
                      type: 'yes',
                      title: '添加餐食',
                      content: `添加成功。`
                    }).then(async (val) => {
                      this.$router.push(this.title.backUri)
                    })
                  }
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_food';
</style>
