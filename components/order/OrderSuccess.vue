<template>
  <div class="order_success">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_20"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <div class="status_logo_radius_image success_logo_radius_image"></div>
        </div>

        <div class="status_title">{{ getStatusTitle() }}</div>

        <div class="blank_40"></div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">下单时间</div>
          <div class="status_item_content">{{dateFormat(new Date(parseInt(http.res.order.createdAt)))}}</div>
        </div>

        <div class="status_item">
          <div class="status_item_label">共计菜数</div>
          <div class="status_item_content">{{getTotalFood()}} 份</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">餐具费</div>
          <div class="status_item_content">{{http.res.order.priceTableware}} 元</div>
        </div>
        <div class="status_item" v-if="http.res.order.priceTakeoutFee > 0">
          <div class="status_item_label">配送费</div>
          <div class="status_item_content">{{http.res.order.priceTakeoutFee}} 元</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">人数</div>
          <div class="status_item_content">{{http.res.order.people}} 人</div>
        </div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">总价</div>
          <div class="status_item_content">{{http.res.order.price}} 元</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">支付方式</div>
          <div class="status_item_content">
            {{
            http.res.order.status === 'Paid' ? '已支付' :
            http.res.order.status === 'NotPaid' ? '未支付' :
            http.res.order.status === 'Finish' ? '已完成' :
            http.res.order.status === 'Closed' ? '已关闭' : http.res.order.status
            }}
          </div>
        </div>
        <div class="blank_20"></div>
      </div>
    </div>

    <div v-if="http.res.order.type === 'Takeout' && http.res.order.status === 'NotPaid'">
      <div class="box">
        <div class="tip">
          <ul class="tip_ul">
            <li>如您未在线支付，请确认商家支持线下收款。</li>
          </ul>
        </div>
      </div>

      <div class="button_box">
       <div class="button_big" @click="btnPay">立即支付</div>
<!--       <div class="button_big" @click="btnOrder">我的订单</div>-->
      </div>
    </div>
    <div v-else>
      <div class="box">
        <div class="addition box_radius">
          <div class="addition_item">
            <div class="addition_item_label">下单菜数</div>
            <div class="addition_item_content">{{$route.query.cartSelect}} 份</div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">价格</div>
            <div class="addition_item_content success_order_price">{{$route.query.cartPrice}}</div>
          </div>
        </div>
      </div>

      <div class="box" v-if="http.res.config.prepayment && roleType === 'c'">
        <div class="tip">
          <ul class="tip_ul">
            <li>本店需要提前买单，为了您的正常用餐，请您立即支付。</li>
          </ul>
        </div>
      </div>

      <div class="button_box">
        <div v-if="canPayOnline()">
          <div v-if="http.res.config.prepayment && roleType === 'c'">
            <div class="button_big" @click="btnPay">立即支付</div>
          </div>
          <div v-else class="button_big" @click="btnFood">继续点餐</div>
        </div>
        <div v-else class="button_big" @click="btnFood">继续点餐</div>
      </div>
    </div>

    <wechat-subscribe></wechat-subscribe>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import {httpOrderApi} from '../../api/http/lt/httpOrderApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {timeApi} from '../../api/local/timeApi'
  import WechatSubscribe from '../wechat/WechatSubscribe'

  export default {
    metaInfo: {
      title: '下单成功'
    },
    middleware: 'auth',
    components: {TitleBar, WechatSubscribe},
    props: {
      roleType: {
        type: String,
        default: 'c'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '下单成功',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 220
        },
        ui: {},
        http: {
          res: {
            order: {
              createdAt: new Date().getTime()
            },
            config: {}
          }
        }
      }
    },
    mounted() {
      if (this.roleType === 'c') {
        this.title.backUri = `/c/${this.$route.params.shortId}`
      } else {
        this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}`
      }

      this.httpOrder()
      this.httpConfig()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.res.config = res

          if (res.prepayment && this.roleType === 'c') {
            this.title.title = '确认订单'
          }
        })
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res
        })
      },
      getStatusTitle() {
        if (this.http.res.config.prepayment && this.roleType === 'c') {
          return '订单尚未支付'
        }

        return this.http.res.order.type === 'Takeout' ? '外卖请求已发送给商家' : '订单已发送后厨'
      },
      getTotalFood() {
        let count = 0

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
          count += orderFood.count
        }

        return count
      },
      btnFood() {
        if (this.roleType === 'c') {
          this.$router.push(`/c/${this.$route.params.shortId}/food`)
        } else {
          this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/table`)
        }
      },
      canPayOnline() {
        if (!Boolean(this.http.res.config.openWechat) && !Boolean(this.http.res.config.openAlipay)) {
          return false
        }

        if (Boolean(this.http.res.config.openWechat)) {
          if (!wechatApi.inWechat()) {
            return false
          }
        }

        return true
      },
      btnPay() {
        // if (!this.canPayOnline()) {
        //   this.$msgBox.doModal({
        //     type: 'yes',
        //     title: '立即支付',
        //     content: '店铺尚未开通在线支付，请您线下付款。'
        //   })

        this.$router.push(`/c/${this.$route.params.shortId}/order/${this.$route.params.orderOneId}`)

        // this.$router.push({
        //   path: `/pay`,
        //   query: {
        //     type: 'order',
        //     shortId: this.$route.params.shortId,
        //     orderOneId: this.$route.params.orderOneId,
        //     price: this.http.res.order.price
        //   }
        // })
      },
      btnOrder() {
        this.$router.push(`/c/${this.$route.params.shortId}/order/history`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'OrderSuccess';
</style>
