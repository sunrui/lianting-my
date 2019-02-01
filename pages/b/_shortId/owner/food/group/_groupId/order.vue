<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="order_food">
      <div class="order_food_one" v-for="foodCategory in http.res.group.foodCategories">
        <div class="order_food_name">{{foodCategory.name}}</div>
        <div class="order_food_down"
             v-if="foodCategory !== http.res.group.foodCategories[http.res.group.foodCategories.length - 1]"
             @click="btnOrderDown(foodCategory)"
        ></div>
        <div class="order_food_up"
             v-if="foodCategory !== http.res.group.foodCategories[0]"
             @click="btnOrderUp(foodCategory)"
        ></div>
        <div class="box_divide"></div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnOrder">完成</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../../../components/TitleBar'
  import {httpFoodApi} from '../../../../../../../api/http/ltorder/httpFoodApi'
  import {httpFoodAdminApi} from '../../../../../../../api/http/ltorder/httpFoodAdminApi'

  export default {
    metaInfo: {
      title: '排序餐食'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '排序餐食',
          backUri: `/b/${this.$route.params.shortId}/owner/food`,
          theme: 'white',
          imageHeight: 0
        },
        http: {
          res: {
            group: {}
          }
        },
        ui: {}
      }
    },
    created() {
      this.httpGroup()
    },
    methods: {
      httpGroup() {
        httpFoodApi.getGroup(this.$route.params.shortId, this.$route.params.groupId, false).then(res => {
          this.http.res.group = res

          this.short()
          this.reIndex()
        })
      },
      short() {
        this.http.res.group.foodCategories.sort(function(a, b) {
          return a.orderIndex - b.orderIndex
        })
      },
      reIndex() {
        let orderIndex = 0

        for (let index in this.http.res.group.foodCategories) {
          let foodCategory = this.http.res.group.foodCategories[index]
          foodCategory.orderIndex = orderIndex
          orderIndex++
        }
      },
      btnOrderDown(foodCategory) {
        for (let index = 0; index < this.http.res.group.foodCategories.length; index++) {
          let one = this.http.res.group.foodCategories[index]

          if (foodCategory.id === one.id) {
            if (index === this.http.res.group.foodCategories.length - 1) {
              return
            }

            let tempOrderIndex = foodCategory.orderIndex
            let nextFoodCategory = this.http.res.group.foodCategories[index + 1]
            foodCategory.orderIndex = nextFoodCategory.orderIndex
            nextFoodCategory.orderIndex = tempOrderIndex

            this.short()
            break
          }
        }
      },
      btnOrderUp(foodCategory) {
        for (let index = 0; index < this.http.res.group.foodCategories.length; index++) {
          let one = this.http.res.group.foodCategories[index]

          if (foodCategory.id === one.id) {
            if (index === 0) {
              return
            }

            let tempOrderIndex = foodCategory.orderIndex
            let prevFoodCategory = this.http.res.group.foodCategories[index - 1]
            foodCategory.orderIndex = prevFoodCategory.orderIndex
            prevFoodCategory.orderIndex = tempOrderIndex

            this.short()
            break
          }
        }
      },
      btnOrder() {
        this.reIndex()

        let finishUpdate = 0
        for (let index in this.http.res.group.foodCategories) {
          let foodCategory = this.http.res.group.foodCategories[index]

          httpFoodAdminApi.putCategory(this.$route.params.shortId, foodCategory).then(res => {
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
                content: `名称 '${this.http.req.category.name}' 已存在。`
              })

              return
            }

            if (res.success) {
              finishUpdate++

              if (finishUpdate === this.http.res.group.foodCategories.length) {
                this.$router.back()
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import 'order';
</style>
