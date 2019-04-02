<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div v-if="roleType === 'Waiter' || roleType === 'Cooker'">
          <div class="addition_item">
            <div class="addition_item_label">接收点餐通知</div>
            <div class="addition_item_check">
              <div class="addition_item_check_on" v-if="http.req.rolePush.pushOrder" @click="btnPushOrder(false)"></div>
              <div class="addition_item_check_off" v-else @click="btnPushOrder(true)"></div>
            </div>
          </div>
        </div>

        <div v-if="roleType === 'Waiter'">
          <div class="box_divide"></div>
          <div class="addition_item_label">接收排队通知</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.rolePush.pushQueue" @click="btnPushQueue(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPushQueue(true)"></div>
          </div>
        </div>

        <div v-if="roleType === 'Waiter'">
          <div class="box_divide"></div>
          <div class="addition_item_label">接收预订通知</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.rolePush.pushReserve" @click="btnPushReserve(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPushReserve(true)"></div>
          </div>
        </div>

        <div v-if="roleType === 'Waiter' || roleType === 'Cashier'">
          <div class="box_divide"></div>
          <div class="addition_item_label">接收支付通知</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.rolePush.pushPay" @click="btnPushPay(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPushPay(true)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from "../common/TitleBar"
  import {httpPushAdminApi} from "../../api/http/lt/httpPushAdminApi"

  export default {
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '微信推送',
          backUri: `/b/${this.$route.params.shortId}/${this.roleType.toLowerCase()}`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          req: {
            rolePush: {
              roleType: this.roleType,
              pushQueue: false,
              pushOrder: false,
              pushReserve: false,
              pushPay: false
            }
          }
        }
      }
    },
    props: {
      roleType: {
        type: String,
        default: 'Waiter'
      }
    },
    created() {
      this.httpPush()
    },
    methods: {
      httpPush() {
        httpPushAdminApi.get(this.$route.params.shortId, this.roleType).then(res => {
          this.http.req.rolePush = res
        })
      },
      httpPushUpdate() {
        httpPushAdminApi.put(this.$route.params.shortId, this.http.req.rolePush).then(res => {
        })
      },
      btnPushOrder(enable) {
        this.http.req.rolePush.pushOrder = enable
        this.httpPushUpdate()
      },
      btnPushQueue(enable) {
        this.http.req.rolePush.pushQueue = enable
        this.httpPushUpdate()
      },
      btnPushReserve(enable) {
        this.http.req.rolePush.pushReserve = enable
        this.httpPushUpdate()
      },
      btnPushPay(enable) {
        this.http.req.rolePush.pushPay = enable
        this.httpPushUpdate()
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
