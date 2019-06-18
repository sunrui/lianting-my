<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <scroller class="scroller"
              noDataText=""
              ref="takeOut"
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
              <div class="order_history_table_label">订单人</div>
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
  import TitleBar from '../../../../components/common/TitleBar'
  import {httpOrderAdminApi} from '../../../../api/http/lt/httpOrderAdminApi'

  export default {
    metaInfo: {
      title: '外卖订单'
    },
    middleware: 'auth',
    components: {TitleBar},
    props: {
      date: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        title: {
          canBack: false,
          title: '外卖订单',
          backUri: `/b/${this.$route.params.shortId}/takeout`,
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
    created() {
      this.httpOrder(null)
    },
    methods: {
      httpOrder(done) {
        httpOrderAdminApi.getTakeOut(this.$route.params.shortId, this.ui.scroller.page++, 5).then(res => {
          if (done) {
            done()
          }

          if (this.ui.scroller.page === 1) {
            this.ui.scroller.elements = []
          }

          if (res.currentPageSize === 0) {
            if (this.ui.scroller.page === 1) {
              this.$router.push(`/b/${this.$route.params.shortId}/takeout/empty`)
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
        this.$router.push(`/b/${this.$route.params.shortId}/takeout/order/${order.id}`)
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.takeOut.finishPullToRefresh()
          this.$refs.takeOut.finishInfinite(true)
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
