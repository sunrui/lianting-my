<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div v-for="notifyOrder in http.res.notifyOrders.elements">
      <div class="box">
        <div class="list_title box_radius_header">
          <div class="list_time_icon"></div>
          <div class="list_time_label">{{new Date(parseInt(notifyOrder.createdAt)).toLocaleString()}}</div>
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

        <div class="notify_detail">
          <div class="blank_20"></div>

          <div class="notify_message">{{
            notifyOrder.type === 'New' ? '顾客提交了新的订单，点击可查看详情。' :
            notifyOrder.type === 'Paid' ? '顾客支付了订单，点击可查看详情。' :
            notifyOrder.type === 'FoodAdd' ? '顾客选择了加菜，点击可查看详情。' :
            notifyOrder.type === 'FoodReturn' ? '顾客完成了退菜，点击可查看详情。' :
            notifyOrder.type === 'FoodCooked' ? '厨师已做好餐食，点击可查看详情。' :
            notifyOrder.type
            }}
          </div>

          <div class="notify_table_label">餐桌</div>
          <div class="notify_table_number">{{notifyOrder.tableGroupName}} {{notifyOrder.tableFullNumber}}</div>
          <div class="notify_detail_button" @click="btnOrder(notifyOrder.orderOneId)">查看详情</div>

          <div class="blank_10"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { httpNotifyAdminApi } from '../../api/http/ltorder/httpNotifyAdminApi'
  import TitleBar from '../common/TitleBar'

  export default {
    metaInfo: {
      title: '最新消息'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '最新消息',
          backUri: `/b/${this.$route.params.shortId}/${this.role}`,
          theme: 'white',
          imageHeight: 0
        },
        http: {
          res: {
            notifyOrders: {
              elements: []
            }
          }
        }
      }
    },
    props: ['role'],
    created() {
      this.httpNotifyOrder()
    },
    methods: {
      httpNotifyOrder() {
        let types = []

        switch (this.role) {
          case 'waiter': {
            types = 'New, FoodAdd, FoodCooked, FoodReturn, Paid'
            break
          }
          case 'cooker': {
            types = 'New, FoodAdd, FoodReturn'
            break
          }
          case 'cashier': {
            types = 'New, Paid'
            break
          }
        }

        httpNotifyAdminApi.getNotifyOrder(this.$route.params.shortId, types, 0, 999).then(res => {
          this.http.res.notifyOrders = res
        })
      },
      btnOrder(orderOneId) {
        this.$router.push(`/b/${this.$route.params.shortId}/${this.role}/order/${orderOneId}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "BOrderOne";
  @import 'BNotify';
</style>
