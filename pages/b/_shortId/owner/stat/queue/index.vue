<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="queue">
        <div class="queue_header"></div>
        <div class="queue_body box_radius_footer">
          <div class="blank_40"></div>

          <div v-show="http.res.statQueue.elements.length > 0">
            <canvas id="queueChart"></canvas>
            <div class="blank_40"></div>
          </div>

          <div class="queue_body_title">
            <div class="queue_body_title_one">日期</div>
            <div class="queue_body_title_one">排队人数</div>
            <div class="queue_body_title_one queue_body_title_one2">最后排队时间</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="http.res.statQueue.elements.length > 0">
            <div v-for="statQueue in http.res.statQueue.elements">
              <div class="queue_body_content" @click="btnQueue(statQueue.dateTime)">
                <div class="queue_body_content_one">{{getDate(statQueue.dateTime)}}</div>
                <div class="queue_body_content_one">{{statQueue.totalQueue}}</div>
                <div class="queue_body_content_one queue_body_content_one2">{{new Date(parseInt(statQueue.lastDateTime)).toLocaleTimeString()}}</div>
              </div>
              <div class="box_divide" v-if="statQueue !== http.res.statQueue.elements[http.res.statQueue.elements.length - 1]"></div>
            </div>
            <div class="queue_footer"></div>
          </div>
          <div class="queue_empty" v-else>没有排队记录。</div>
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
      title: '排队统计'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '排队统计',
          backUri: `/b/${this.$route.params.shortId}/owner/stat`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            statQueue: {
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
                'bqueueColor': ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
                  'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'],
                'bqueueWidth': 1
              }]
            },
            'options': {'scales': {'yAxes': [{'ticks': {'beginAtZero': true}}]}}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpStatQueue()
      this.httpShopLicenseExpiredAt()
    },
    methods: {
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
        new Chart(document.getElementById('queueChart'), this.ui.chart)
      },
      httpStatQueue() {
        httpStatAdminApi.getQueue(this.$route.params.shortId, 0, 200).then(res => {
          this.ui.chart.data.datasets[0].label = '排队'
          this.ui.chart.data.datasets[0].data = []
          this.ui.chart.data.labels = []

          for (let statQueueIndex in res.elements) {
            let statQueue = res.elements[statQueueIndex]

            this.ui.chart.data.labels.push(this.getDate(statQueue.dateTime))
            this.ui.chart.data.datasets[0].data.push(statQueue.totalQueue)
          }

          this.refreshCharts()

          this.http.res.statQueue = res
        })
      },
      btnQueue(dateTime) {
        // if (this.ui.limit.licenseType || this.ui.limit.licenseExpiredAt) {
        // this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
        // return
        // }

        // this.$router.push({
        //   path: `/b/${this.$route.params.shortId}/owner/queue`,
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
