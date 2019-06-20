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
          <div class="list_time_label">{{new Date(parseInt(order.createdAt)).toLocaleString()}}</div>
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
            <div class="order_history_label" v-else-if="order.orderTakeOut">
              <div class="order_history_table_label">外卖</div>
              <div class="order_history_table_content">{{order.orderTakeOut.name}}</div>
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

  export default {
    metaInfo: {
      title: '我的订单'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          backUri: `/c/${this.$route.params.shortId}/me`,
          title: '我的订单',
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
    created() {
      this.httpOrder(null)
    },
    methods: {
      onRefresh(done) {
        this.httpOrder(done)
      },
      httpOrder(done) {
        let live = this.$route.query.live
        this.title.title = live ? '实时订单' : '我的订单'

        httpOrderApi.getAll(this.$route.params.shortId, live, this.ui.scroller.page++, 20).then(res => {
          if (done) {
            done()
          }

          if (this.ui.scroller.page === 1) {
            this.ui.scroller.elements = []
          }

          if (res.currentPageSize === 0) {
            if (this.ui.scroller.page === 1) {
              this.$router.push(`/c/${this.$route.params.shortId}/order/history/empty`)
            } else {
              this.ui.scroller.haveMore = false
            }

            return
          }

          this.ui.scroller.elements = this.ui.scroller.elements.concat(res.elements)
        })
      },
      getFoodContent(order) {
        let detail = ''

        for (let index in order.orderFoods) {
          let OrderFood = order.orderFoods[index]

          detail += OrderFood.foodCategoryName

          if (parseInt(index) + 1 === order.orderFoods.length) {
            break
          } else {
            detail += ', '
          }
        }

        return detail
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

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
</style>
