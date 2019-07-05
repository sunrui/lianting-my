<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="reserve_title box_radius">{{getReserveTitle()}}</div>
    </div>

    <scroller class="scroller"
              noDataText=""
              ref="dayReserve"
              :on-refresh="onRefresh"
              refresh-text=""
              :on-infinite="onInfinite">
      <div class="box" v-for="reserve in ui.scroller.elements">
        <div class="list_title box_radius_header" @click="btnReserve(reserve)">
          <div class="reserve_name">{{reserve.name}}</div>
          <div class="reserve_sex">({{reserve.male ? '先生' : '女士'}})</div>
          <div class="reserve_status" v-bind:class="{
          reserve_status_arrived: reserve.status === 'Arrived',
          reserve_status_accept:reserve.status === 'Accept' || reserve.status === 'AcceptRead',
          reserve_status_refuse: reserve.status === 'Refuse' || reserve.status === 'RefuseRead',
          reserve_status_wating:reserve.status === 'Wait',
          reserve_status_cancel:reserve.status === 'Cancel'
        }">{{getStatus(reserve.status)}}
          </div>
        </div>

        <div class="box_divide_radius" @click="btnReserve(reserve)">
          <div class="box_divide_radius_line"></div>
        </div>
        <div class="reserve_info box_radius_footer">
          <div class="reserve_info_left" @click="btnReserve(reserve)">
            <div class="reserve_info_label">手机: <span class="reserve_info_label_phone">{{reserve.phone}}</span></div>
            <div class="reserve_info_label">餐桌: {{reserve.tableGroupName}}</div>
            <div class="reserve_info_label">人数: {{reserve.people}} 人</div>
          </div>
          <a class="reserve_info_middle" :href="btnPhone(reserve.phone)">
            <div class="reserve_info_phone"></div>
          </a>
          <div class="reserve_info_right" @click="btnReserve(reserve)">
            <div class="reserve_info_time">{{getReserveTime(reserve)}}</div>
          </div>
        </div>
        <div class="box" v-if="reserve.remark" @click="btnReserve(reserve)">
          <div class="reserve_remark box_radius_footer">
            <div class="reserve_remark_icon"></div>
            <span class="reserve_remark_label">{{reserve.remark}}</span>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </scroller>
  </div>
</template>

<script>
  import {httpReserveAdminApi} from '../../../../../api/http/lt/httpReserveAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {timeApi} from '../../../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '当日预订'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '当日预订',
          backUri: `/b/${this.$route.params.shortId}/waiter/reserve`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {}
        },
        ui: {
          scroller: {
            page: 0,
            elements: [],
            haveMore: true
          }
        }
      }
    },
    mounted() {
      if (!Boolean(this.$route.query.timeStamp)) {
        this.$msgBox.doModal({
          type: 'yes',
          title: '当日预订',
          content: '未指定时间。'
        }).then(async (val) => {
          this.$router.push(this.title.backUri)(-1)
        })
      }

      this.httpReserveDay(null)
    },
    methods: {
      onRefresh(done) {
        this.httpReserveDay(done)
      },
      getStatus(status) {
        switch (status) {
          case 'Wait':
            return '等待确认'
          case 'Accept':
          case 'AcceptRead':
            return '预订成功'
          case 'Refused':
          case 'RefusedRead':
            return '预订失败'
          case 'Cancel':
            return '预订取消'
          case 'Arrived':
            return '已到店'
          default:
            return status
        }
      },
      httpReserveDay(done) {
        httpReserveAdminApi.getDay(this.$route.params.shortId, this.$route.query.timeStamp, this.ui.scroller.page++, 20).then(res => {
          if (done) {
            done()
          }

          if (this.ui.scroller.page === 1) {
            this.ui.scroller.elements = []
          }

          if (res.currentPageSize === 0) {
            if (!this.ui.scroller.haveMore && this.ui.scroller.elements.length === 0) {
              this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve/empty`)
            } else {
              this.ui.scroller.haveMore = false
            }

            return
          }

          this.ui.scroller.elements = this.ui.scroller.elements.concat(res.elements)
          this.ui.scroller.elements.sort(function (a, b) {
            return a.date - b.date
          })
        })

      },
      getReserveTitle() {
        let date = new Date(parseInt(this.$route.query.timeStamp))
        return date.toLocaleDateString() + ' ' + timeApi.getWeekDesc2(date)
      },
      getReserveTime(reserve) {
        let date = new Date(parseInt(reserve.date))
        return timeApi.dateFormat(date, 'hh:mm')
      },
      btnPhone(phone) {
        return 'tel:' + phone
      },
      btnReserve(reserve) {
        this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve/${reserve.id}`)
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.dayReserve.finishPullToRefresh()
          this.$refs.dayReserve.finishInfinite(true)
        } else {
          this.httpReserveDay(done)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/reserve';
  @import '~assets/c/reserve_history';
  @import 'day';
</style>
