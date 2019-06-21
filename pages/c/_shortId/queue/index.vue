<template>
  <div class="queue">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div v-bind:class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎您的光临。'}}</div>
    </div>

    <div class="queue_notice_box">
      <div class="queue_notice">
        <div class="queue_notice_icon"></div>
        <div class="queue_notice_label">{{http.res.state.notice ? http.res.state.notice : '听到叫号请到迎宾台，过号顺延3桌安排。'}}</div>
      </div>
    </div>

    <div class="queue_content_box">
      <div class="blank_20"></div>

      <div class="queue_box">
        <div class="queue_title">
          <div class="queue_title_icon"></div>
          <div class="queue_title_label">排队取号</div>
        </div>

        <div class="blank_10"></div>

        <div class="queue_box_table" v-for="tableGroup in http.res.tableGroups.elements">
          <div class="queue_box_table_info">
            <div class="queue_box_table_title">
              <div class="queue_box_table_name">{{tableGroup.name}}</div>
              <div class="queue_box_table_private" v-if="tableGroup.privateRoom">包间</div>
            </div>
            <div class="queue_box_table_people">{{tableGroup.minPeople}}-{{tableGroup.maxPeople}}</div>
          </div>
          <div class="queue_box_table_wait_people">{{getWaitPeople(tableGroup.id)}}</div>
          <div class="queue_box_table_wait_guess">
            <div class="queue_box_table_wait_time">{{getTime(getGroupWaitSeconds(tableGroup))}}</div>
            <div class="queue_box_table_wait_time2">{{getTime2(getGroupWaitSeconds(tableGroup))}}</div>
          </div>
        </div>
      </div>

      <div class="blank_10"></div>

      <!--<div class="queue_distance">-->
      <!--<div class="queue_distance_label">距店距离 >1km</div>-->
      <!--<div class="queue_distance_goto">-->
      <!--<div class="queue_distance_goto_label">立即前往</div>-->
      <!--<div class="queue_distance_goto_icon"></div>-->
      <!--</div>-->
      <!--</div>-->

      <div class="queue_number_box" v-if="ui.vQueueNumber">
        <div class="blank_10"></div>

        <div class="box" v-for="myTicket in http.res.myTickets.elements">
          <div class="queue_number box_radius">
            <div class="queue_number_title">
              <div class="queue_number_title_icon"></div>
              <div class="queue_number_title_label">排队号码</div>
              <div class="queue_number_title_status queue_number_title_status_now" v-if="myTicket.status === 'Now'">前往就餐</div>
              <div class="queue_number_title_status queue_number_title_status_wait" v-if="myTicket.status === 'Wait'">正在排队</div>
              <div class="queue_number_title_cancel" v-if="myTicket.status === 'Wait'" @click="btnQueueCancel(myTicket)"></div>
            </div>

            <div class="queue_number_desk">
              <div class="queue_number_desk_number">{{myTicket.tableGroupNumberPrefix}}{{myTicket.sequence}}</div>
              <div class="queue_number_desk_detail">{{myTicket.tableGroupName}}</div>
            </div>

            <div class="queue_number_time">取号时间: {{new Date(parseInt(myTicket.createdAt)).toLocaleString()}}</div>

            <div class="box_divide"></div>

            <div class="queue_number_status">
              <div class="queue_number_status_wait_people">{{myTicket.waitPeople}}</div>
              <div class="queue_number_status_wait_guess">
                <div class="queue_number_status_wait_label">预计等待</div>
                <div class="queue_number_status_wait_time">{{getTime(getMyWaitSeconds(myTicket))}}</div>
                <div class="queue_number_status_wait_time2">{{getTime2(getMyWaitSeconds(myTicket))}}</div>
              </div>
            </div>

            <div class="blank_30"></div>
          </div>
        </div>

        <div class="blank_20"></div>
      </div>
    </div>

    <div v-if="!ui.vQueueNumber">
      <div class="queue_prompt">
        <div content="queue_prompt_label">为了保证您的及时用餐，最多允许 30 公里内的顾客取号，如您距店较远，建议您立即前往。</div>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnQueue">立即取号</div>
      </div>
    </div>

    <div class="box" v-if="ui.vTableSelect">
      <div class="modal_center">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">请选择餐桌</div>

        <div class="queue_table_select" v-bind:class="{
        queue_table_select_none: !tableGroup.needQueue,
        queue_table_select_yes: tableGroup.id === ui.selectTableGroupId,
        queue_table_select_no: tableGroup.id !== ui.selectTableGroupId && tableGroup.needQueue
        }" v-for="tableGroup in http.res.tableGroups.elements" @click="btnSelectTable(tableGroup)">
          <div class="queue_table_name" v-bind:class="{
        queue_table_name_none: !tableGroup.needQueue,
        queue_table_name_yes: tableGroup.id === ui.selectTableGroupId,
        queue_table_name_no: tableGroup.id !== ui.selectTableGroupId && tableGroup.needQueue
        }">{{tableGroup.name}}
          </div>
          <div class="queue_table_people" v-bind:class="{
        queue_table_people_none: !tableGroup.needQueue,
        queue_table_people_yes: tableGroup.id === ui.selectTableGroupId,
        queue_table_people_no: tableGroup.id !== ui.selectTableGroupId && tableGroup.needQueue
        }">({{tableGroup.minPeople}}-{{tableGroup.maxPeople}}人)
          </div>
          <div class="queue_table_private" v-bind:class="{
        queue_table_private_none: !tableGroup.needQueue,
        queue_table_private_yes: tableGroup.id === ui.selectTableGroupId,
        queue_table_private_no: tableGroup.id !== ui.selectTableGroupId && tableGroup.needQueue
        }" v-if="tableGroup.privateRoom">包间
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnQueueConfirm">选好了</div>
        </div>
      </div>
    </div>

    <wechat-subscribe></wechat-subscribe>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import {httpQueueApi} from '../../../../api/http/lt/httpQueueApi'
  import {httpTableApi} from '../../../../api/http/lt/httpTableApi'
  import {httpShopApi} from '../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../api/http/lt/httpInfoApi'
  import {highlightApi} from '../../../../api/local/highlightApi'
  import WechatSubscribe from '../../../../components/wechat/WechatSubscribe'

  export default {
    metaInfo: {
      title: '排队'
    },
    middleware: 'auth',
    components: {TitleBar, WechatSubscribe},
    data() {
      return {
        title: {
          canBack: true,
          title: '排队',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          vCoverMaskCart: false,
          vQueueNumber: false,
          vTableSelect: false,
          selectTableGroupId: null,
          interval: null
        },
        http: {
          res: {
            shop: {},
            info: {},
            state: {},
            tableGroups: {},
            myTickets: {},
            tableGroupNows: {}
          },
          req: {}
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()

      this.autoRefresh()
      this.ui.interval = setInterval(this.autoRefresh, 10 * 1000)
    },
    beforeDestroy() {
      if (this.ui.interval) {
        clearInterval(this.ui.interval)
        this.ui.interval = null
      }
    },
    methods: {
      autoRefresh() {
        this.httpState()
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpInfo() {
        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.http.res.info = res
        })
      },
      getWaitPeople(tableGroupId) {
        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]

          if (tableGroupNow.tableGroupId === tableGroupId) {
            return tableGroupNow.waitPeople
          }
        }

        return 0
      },
      getGroupWaitSeconds(tableGroup) {
        let seconds = 0

        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]
          if (tableGroupNow.tableGroupId === tableGroup.id && tableGroupNow.elapsedAverage) {
            seconds = tableGroupNow.elapsedAverage * tableGroupNow.waitPeople
            break
          }
        }

        return seconds
      },
      getMyWaitSeconds(myTicket) {
        let seconds = 0

        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]
          if (tableGroupNow.tableGroupId === myTicket.tableGroupId && tableGroupNow.elapsedAverage) {
            seconds = tableGroupNow.elapsedAverage * (myTicket.waitPeople > 0 ? myTicket.waitPeople : 1)
            break
          }
        }

        return seconds
      },
      getTime(seconds) {
        let day = parseInt(seconds / 60 / 60 / 24)
        let hour = parseInt(seconds / 60 / 60)
        let minute = parseInt(seconds / 60 % 60)
        let second = parseInt(seconds % 60)

        if (day > 0) {
          return `${day}`
        }

        if (hour > 0) {
          return `${hour}`
        }

        if (minute > 0) {
          return `${minute}`
        }

        if (second > 0) {
          return `${second}`
        }

        return '--'
      },
      getTime2(seconds) {
        let day = parseInt(seconds / 60 / 60 / 24)
        let hour = parseInt(seconds / 60 / 60)
        let minute = parseInt(seconds / 60 % 60)
        let second = parseInt(seconds % 60)

        if (day > 0) {
          return `天`
        }

        if (hour > 0) {
          return `小时`
        }

        if (minute > 0) {
          return `分钟`
        }

        if (second > 0) {
          return `秒`
        }

        return '分钟'
      },
      httpState() {
        this.btnCoverMask()

        httpQueueApi.getState(this.$route.params.shortId).then(res => {
          if (!res.needQueues || res.needQueues.length === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}/queue/close`)
            return
          }

          this.http.res.state = res
          this.httpTableGroup()
        })
      },
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          if (res.currentPageSize === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}/queue/close`)
            return
          }

          let haveNeedQueue = false

          for (let index in res.elements) {
            let tableGroup = res.elements[index]
            tableGroup.needQueue = false

            for (let enableQueueIndex in this.http.res.state.needQueues) {
              let tableGroupId = this.http.res.state.needQueues[enableQueueIndex]

              if (tableGroupId === tableGroup.id) {
                tableGroup.needQueue = true
                haveNeedQueue = true

                if (!this.ui.selectTableGroupId) {
                  this.ui.selectTableGroupId = tableGroup.id
                }

                break
              }
            }
          }

          if (!haveNeedQueue) {
            this.$router.push(`/c/${this.$route.params.shortId}/queue/close`)
            return
          }

          this.http.res.tableGroups = res
          this.httpNow()
        })
      },
      httpNow() {
        httpQueueApi.getNowAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroupNows = res

          this.httpMyTickets()
        })
      },
      httpMyTickets() {
        httpQueueApi.getLive(this.$route.params.shortId, 0, 1).then(res => {
          this.http.res.myTickets = res

          if (this.http.res.myTickets.elements.length > 0) {
            this.ui.vQueueNumber = true
          }
        })
      },
      btnCoverMask() {
        this.ui.vQueueNumber = false
        this.ui.vTableSelect = false
        this.ui.vCoverMask = false
      },
      btnQueue() {
        if (!this.http.res.shop.open) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '排队',
            content: '店铺已打烊。'
          })

          return
        }

        this.ui.vTableSelect = true
        this.ui.vCoverMask = true
      },
      btnQueueConfirm() {
        if (!Boolean(this.ui.selectTableGroupId)) {
          this.ui.vTableSelect = false
          this.ui.vCoverMask = false

          this.$msgBox.doModal({
            type: 'yes',
            title: '排队',
            content: '请选择餐桌类型。'
          })

          return
        }

        httpQueueApi.postOne(this.$route.params.shortId, {
          tableGroupId: this.ui.selectTableGroupId
        }).then(res => {
          this.ui.vTableSelect = false
          this.ui.vCoverMask = false

          if (res.shopClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '店铺已打烊。'
            })
          } else if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '由于商家授权限制无法接受更多排队，请联系商家升级授权。'
            })
          } else if (res.tableGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '餐桌不存在。'
            })
          } else if (res.noNeedQueue) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '当前无需排队。'
            })
          } else if (res.ticketExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '您已取过票，无需重复取票。'
            })
          } else if (res.queueTicket) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '排队',
              content: '恭喜，您已取票成功。'
            }).then(async (val) => {
              this.httpState()
            })
          }
        })
      },
      btnQueueCancel(myTicket) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '取消排队',
          content: '您的号码将作废，确认要取消吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpQueueApi.putCancel(this.$route.params.shortId, myTicket.id).then(res => {
              if (res.ticketNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '取消排队',
                  content: '排队号码不存在。'
                })
              } else if (res.ticketNotWait) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '取消排队',
                  content: '排队号码非等待中，无法取消。'
                }).then(async (val) => {
                  this.httpState()
                })
              } else if (res.success) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '取消排队',
                  content: '您已取消成功。'
                })

                this.httpState()
              }
            })
          }
        })
      },
      btnOrder() {
        this.ui.vTableSelect = !this.ui.vTableSelect
        this.ui.vCoverMask = this.ui.vTableSelect
      },
      btnSelectTable(tableGroup) {
        if (tableGroup.needQueue) {
          this.ui.selectTableGroupId = tableGroup.id
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/shop';
  @import 'index';
</style>
