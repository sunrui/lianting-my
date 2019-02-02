<template>
  <section>
    <div v-if="ui.loading">
      <p>正在加载中</p>
    </div>
    <div v-else>
      <div v-bind:key="notifyOrder.id" v-for="notifyOrder in notifyOrders.elements">
        <p>{{ new Date(parseInt(notifyOrder.createdAt)).toLocaleString() }} -
          {{elapsedTime(notifyOrder.readAt ? notifyOrder.readAt : new Date().getTime() - notifyOrder.createdAt)}}</p>
        <div class="row">
          <div class="col-md-4">
            <p>{{notifyOrder.unread ? '(新)' : ''}}</p>
            <p>{{notifyOrder.tableGroupName}}</p>
            <p>{{notifyOrder.tableFullNumber}}</p>
          </div>
          <div class="col-md-5">
            {{notifyOrder.type === 'New' ? '顾客提交了新的订单，点击查看详情。' :
            notifyOrder.type === 'Paid' ? '顾客支付了订单，点击查看详情。' :
            notifyOrder.type === 'FoodAdd' ? '顾客选择了加菜，点击查看详情。' :
            notifyOrder.type === 'FoodReturn' ? '顾客选择了退菜，点击查看详情。' :
            notifyOrder.type === 'FoodCooked' ? '厨师已完成菜谱，点击查看详情。' :
            notifyOrder.type
            }}
          </div>
          <div class="col-md-3">
            <button @click="btnOrder(notifyOrder)">查看订单</button>
            <button v-if="notifyOrder.unread && role !== 'waiter'" @click="btnMarkRead(notifyOrder)">标记已读</button>
          </div>
        </div>
        <hr>
      </div>
      <div v-if="notifyOrders.elements.length === 0">
        <p>暂无数据</p>
      </div>
    </div>
  </section>
</template>

<script>
  import {timeApi} from '../api/local/timeApi'
  import {httpNotifyAdminApi} from '../api/http/ltorder/httpNotifyAdminApi'

  export default {
    middleware: 'auth',
    data() {
      return {
        notifyOrders: {},
        shortId: null,
        types: null,
        ui: {}
      }
    },
    computed: {
      role: function() {
        return this.$store.state.notify.role
      }
    },
    created() {
      switch (this.role) {
        case 'waiter': {
          this.types = 'New, FoodAdd, FoodCooked, FoodReturn, Paid'
          break
        }
        case 'cooker': {
          this.types = 'New, FoodAdd, FoodCooked, FoodReturn'
          break
        }
        case 'cashier': {
          this.types = 'Paid'
          break
        }
      }

      this.shortId = this.$route.params.shortId

      this._loadnotifyOrders()
    },
    methods: {
      _loadnotifyOrders() {


        httpNotifyAdminApi.getnotifyOrder(this.shortId, true, this.types, 0, 20).then(res => {
          this.notifyOrders = res
        })
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      btnOrder(notifyOrder) {
        this.$router.push(`/b/${this.shortId}/${this.role}/order/${notifyOrder.orderOneId}`)
      },
      btnMarkRead(notifyOrder) {
        httpNotifyAdminApi.putNotifyOrderRead(this.shortId, notifyOrder.id).then(res => {
          this.ui.loading = false

          if (res.notifyOrderIdNotExists) {
            alert('消息号不存在')
          } else if (res.success) {
            alert('标识成功')
          }

          this._loadnotifyOrders()
        })
      }
    }
  }
</script>

<style scoped>

</style>
