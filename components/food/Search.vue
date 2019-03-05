<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="search_area">
      <div class="blank_20"></div>

      <div class="search_box">
        <div class="search">
          <div class="search_icon"></div>
          <div class="search_input_area">
            <input class="search_input" placeholder="请输入餐食关键字..." v-model="http.req.search.name" @input="btnInput">
          </div>
        </div>

        <div class="search_btn" @click="btnSearch">搜索</div>
      </div>

      <div class="search_hot" v-if="ui.vSearchHot">
        <div class="search_hot_label">热门搜索</div>

        <div class="search_hot_box">
          <div class="search_hot_one" v-for="searchName in ui.hotSearchNames">
            <div class="search_hot_name" @click="btnSearchHot(searchName)">{{searchName}}</div>
          </div>
        </div>
      </div>

      <div class="search_result" v-if="ui.vSearchResult" v-for="foodCategory in http.res.foodCategories.elements">
        <div class="search_result_one" @click="btnNav(foodCategory)">
          <div class="search_result_food" v-html="foodCategory.name"></div>
          <div class="search_result_nav">
            <div class="search_result_nav_icon"></div>
          </div>

          <div class="box_divide" v-if="foodCategory !== http.res.foodCategories.elements[http.res.foodCategories.elements.length - 1]"></div>
        </div>
      </div>

      <div class="search_not_found" v-if="ui.vSearchEmpty">
        <div class="search_not_found_label">没有找到关于<span style="color:#f52626; font-weight: 400">{{this.http.req.search.name}}</span>的结果</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { httpFoodApi } from '../../api/http/lt/httpFoodApi'
  import TitleBar from '../common/TitleBar'

  export default {
    metaInfo: {
      title: '搜索'
    },
    middleware: 'auth',
    components: { TitleBar },
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
          backUri: this.roleWaiter ? `/b/${this.$route.params.shortId}/waiter/food` : `/c/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          vSearchResult: false,
          vSearchHot: true,
          vSearchEmpty: false,
          hotSearchNames: [
            '酒', '米饭'
          ]
        },
        http: {
          req: {
            search: {
              name: null
            }
          },
          res: {
            foodCategories: []
          }
        }
      }
    },
    methods: {
      btnInput() {
        this.ui.vSearchResult = false
        this.ui.vSearchHot = true
        this.ui.vSearchEmpty = false
      },
      btnSearch() {
        if (!Boolean(this.http.req.search.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '搜索',
            content: '请输入餐食关键字。'
          }).then(async (val) => {
          })
          return
        }

        httpFoodApi.getCategoryByNameLike(this.$route.params.shortId, this.http.req.search.name, 0, 20).then(res => {
          let foodCategories = []

          for (let index = res.elements.length - 1; index >= 0; index--) {
            let foodCategory = res.elements[index]
            if (foodCategory.status !== 'OFFLINE') {
              foodCategories.push(foodCategory)
            }
          }

          this.http.res.foodCategories = res
          this.http.res.foodCategories.currentPageSize = foodCategories.length
          this.http.res.foodCategories.elements = foodCategories

          if (this.http.res.foodCategories.elements.length === 0) {
            this.ui.vSearchResult = false
            this.ui.vSearchHot = false
            this.ui.vSearchEmpty = true
            return
          }

          for (let index in this.http.res.foodCategories.elements) {
            let foodCategory = this.http.res.foodCategories.elements[index]
            foodCategory.name = foodCategory.name.replace(this.http.req.search.name, `<span style="color: red; ">${this.http.req.search.name}</span>`)
          }

          this.ui.vSearchResult = true
          this.ui.vSearchHot = false
          this.ui.vSearchEmpty = false
        })
      },
      btnSearchHot(name) {
        this.http.req.search.name = name
        this.btnSearch()
      },
      btnNav(foodCategory) {
        this.$router.push(`/c/${this.$route.params.shortId}/food#${foodCategory.id}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'search';
</style>
