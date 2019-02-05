<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image success_logo_radius_image">
        </div>

        <div class="status_title">订单已发送后厨</div>

        <div class="blank_40"></div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">订单号</div>
          <div class="status_item_content">{{http.res.order.id}}</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">就餐人数</div>
          <div class="status_item_content">{{http.res.order.people}} 人</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">共计菜数</div>
          <div class="status_item_content">{{getTotalFood()}} 份</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">总价</div>
          <div class="status_item_content">{{getTotalPrice()}} 元</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">支付方式</div>
          <div class="status_item_content">
            {{
            http.res.order.status === 'Paid' ? '已支付' :
            http.res.order.status === 'NotPaid' ? '未支付' :
            http.res.order.status === 'Finished' ? '已完成' :
            http.res.order.status === 'Closed' ? '已关闭' : http.res.order.status
            }}
          </div>
        </div>
        <div class="status_item">
          <div class="status_item_label">下单时间</div>
          <div class="status_item_content">{{new Date(parseInt(http.res.order.createdAt)).toLocaleString()}}</div>
        </div>

        <div class="status_footer"></div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">下单菜数</div>
          <div class="addition_item_content">{{ui.cart.select}} 份</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">价格</div>
          <div class="addition_item_content success_order_price">{{ui.cart.price}}</div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnFood">继续点餐</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../common/TitleBar'
  import { httpOrderApi } from '../../api/http/lt/httpOrderApi'

  export default {
    metaInfo: {
      title: '下单成功'
    },
    middleware: 'auth',
    components: { TitleBar },
    props: {
      roleWaiter: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '下单成功',
          backUri: this.roleWaiter ? `/b/${this.$route.params.shortId}/waiter` : `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 220
        },
        ui: {
          cart: {
            select: '',
            price: ''
          }
        },
        http: {
          res: {
            order: {}
          }
        }
      }
    },
    created() {
      this.ui.cart.select = this.$route.query.cartSelect
      this.ui.cart.price = this.$route.query.cartPrice

      this.httpOrder()
    },

    methods: {
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.params.orderOneId).then(res => {
          this.http.res.order = res
        })
      },
      getTotalFood() {
        let count = 0

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
          count += orderFood.count
        }

        return count
      },
      getTotalPrice() {
        let price = 0

        for (let index in this.http.res.order.orderFoods) {
          let orderFood = this.http.res.order.orderFoods[index]
          price += orderFood.count * orderFood.foodPrice
        }

        price += this.http.res.order.priceTableware

        return price
      },
      btnFood() {
        if (this.roleWaiter) {
          this.$router.push(`/b/${this.$route.params.shortId}/waiter/table`)
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/food`)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'OrderSuccess';
</style>
