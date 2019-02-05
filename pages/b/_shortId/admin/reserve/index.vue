<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image reserve_logo_radius_image">
        </div>

        <div class="status_title">今日预订 {{getTodayReserves().length}}</div>

        <div class="blank_20"></div>

        <div class="reserve_reply">
          <img class="reserve_reply_icon" src="/img/b/reserve/b_reserve_reply.png">
          <div class="reserve_reply_label">待回复 {{getNeedReply(getTodayReserves())}}</div>
        </div>

        <div class="blank_30"></div>

        <div class="box_divide"></div>

        <div class="reserve_process">
          <div class="reserve_process_item" v-for="(reserve, index) in ui.reserves">
            <div class="reserve_process_icon_ball_new" v-if="index === 0"></div>
            <div class="reserve_process_icon_ball" v-else></div>
            <div class="reserve_process_icon_line"></div>
            <div class="reserve_process_content">
              <div v-bind:class="{
              reserve_process_content_time_new: index === 0,
              reserve_process_content_time: index !== 0}">{{getReserveTitle(reserve.timeStamp)}}
              </div>
              <div class="reserve_process_content_name">
                <img class="reserve_reply_icon" src="/img/b/reserve/b_reserve_people.png">
                <div class="reserve_reply_label">预订 {{reserve.reserves.length}} 人</div>
                <div class="reserve_reply_divide"></div>
                <img class="reserve_reply_icon" src="/img/b/reserve/b_reserve_reply.png">
                <div class="reserve_reply_label">待回复 {{getNeedReply(reserve.reserves)}}</div>
              </div>
            </div>
            <div class="blank_20"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { httpReserveAdminApi } from '../../../../../api/http/lt/httpReserveAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import { timeApi } from '../../../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '预订'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '预订',
          backUri: `/b/${this.$route.params.shortId}/admin`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {
            reserves: {},
            todayReserve: null
          }
        },
        ui: {
          reserves: []
        }
      }
    },
    created() {
      this.httpReserveAll()
    },
    methods: {
      httpReserveAll() {
        httpReserveAdminApi.getAll(this.$route.params.shortId, null, null, 0, 99).then(res => {
          res.elements.sort(function(a, b) {
            return b.date - a.date
          })

          let reserves = []

          for (let index in res.elements) {
            let reserve = res.elements[index]
            let date = new Date(parseInt(reserve.date))
            date = new Date(date.toLocaleDateString())
            if (!Boolean(reserves[date.getTime()])) {
              reserves[date.getTime()] = []
            }

            reserves[date.getTime()].push(reserve)
          }

          this.ui.reserves = []
          for (let one in reserves) {
            this.ui.reserves.push({
              timeStamp: one,
              reserves: reserves[one]
            })
          }

          this.http.res.reserves = res
        })
      },
      getTodayReserves() {
        if (!this.http.res.todayReserve) {
          let date = new Date(new Date().toLocaleDateString())
          httpReserveAdminApi.getDay(this.$route.params.shortId, date.getTime(), 0, 99).then(res => {
            res.elements.sort(function(a, b) {
              return a.date - b.date
            })

            this.http.res.todayReserve = res
          })
        }

        return !this.http.res.todayReserve ? [] : this.http.res.todayReserve.elements
      },
      getNeedReply(reserves) {
        let count = 0

        for (let index in reserves) {
          let reserve = reserves[index]
          if (reserve.status === 'Wait') {
            count++
          }
        }

        return count
      },
      getReserveTitle(timeStamp) {
        let date = new Date(parseInt(timeStamp))
        return date.toLocaleDateString() + ' ' + timeApi.getWeekDesc2(date)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/reserve';
  @import 'index';
</style>
