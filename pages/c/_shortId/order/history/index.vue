<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <scroller class="scroller"
              ref="order"
              noDataText=""
              :on-refresh="onRefresh"
              refresh-text=""
              :on-infinite="onInfinite">
      <div class="box" v-for="order in ui.scroller.elements">
        <div class="list_title box_radius_header">
          <div class="list_time_icon"></div>
          <div class="list_time_label">{{dateFormat(new Date(parseInt(order.createdAt)))}}</div>
          <div class="order_history_status order_history_status_finish" v-if="order.status === 'Finish'">已完成</div>
          <div class="order_history_status order_history_status_not_paid" v-if="order.status === 'NotPaid'">未支付</div>
          <div class="order_history_status order_history_status_eating" v-if="order.status === 'Paid'">进行中</div>
          <div class="order_history_status order_history_status_closed" v-if="order.status === 'Closed'">已取消</div>
        </div>

        <div class="box_divide_radius">
          <div class="box_divide_radius_line"></div>
        </div>

        <div class="order_history box_radius_footer">
          <div class="order_history_food">
            <div class="order_history_food_content">{{getFoodContent(order)}}</div>
          </div>

          <div class="box_divide"></div>

          <div class="order_history_footer">
            <div class="order_history_label">
              <div class="order_history_price_label">总价</div>
              <div class="order_history_price_content">{{order.price}}</div>
            </div>
            <div class="order_history_label" v-if="order.orderTable">
              <div class="order_history_table_label">餐桌</div>
              <div class="order_history_table_content">{{order.orderTable.tableFullNumber}}</div>
            </div>
            <div class="order_history_label" v-else-if="order.orderTakeout">
              <div class="order_history_table_label">外卖</div>
              <div class="order_history_table_content">{{order.orderTakeout.name}}</div>
            </div>
            <div class="order_history_detail" @click="btnDetail(order)">查看详情</div>
          </div>
          <div class="blank_10"></div>
        </div>

        <div class="blank_10"></div>
      </div>

      <div class="blank_30"></div>
    </scroller>
  </div>
</template>

<script>
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {timeApi} from '../../../../../api/local/timeApi'
  import {foodDetailApi} from '../../../../../api/local/foodDetail'

  export default {
    metaInfo: {
      title: '订单记录'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          backUri: `/c/${this.$route.params.shortId}/me`,
          title: '订单记录',
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
          },
          title: ''
        }
      }
    },
    mounted() {
      this.httpOrder(null)
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      onRefresh(done) {
        this.httpOrder(done)
      },
      httpOrder(done) {
        httpOrderApi.getAll(this.$route.params.shortId, null, false, this.ui.scroller.page++, 20).then(res => {
          if (done) {
            done()
          }

          if (this.ui.scroller.page === 1) {
            this.ui.scroller.elements = []
          }

          if (res.currentPageSize === 0) {
            if (!this.ui.scroller.haveMore && this.ui.scroller.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/order/history/empty`)
            } else {
              this.ui.scroller.haveMore = false
            }

            return
          }

          this.ui.scroller.elements = this.ui.scroller.elements.concat(res.elements)
          this.ui.scroller.elements.sort(function (a, b) {
            return b.createdAt - a.createdAt
          })
        })
      },
      getFoodContent(order) {
        return foodDetailApi.detail(order)
      },
      btnDetail(order) {
        this.$router.push(`/c/${this.$route.params.shortId}/order/${order.id}`)
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.order.finishPullToRefresh()
          this.$refs.order.finishInfinite(true)
        } else {
          this.httpOrder(done)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
</style>
