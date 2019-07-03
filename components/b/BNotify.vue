<template>
  <div>
    <title-bar ref="titleBar_BNotify" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <scroller class="scroller"
              noDataText=""
              ref="bNotifyScroller"
              :on-refresh="onRefresh"
              refresh-text=""
              :on-infinite="onInfinite">
      <div v-for="notifyOrder in ui.scroller.elements">
        <div class="box">
          <div class="list_title box_radius_header">
            <div class="list_time_icon"></div>
            <div class="list_time_label">{{dateFormat(new Date(parseInt(notifyOrder.createdAt)))}}</div>
            <div class="notify_type">
              <div class="notify_type_status" v-bind:class="{
          order_food_button_cooking: notifyOrder.type === 'New' || notifyOrder.type === 'FoodAdd',
          order_food_button_finish: notifyOrder.type === 'Paid',
          order_food_button_cooked: notifyOrder.type === 'FoodCooked',
          order_food_button_return: notifyOrder.type === 'FoodReturn',
          }"> {{
                notifyOrder.type === 'New' ? '新订单' :
                notifyOrder.type === 'Paid' ? '已支付' :
                notifyOrder.type === 'FoodAdd' ? '加菜' :
                notifyOrder.type === 'FoodCooked' ? '已做好' :
                notifyOrder.type === 'FoodReturn' ? '退菜' : notify.type
                }}
              </div>
            </div>
          </div>

          <div class="box_divide_radius">
            <div class="box_divide_radius_line"></div>
          </div>

          <div class="notify_detail box_radius_footer">
            <div class="blank_20"></div>

            <div class="notify_message" v-if="notifyOrder.content">{{notifyOrder.content}}</div>

            <div class="notify_table_label">餐桌</div>
            <div class="notify_table_number">{{notifyOrder.tableFullNumber}}</div>
            <div class="notify_detail_button" @click="btnOrder(notifyOrder.orderOneId)">查看详情</div>

            <div class="blank_20"></div>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </scroller>
  </div>
</template>

<script>
  import {httpNotifyAdminApi} from '../../api/http/lt/httpNotifyAdminApi'
  import TitleBar from '../common/TitleBar'
  import {roleApi} from '../../api/local/roleApi'
  import {timeApi} from '../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '最新消息'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '最新消息',
          backUri: `/b/${this.$route.params.shortId}/${this.roleType}`,
          theme: 'image',
          imageHeight: 220
        },
        http: {},
        ui: {
          scroller: {
            page: 0,
            elements: [],
            haveMore: true
          },
          interval: null
        }
      }
    },
    props: {
      roleType: {
        type: String,
        default: 'waiter'
      }
    },
    beforeDestroy() {
      if (this.ui.interval) {
        clearInterval(this.ui.interval)
        this.ui.interval = null
      }
    },
    mounted() {
      this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}`
      this.$refs.titleBar_BNotify.setBackUri(this.title.backUri)
      this.title.title = '最新消息 - ' + roleApi.getRoleTypeName(this.roleType)

      this.autoRefresh()
      this.ui.interval = setInterval(this.autoRefresh, 10 * 1000)
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      autoRefresh() {
        this.onRefresh(null)
      },
      onRefresh(done) {
        this.ui.scroller.page = 0
        this.ui.scroller.haveMore = true
        this.httpNotifyOrder(done)
      },
      httpNotifyOrder(done) {
        let types

        switch (this.roleType) {
          case 'admin':
          case 'cooker':
          case 'cashier':
          case 'waiter':
          default: {
            types = 'New, FoodAdd, FoodCooked, FoodReturn, Paid'
            break
          }
        }

        httpNotifyAdminApi.getOrder(this.$route.params.shortId, types, this.ui.scroller.page++, 20).then(res => {
          if (done) {
            done()
          }

          if (this.ui.scroller.page === 1) {
            this.ui.scroller.elements = []
          }

          if (res.currentPageSize === 0) {
            if (this.ui.scroller.page === 1) {
              this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/notify/empty`)
            } else {
              this.ui.scroller.haveMore = false
            }

            return
          }

          this.ui.scroller.elements = this.ui.scroller.elements.concat(res.elements)
        })
      },
      btnOrder(orderOneId) {
        this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/${orderOneId}`)
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.bNotifyScroller.finishPullToRefresh()
          this.$refs.bNotifyScroller.finishInfinite(true)
        } else {
          this.httpNotifyOrder(done)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "BOrderOne";
  @import 'BNotify';
</style>
