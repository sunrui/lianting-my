<template>
  <div v-show="!ui.loading">
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
  </div>
</template>

<script>
  import { httpNotifyAdminApi } from '../../api/http/lt/httpNotifyAdminApi'
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
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {
            notifyOrders: {
              elements: []
            }
          }
        },
        ui: {
          loading: true
        }
      }
    },
    props: ['role'],
    created() {
      this.httpNotifyOrder()
    },
    methods: {
      httpNotifyOrder() {
        let types

        switch (this.role) {
          case 'admin':
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

        httpNotifyAdminApi.getOrder(this.$route.params.shortId, types, 0, 20).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.role}/notify/empty`)
            return
          }

          this.http.res.notifyOrders = res
          this.ui.loading = false
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
