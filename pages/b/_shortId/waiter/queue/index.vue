<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="queue_table box_radius">
        <div class="queue_table_label_left">正在排队</div>
        <div class="queue_table_people">{{ui.queuePeople}}</div>
        <div class="queue_table_label_right">人</div>
      </div>
    </div>

    <div class="box">
      <div class="queue box_radius" v-for="tableGroup in http.res.tableGroups.elements">

        <div class="queue_table_group">
          <div class="queue_table_group_name">{{tableGroup.name}}</div>
          <div class="queue_table_group_people">({{tableGroup.minPeople}}-{{tableGroup.maxPeople}} 人)</div>
        </div>

        <div v-if="getQueueNow(tableGroup)">
          <div class="blank_10"></div>

          <div class="queue_ring">
            <div class="queue_ring_icon"></div>
            <div class="queue_ring_label">请{{getQueueNow(tableGroup).queueTicket.tableGroupNumberPrefix}}{{getQueueNow(tableGroup).queueTicket.sequence}}号顾客前往迎宾台就餐。</div>
            <div class="queue_ring_button" v-if="getQueueNow(tableGroup).queueTicket.status === 'Now'"
                 @click="btnRadio(getQueueNow(tableGroup).queueTicket.tableGroupNumberPrefix + getQueueNow(tableGroup).queueTicket.sequence)">播报
            </div>
            <div class="queue_ring_button queue_ring_button_gray" v-else>播报
            </div>
          </div>

          <div class="queue_table">
            <div class="queue_table_number">{{getQueueNow(tableGroup).queueTicket.tableGroupNumberPrefix}}{{getQueueNow(tableGroup).queueTicket.sequence}}</div>
            <div class="queue_table_extra">
              <div class="queue_table_status" v-bind:class="{
              queue_table_status_now: getQueueNow(tableGroup).queueTicket.status === 'Now',
              queue_table_status_wait: getQueueNow(tableGroup).queueTicket.status !== 'Now'
              }">{{
                getQueueNow(tableGroup).queueTicket.status === 'Now' ? '前往就餐' :
                getQueueNow(tableGroup).queueTicket.status === 'Cancel' ? '已取消' :
                getQueueNow(tableGroup).queueTicket.status === 'Expired' ? '已过号' :
                getQueueNow(tableGroup).queueTicket.status === 'Wait' ? '排队中' : getQueueNow(tableGroup).queueTicket.status
                }}
              </div>
              <div class="queue_table_status_time">已等待{{elapsedTime(new Date().getTime() - getQueueNow(tableGroup).queueTicket.createdAt)}}</div>
            </div>
          </div>

          <div class="blank_10"></div>

          <div class="queue_info_box">
            <div class="queue_info_one">
              <div class="queue_info_label">{{getQueueNow(tableGroup).sequence - 1}}桌</div>
              <div class="queue_info_name">总计排队</div>
            </div>
            <div class="queue_info_one">
              <div class="queue_info_label">{{getQueueNow(tableGroup).waitPeople}}桌</div>
              <div class="queue_info_name">正在排队</div>
            </div>
            <div class="queue_info_one">
              <div class="queue_info_label">{{getQueueNow(tableGroup).waitPeople > 0 ? elapsedTime(new Date().getTime() - getQueueNow(tableGroup).queueTicket.createdAt) :
                '--分钟'}}
              </div>
              <div class="queue_info_name">首桌等待</div>
            </div>
          </div>

          <div class="blank_30"></div>

          <div class="queue_button_box">
            <div class="button_small" v-if="getQueueNow(tableGroup).queueTicket.status === 'Wait' || getQueueNow(tableGroup).queueTicket.status === 'Now'"
                 @click="btnNext(tableGroup)">下一位
            </div>
            <div class="button_small button_gray" v-else>下一位</div>
          </div>

          <div class="blank_30"></div>
        </div>
        <div v-else class="queue_empty">{{tableGroup.needQueue ? '暂时没人排队' : '无需排队'}}</div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpQueueApi} from '../../../../../api/http/lt/httpQueueApi'
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpQueueAdminApi} from '../../../../../api/http/lt/httpQueueAdminApi'
  import {timeApi} from '../../../../../api/local/timeApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpNotifyAdminApi} from "../../../../../api/http/lt/httpNotifyAdminApi"

  export default {
    metaInfo: {
      title: '排队'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '排队',
          backUri: `/b/${this.$route.params.shortId}/waiter`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {
            queueState: {
              notice: '',
              needQueues: []
            },
            tableGroups: {},
            queueNows: {}
          }
        },
        ui: {
          queuePeople: 0
        }
      }
    },
    created() {
      this.httpState()
    },
    methods: {
      httpState() {
        httpQueueApi.getState(this.$route.params.shortId).then(res => {
          this.http.res.queueState = res
          this.httpTableGroup()
        })
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroups = res

          if (res.elements.length === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/waiter/table/empty`)
            return
          }

          for (let index in res.elements) {
            let tableGroup = res.elements[index]
            tableGroup.needQueue = false

            for (let enableQueueIndex in this.http.res.queueState.needQueues) {
              let tableGroupId = this.http.res.queueState.needQueues[enableQueueIndex]

              if (tableGroupId === tableGroup.id) {
                tableGroup.needQueue = true
                break
              }
            }
          }

          this.httpQueueNow()
        })
      },
      httpQueueNow() {
        this.ui.queuePeople = 0

        httpQueueApi.getNowAll(this.$route.params.shortId).then(res => {
          this.http.res.queueNows = res

          for (let queueNowIndex in res.elements) {
            let queueNow = res.elements[queueNowIndex]
            this.ui.queuePeople += queueNow.waitPeople
          }
        })
      },
      getQueueNow(tableGroup) {
        for (let queueNowIndex in this.http.res.queueNows.elements) {
          let queueNow = this.http.res.queueNows.elements[queueNowIndex]
          if (queueNow.tableGroupId === tableGroup.id) {
            return queueNow
          }
        }

        return null
      },
      btnRadio(tableFullNumber) {
        httpNotifyAdminApi.postRadio(this.$route.params.shortId, tableFullNumber, null).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '播报',
            content: '播报成功。'
          })
        })
      },
      btnNext(tableGroup) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '下一位',
          content: '当前排队号码将作废，您确认要呼叫下一位吗?'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpQueueAdminApi.postNext(this.$route.params.shortId, tableGroup.id, 1).then(res => {
              this.httpState()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_queue';
</style>
