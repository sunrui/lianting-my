<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="history in http.res.histories.elements">
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

    <div class="history_footer"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/TitleBar'
  import {httpQueueApi} from '../../../../../api/http/ltorder/httpQueueApi'

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
          title: '我的排队',
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            histories: {}
          }
        }
      }
    },
    created() {
      this.httpHistory()
    },
    methods: {
      httpHistory() {
        httpQueueApi.getHistory(this.$route.params.shortId, 0, 20).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/m/${this.$route.params.shortId}/queue/history/empty`)
            return
          }

          this.http.res.histories = res
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import 'index';
</style>
