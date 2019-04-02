<template>
  <div v-if="!ui.loading">
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
          <div class="queue_table_group_people">({{tableGroup.minPeople}}-{{tableGroup.maxPeople}}人)</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="tableGroup.needQueue" @click="btnEnable(tableGroup.id)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnable(tableGroup.id)"></div>
          </div>
        </div>

        <div v-if="tableGroup.needQueue">
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
            <div class="button_small" v-if="getQueueNow(tableGroup).sequence > 1" @click="btnReset(tableGroup)">排队清零</div>
            <div class="button_small button_gray" v-else>排队清零</div>
          </div>

          <div class="blank_30"></div>
        </div>
        <div v-else class="queue_empty">无需排队</div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import { httpQueueApi } from '../../../../../api/http/lt/httpQueueApi'
  import { httpTableApi } from '../../../../../api/http/lt/httpTableApi'
  import { httpQueueAdminApi } from '../../../../../api/http/lt/httpQueueAdminApi'
  import { timeApi } from '../../../../../api/local/timeApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '排队'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '排队',
          backUri: `/b/${this.$route.params.shortId}/admin`,
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
          loading: true,
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
            this.$router.push(`/b/${this.$route.params.shortId}/admin/table/empty`)
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

          this.ui.loading = false
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

        return {
          sequence: 1,
          waitPeople: 0
        }
      },
      btnReset(tableGroup) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '排队清零',
          content: '所有排队号码将作废，您确认要排队清零吗?'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpQueueAdminApi.postReset(this.$route.params.shortId, tableGroup.id, 1).then(res => {
              this.httpState()
            })
          }
        })
      },
      btnEnable(tableGroupId) {
        this.http.res.queueState.needQueues = []

        for (let index in this.http.res.tableGroups.elements) {
          let tableGroup = this.http.res.tableGroups.elements[index]

          if (tableGroup.id === tableGroupId) {
            tableGroup.needQueue = !tableGroup.needQueue
          }

          if (tableGroup.needQueue) {
            this.http.res.queueState.needQueues.push(tableGroup.id)
          }
        }

        httpQueueAdminApi.putState(this.$route.params.shortId, this.http.res.queueState).then(res => {
          this.httpState()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_queue';
</style>
