<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="charge">
        <div class="charge_header"></div>
        <div class="charge_body box_radius_footer">
          <div class="blank_40"></div>

          <div v-show="ui.statFoodCategories.length > 0">
            <canvas id="foodCategoryChart"></canvas>
            <div class="blank_40"></div>
          </div>

          <div class="charge_body_title">
            <div class="charge_body_title_one">交易日期</div>
            <div class="charge_body_title_one">餐食种类</div>
            <div class="charge_body_title_one">售卖份数</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="ui.statFoodCategories.length > 0">
            <div v-for="statFoodCategory in ui.statFoodCategories">
              <div class="charge_body_content" @click="btnChooseStatFoodCategory(statFoodCategory)">
                <div class="charge_body_content_one" v-bind:class="{
                charge_body_content_one_select: ui.selectStatFoodCategory === statFoodCategory
                }">{{getDate(statFoodCategory.date)}}
                </div>
                <div class="charge_body_content_one" v-bind:class="{
                     charge_body_content_one_select: ui.selectStatFoodCategory === statFoodCategory
                     }">{{statFoodCategory.foodCategories.length}}
                </div>
                <div class="charge_body_content_one" v-bind:class="{
                     charge_body_content_one_select: ui.selectStatFoodCategory === statFoodCategory
                     }">{{statFoodCategory.totalFoodCategory}}
                </div>
              </div>
              <div class="box_divide" v-if="statFoodCategory !== ui.statFoodCategories[ui.statFoodCategories.length - 1]"></div>
            </div>
            <div class="charge_footer"></div>
          </div>
          <div class="charge_empty" v-else>暂时没有售卖餐食。</div>
        </div>
      </div>
    </div>

    <div class="blank_30"></div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpStatAdminApi} from '../../../../../../api/http/lt/httpStatAdminApi'
  import {timeApi} from '../../../../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '餐食统计'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '餐食统计',
          backUri: `/b/${this.$route.params.shortId}/owner/stat`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {}
        },
        ui: {
          statFoodCategories: [],
          selectStatFoodCategory: {},
          chart: {
            'type': 'line',
            'data': {
              'labels': [],
              'datasets': [{
                'label': '',
                'data': [],
                'fill': false,
                'backgroundColor': [
                  'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)',
                  'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)',
                  'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)',
                  'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'],
                'borderColor': ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                'borderWidth': 1
              }]
            },
            'options': {'scales': {'yAxes': [{'ticks': {'beginAtZero': true}}]}}
          }
        }
      }
    },
    created() {
      this.httpStatFoodCategory(0)
    },
    mounted() {
      this.refreshCharts()
    },
    methods: {
      getDate(date) {
        return timeApi.dateFormat(new Date(parseInt(date)), 'yyyy/MM/dd')
      },
      refreshCharts() {
        let Chart = require('chart.js')
        new Chart(document.getElementById('foodCategoryChart'), this.ui.chart)
      },
      addFoodCategory(foodCategory) {
        let statFoodCategoryOne = null

        for (let foodCategoryIndex in this.ui.statFoodCategories) {
          let statFoodCategory = this.ui.statFoodCategories[foodCategoryIndex]

          if (statFoodCategory.date === foodCategory.date) {
            statFoodCategoryOne = statFoodCategory
            break
          }
        }

        if (statFoodCategoryOne === null) {
          statFoodCategoryOne = {
            date: foodCategory.date,
            foodCategories: [],
            totalFoodCategory: 0
          }

          this.ui.statFoodCategories.push(statFoodCategoryOne)
        }

        statFoodCategoryOne.foodCategories.push(foodCategory)

        let totalFoodCategory = 0
        for (let foodCategoryIndex in statFoodCategoryOne.foodCategories) {
          let foodCategory = statFoodCategoryOne.foodCategories[foodCategoryIndex]
          totalFoodCategory += foodCategory.totalFoodCategory
        }
        statFoodCategoryOne.totalFoodCategory = totalFoodCategory
      },
      httpStatFoodCategory(page) {
        httpStatAdminApi.getFood(this.$route.params.shortId, page, 99).then(res => {
          for (let foodCategoryIndex in res.elements) {
            let foodCategory = res.elements[foodCategoryIndex]
            this.addFoodCategory(foodCategory)
          }

          if (res.currentPageSize > 0) {
            this.httpStatFoodCategory(page + 1)
          } else {
            if (this.ui.statFoodCategories.length > 0) {
              this.btnChooseStatFoodCategory(this.ui.statFoodCategories[0])
            }
          }
        })
      },
      btnChooseStatFoodCategory(statFoodCategory) {
        this.ui.selectStatFoodCategory = statFoodCategory
        this.ui.chart.data.datasets[0].label = this.getDate(statFoodCategory.date)
        this.ui.chart.data.datasets[0].data = []
        this.ui.chart.data.labels = []

        for (let foodCategoryIndex in this.ui.selectStatFoodCategory.foodCategories) {
          let foodCategory = this.ui.selectStatFoodCategory.foodCategories[foodCategoryIndex]

          this.ui.chart.data.labels.push(foodCategory.foodCategoryName)
          this.ui.chart.data.datasets[0].data.push(foodCategory.totalFoodCategory)
        }

        this.refreshCharts()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
