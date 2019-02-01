<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="order in http.res.orders.elements">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{new Date(parseInt(order.createdAt)).toLocaleString()}}</div>
        <div class="order_history_status order_history_status_finish" v-if="order.status === 'Finished'">已完成</div>
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
          <div class="order_history_price_label">总价</div>
          <div class="order_history_price_content">{{order.price}}</div>
          <div class="order_history_detail" @click="btnDetail(order)">查看详情</div>
        </div>
        <div class="blank_10"></div>
      </div>

      <div class="blank_10"></div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../components/TitleBar'
  import { httpOrderAdminApi } from '../../api/http/ltorder/httpOrderAdminApi'

  export default {
    metaInfo: {
      title: '订单记录'
    },
    middleware: 'auth',
    components: { TitleBar },
    props: {
      role: {
        type: String,
        default: 'waiter'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '订单记录',
          backUri: `/b/${this.$route.params.shortId}/waiter`,
          theme: 'image',
          imageHeight: 220
        },
        ui: {},
        http: {
          res: {
            orders: {}
          }
        }
      }
    },
    created() {
      this.title.backUri = `/b/${this.$route.params.shortId}/${this.role}`

      let tableOneId = this.$route.query.tableOneId
      if (Boolean(tableOneId)) {
        httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, tableOneId, 1, 0, 999).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.role}/order/empty`)
            return
          }

          res.elements.sort(function(a, b) {
            return b.createdAt - a.createdAt
          })

          this.http.res.orders = res
        })
      } else {
        httpOrderAdminApi.getAll(this.$route.params.shortId, 1, 0, 999).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.role}/order/empty`)
            return
          }

          res.elements.sort(function(a, b) {
            return b.createdAt - a.createdAt
          })

          this.http.res.orders = res
        })
      }
    },
    methods: {
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
        this.$router.push(`/b/${this.$route.params.shortId}/${this.role}/order/${order.id}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import '~assets/scss/order.scss';
</style>
