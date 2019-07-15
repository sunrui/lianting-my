<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-if="ui.tableOneId && getTableTotal().order > 1">
      <div class="order_table box_radius_header">
        <div class="order_table_number">{{ui.scroller.elements[0].orderTable.tableFullNumber}}</div>
        <div class="order_table_name">{{ui.scroller.elements[0].orderTable.tableGroupName}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="order_history_footer order_history_footer_mix">
        <div class="white blank_5"></div>

        <div class="order_history_label">
          <div class="order_history_price_label">总价</div>
          <div class="order_history_price_content">{{getTableTotal().price}}</div>
        </div>
        <div class="order_history_label order_history_label_2">
          <div class="order_history_table_label">总订单数</div>
          <div class="order_history_table_content">{{getTableTotal().order}}</div>
        </div>
        <div class="order_history_detail order_history_detail_mix" @click="btnOrderReceipt()">查看详情</div>
      </div>

      <div class="white blank_5 box_radius_footer"></div>
    </div>

    <scroller class="scroller"
              v-bind:class="{scroller_order_mix: ui.tableOneId && getTableTotal().order > 1}"
              noDataText=""
              ref="bOrder"
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
            <div class="order_history_label order_history_label_2" v-if="order.orderTable">
              <div class="order_history_table_label">餐桌</div>
              <div class="order_history_table_content">{{order.orderTable.tableFullNumber}}</div>
            </div>
            <div class="order_history_label order_history_label_2" v-else-if="order.orderTakeOut">
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
  import TitleBar from '../common/TitleBar'
  import {httpOrderAdminApi} from '../../api/http/lt/httpOrderAdminApi'
  import {roleApi} from '../../api/local/roleApi'
  import {timeApi} from '../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '订单记录'
    },
    middleware: 'auth',
    components: {TitleBar},
    props: {
      date: {
        type: Number | String,
        default: null
      },
      roleType: {
        type: String,
        default: 'waiter'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '订单记录',
          backUri: `/b/${this.$route.params.shortId}/${this.roleType}`,
          theme: 'image',
          imageHeight: 220
        },
        ui: {
          scroller: {
            page: 0,
            elements: [],
            haveMore: true
          },
          tableOneId: null
        }
      }
    },
    mounted() {
      this.title.title = '订单记录 - ' + roleApi.getRoleTypeName(this.roleType)

      this.ui.tableOneId = this.$route.query.tableOneId

      this.onRefresh(null)
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      onRefresh(done) {
        this.ui.scroller.page = 0
        this.ui.scroller.haveMore = true
        this.httpOrder(done)
      },
      getTableTotal() {
        if (!Boolean(this.ui.tableOneId)) {
          return 0
        }

        let order = 0
        let price = 0

        for (let orderOneIndex in this.ui.scroller.elements) {
          let orderOne = this.ui.scroller.elements[orderOneIndex]
          if (orderOne.status === 'NotPaid' || orderOne.status === 'Paid') {
            order++
            price += orderOne.price
          }
        }

        return {
          order: order,
          price: price
        }
      },
      httpOrder(done) {
        let live = (this.roleType !== 'admin' && this.roleType !== 'retailer')

        if (Boolean(this.ui.tableOneId)) {
          httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, this.ui.tableOneId, live, this.ui.scroller.page++, 20).then(res => {
            if (done) {
              done()
            }

            if (this.ui.scroller.page === 1) {
              this.ui.scroller.elements = []
            }

            if (res.currentPageSize === 0) {
              if (!this.ui.scroller.haveMore && this.ui.scroller.elements.length === 0) {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/empty`)
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
        } else if (this.date) {
          httpOrderAdminApi.getAllByDate(this.$route.params.shortId, this.date, this.ui.scroller.page++, 20).then(res => {
            if (done) {
              done()
            }

            if (this.ui.scroller.page === 1) {
              this.ui.scroller.elements = []
            }

            if (res.currentPageSize === 0) {
              if (!this.ui.scroller.haveMore && this.ui.scroller.elements.length === 0) {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/empty`)
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
        } else {
          httpOrderAdminApi.getAll(this.$route.params.shortId, live, this.ui.scroller.page++, 20).then(res => {
            if (done) {
              done()
            }

            if (this.ui.scroller.page === 1) {
              this.ui.scroller.elements = []
            }

            if (res.currentPageSize === 0) {
              if (!this.ui.scroller.haveMore && this.ui.scroller.elements.length === 0) {
                this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/empty`)
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
        }
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
        this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/${order.id}`)
      },
      onInfinite(done) {
        if (!this.ui.scroller.haveMore) {
          this.$refs.bOrder.finishPullToRefresh()
          this.$refs.bOrder.finishInfinite(true)
        } else {
          this.httpOrder(done)
        }
      },
      btnOrderReceipt() {
        this.$router.push({
          path: `/b/${this.$route.params.shortId}/${this.roleType}/order/receipt`,
          query: {
            tableOneId: this.ui.tableOneId
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/order';
  @import 'BOrder';
</style>
