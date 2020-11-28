<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_20"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <div class="status_logo_radius_image reserve_logo_radius_image"></div>
        </div>

        <div class="status_title">今日预订 {{getTodayReserves().length}}</div>

        <div class="blank_20"></div>

        <div class="reserve_reply" @click="btnReserveDay(new Date(new Date().toLocaleDateString()).getTime())">
          <img class="reserve_reply_icon" data-src="/img/b/reserve/b_reserve_reply.png" alt="">
          <div class="reserve_reply_label">待回复 {{getNeedReply(getTodayReserves())}}</div>
        </div>

        <div class="blank_30"></div>

        <div class="box_divide"></div>

        <div class="reserve_process">
          <div class="reserve_process_item" v-for="(reserve, index) in ui.reserves" @click="btnReserveDay(reserve.timeStamp)">
            <div class="reserve_process_icon_ball_new" v-if="index === 0"></div>
            <div class="reserve_process_icon_ball_new_dot" v-if="index === 0"></div>
            <div class="reserve_process_icon_ball" v-else></div>
            <div class="reserve_process_icon_line"></div>
            <div class="reserve_process_content">
              <div v-bind:class="{
              reserve_process_content_time_new: index === 0,
              reserve_process_content_time: index !== 0}">{{getReserveTitle(reserve.timeStamp)}}
              </div>
              <div class="reserve_process_content_name">
                <img class="reserve_reply_icon" data-src="/img/b/reserve/b_reserve_people.png" alt="">
                <div class="reserve_reply_label">预订 {{reserve.reserves.length}} 人</div>
                <div class="reserve_reply_divide"></div>
                <img class="reserve_reply_icon" data-src="/img/b/reserve/b_reserve_reply.png" alt="">
                <div class="reserve_reply_label">待回复 {{getNeedReply(reserve.reserves)}}</div>
              </div>
            </div>
            <div class="blank_20"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="blank_30"></div>
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
          backUri: `/b/${this.$route.params.shortId}/waiter`,
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
          loading: true,
          reserves: []
        }
      }
    },
    mounted() {
      this.httpReserveAll()
    },
    methods: {
      httpReserveAll() {
        let date = new Date(new Date().toLocaleDateString())
        httpReserveAdminApi.getAll(this.$route.params.shortId, null, date.getTime(), 0, 99).then(res => {
          if (res.currentPageSize === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve/empty`)
            return
          }

          res.elements.sort(function(a, b) {
            return a.date - b.date
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
          this.ui.loading = false
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
      },
      btnReserveDay(timeStamp) {
        this.$router.push({
          path: `/b/${this.$route.params.shortId}/waiter/reserve/day`,
          query: {
            timeStamp: timeStamp
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/reserve';
  @import 'index';
</style>
