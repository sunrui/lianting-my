<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="reserve">
        <div class="reserve_header"></div>
        <div class="reserve_body box_radius_footer">
          <div class="blank_40"></div>

          <div v-show="http.res.statReserve.elements.length > 0">
            <canvas id="reserveChart"></canvas>
            <div class="blank_40"></div>
          </div>

          <div class="reserve_body_title">
            <div class="reserve_body_title_one">日期</div>
            <div class="reserve_body_title_one">当日预订</div>
            <div class="reserve_body_title_one reserve_body_title_one2">最后预订时间</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="http.res.statReserve.elements.length > 0">
            <div v-for="statReserve in http.res.statReserve.elements">
              <div class="reserve_body_content" @click="btnReserve(statReserve.dateTime)">
                <div class="reserve_body_content_one">{{getDate(statReserve.dateTime)}}</div>
                <div class="reserve_body_content_one">{{statReserve.totalReserve}}</div>
                <div class="reserve_body_content_one reserve_body_content_one2">{{dateFormat(new Date(parseInt(statReserve.lastDateTime)))}}</div>
              </div>
              <div class="box_divide" v-if="statReserve !== http.res.statReserve.elements[http.res.statReserve.elements.length - 1]"></div>
            </div>
            <div class="reserve_footer"></div>
          </div>
          <div class="reserve_empty" v-else>没有预订记录。</div>
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
      title: '预订统计'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '预订统计',
          backUri: `/b/${this.$route.params.shortId}/owner/stat`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            statReserve: {
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
                'breserveColor': ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                'breserveWidth': 1
              }]
            },
            'options': {'scales': {'yAxes': [{'ticks': {'beginAtZero': true}}]}}
          }
        }
      }
    },
    mounted() {
      this.httpShop()
      this.httpStatReserve()
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
        new Chart(document.getElementById('reserveChart'), this.ui.chart)
      },
      httpStatReserve() {
        httpStatAdminApi.getReserve(this.$route.params.shortId, 0, 200).then(res => {
          this.ui.chart.data.datasets[0].label = '预订'
          this.ui.chart.data.datasets[0].data = []
          this.ui.chart.data.labels = []

          for (let statReserveIndex in res.elements) {
            let statReserve = res.elements[statReserveIndex]

            this.ui.chart.data.labels.push(this.getDate(statReserve.dateTime))
            this.ui.chart.data.datasets[0].data.push(statReserve.totalReserve)
          }

          this.refreshCharts()

          this.http.res.statReserve = res
        })
      },
      btnReserve(dateTime) {
        // if (this.ui.limit.licenseType || this.ui.limit.licenseExpiredAt) {
        // this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
        // return
        // }

        // this.$router.push({
        //   path: `/b/${this.$route.params.shortId}/owner/reserve`,
        //   query: {
        //     date: dateTime
        //   }
        // })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
