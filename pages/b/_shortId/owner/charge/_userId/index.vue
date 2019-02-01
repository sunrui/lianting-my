<template>
  <section>
    <nav-bar></nav-bar>
    <hr>

    <div v-if="ui.loading">
      <p>正在加载中</p>
    </div>
    <div v-else>
      <div v-bind:key="order.id" v-for="order in orders.elements">
        <div class="row">
          <div class="col-md-4">
            <p>
              {{order.status === 'WaitForPay' ? '等待支付' :
              order.status === 'Paid' ? '已支付' :
              order.status === 'NotPaid' ? '未支付' :
              order.status === 'Closed' ? '已关闭' :
              order.status === 'Finished' ? '已完成' :
              order.status
              }}
            </p>

            <div v-if="order.type === 'ForHere'">
              <p>{{order.orderTable.tableGroupName}}</p>
              <p>{{order.orderTable.tableFullNumber}}</p>
            </div>
            <div v-if="order.type === 'TakeOut'">
              <p>外卖</p>
            </div>
          </div>
          <div class="col-md-8">
            <p>{{new Date(parseInt(order.createdAt)).toLocaleString()}} -
              {{elapsedTime((order.payPaidAt ? order.payPaidAt : new Date().getTime()) - order.createdAt)}}
            </p>
            <p>{{fullFoodDetail(order)}}</p>

            <div class="row">
              <div class="col-md-6">
                <p>{{order.price}} 元</p>
              </div>
              <div class="col-md-6">
                <button @click="btnOrderOne(order)">订单详情</button>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div>
  </section>
</template>

<script>
  import NavBar from '../../../../../../components/NavBar'
  import {timeApi} from '../../../../../../api/local/timeApi'
  import {foodDetailApi} from '../../../../../../api/local/foodDetail'
  import {httpOrderAdminApi} from '../../../../../../api/http/ltorder/httpOrderAdminApi'

  export default {
    metaInfo: {
      title: '消费记录'
    },
    middleware: 'auth',
    components: {NavBar},
    data() {
      return {
        orders: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '消费记录',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      this._loadLiveOrders()
    },
    methods: {
      _loadLiveOrders() {
        httpOrderAdminApi.getAllByUserId(this.$route.params.shortId, this.$route.params.userId, 0, 0, 20).then(res => {
          this.orders = res
        })
      },
      countFood(order) {
        return foodDetailApi.countFood(order)
      },
      fullFoodDetail(order) {
        return foodDetailApi.detail(order)
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      btnOrderOne(order) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/order/${order.id}`)
      }
    }
  }
</script>

<style scoped>

</style>
