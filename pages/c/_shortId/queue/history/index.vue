<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <scroller class="scroller"
              noDataText=""
              ref="queue"
              :on-infinite="onInfinite">
      <div class="box" v-for="history in ui.scroller.elements">
        <div class="list_title box_radius_header">
          <div class="list_time_icon"></div>
          <div class="list_time_label">取号时间 {{new Date(parseInt(history.createdAt)).toLocaleString()}}</div>
          <div v-if="history.status === 'Now'" class="queue_history_status queue_history_status_now">前往就餐</div>
          <div v-if="history.status === 'Wait'" class="queue_history_status queue_history_status_wait">正在排队</div>
          <div v-if="history.status === 'Expired'" class="queue_history_status queue_history_status_expired">已过号</div>
          <div v-if="history.status === 'Cancel'" class="queue_history_status queue_history_status_cancel">已取消</div>
        </div>

        <div class="box_divide_radius">
          <div class="box_divide_radius_line"></div>
        </div>

        <div class="queue_history box_radius_footer">
          <div class="queue_history_food">
            <div class="queue_history_food_label">餐桌</div>
            <div class="queue_history_food_content">{{history.tableGroupName}}</div>
          </div>

          <div class="queue_history_price">
            <div class="queue_history_price_label">取号</div>
            <div class="queue_history_price_content">{{history.tableGroupNumberPrefix}}{{history.sequence}}</div>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </scroller>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpQueueApi} from '../../../../../api/http/lt/httpQueueApi'

  export default {
    metaInfo: {
      title: '我的排队'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          backUri: `/c/${this.$route.params.shortId}/me`,
          title: '我的排队',
          theme: 'image',
          imageHeight: 300
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
    created() {
      this.httpHistory(null)
    },
    methods: {
      httpHistory(done) {
        httpQueueApi.getHistory(this.$route.params.shortId, this.ui.scroller.page, 5).then(res => {
          if (done) {
            done()
          }

          if (res.currentPageSize === 0) {
            if (this.ui.scroller.page === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/queue/history/empty`)
            } else {
              this.ui.scroller.haveMore = false
            }

            return
          }

          this.ui.scroller.elements = this.ui.scroller.elements.concat(res.elements)
        })

        this.ui.scroller.page++
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.queue.finishPullToRefresh()
          this.$refs.queue.finishInfinite(true)
        } else {
          this.httpHistory(done)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
