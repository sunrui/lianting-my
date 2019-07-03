<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="order">
        <div class="order_header"></div>
        <div class="order_body box_radius_footer">
          <div class="blank_40"></div>

          <div v-show="http.res.statOrder.elements.length > 0">
            <canvas id="orderChart"></canvas>
            <div class="blank_40"></div>
          </div>

          <div class="order_body_title">
            <div class="order_body_title_one">日期</div>
            <div class="order_body_title_one">当日订单</div>
            <div class="order_body_title_one order_body_title_one2">最后订单时间</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="http.res.statOrder.elements.length > 0">
            <div v-for="statOrder in http.res.statOrder.elements">
              <div class="order_body_content" @click="btnOrder(statOrder.dateTime)">
                <div class="order_body_content_one">{{getDate(statOrder.dateTime)}}</div>
                <div class="order_body_content_one">{{statOrder.totalOrder}}</div>
                <div class="order_body_content_one order_body_content_one2">{{dateFormat(new Date(parseInt(statOrder.lastDateTime)))}}</div>
              </div>
              <div class="box_divide" v-if="statOrder !== http.res.statOrder.elements[http.res.statOrder.elements.length - 1]"></div>
            </div>
            <div class="order_footer"></div>
          </div>
          <div class="order_empty" v-else>没有订单记录。</div>
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
  import {httpShopApi} from '../../../../../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '订单统计'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '订单统计',
          backUri: `/b/${this.$route.params.shortId}/owner/stat`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            statOrder: {
              elements: []
            }
          }
        },
        ui: {
          limit: {
            licenseType: true,
            licenseExpiredAt: true,
          },
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
      this.httpShop()
      this.httpStatOrder()
      this.httpShopLicenseExpiredAt()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      getDate(date) {
        return timeApi.dateFormat(new Date(parseInt(date)), 'yyyy/MM/dd')
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.ui.limit.licenseType = (res.licenseType !== 'Lite' && res.licenseType !== 'Normal' && res.licenseType !== 'Senior')
        })
      },
      httpShopLicenseExpiredAt() {
        httpShopApi.getLicenseExpiredAt(this.$route.params.shortId).then(res => {
          this.ui.limit.licenseExpiredAt = res.licenseExpiredAt < new Date().getTime()
        })
      },
      refreshCharts() {
        let Chart = require('chart.js')
        new Chart(document.getElementById('orderChart'), this.ui.chart)
      },
      httpStatOrder() {
        httpStatAdminApi.getOrder(this.$route.params.shortId, 0, 200).then(res => {
          this.ui.chart.data.datasets[0].label = '订单'
          this.ui.chart.data.datasets[0].data = []
          this.ui.chart.data.labels = []

          for (let statOrderIndex in res.elements) {
            let statOrder = res.elements[statOrderIndex]

            this.ui.chart.data.labels.push(this.getDate(statOrder.dateTime))
            this.ui.chart.data.datasets[0].data.push(statOrder.totalOrder)
          }

          this.refreshCharts()

          this.http.res.statOrder = res
        })
      },
      btnOrder(dateTime) {
        // if (this.ui.limit.licenseType || this.ui.limit.licenseExpiredAt) {
        // this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
        // return
        // }

        this.$router.push({
          path: `/b/${this.$route.params.shortId}/owner/order`,
          query: {
            date: dateTime
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
