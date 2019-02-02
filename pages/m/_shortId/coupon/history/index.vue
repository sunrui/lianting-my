<template>
  <section>
    <nav-bar></nav-bar>
    <hr>

    <div v-if="ui.loading">
      <p>正在加载中</p>
    </div>
    <div v-else>
      <div v-bind:key="couponUsers.id" v-for="couponUsers in couponUsers.elements">
        <hr>
        <p>{{couponUsers.orderId ? '已使用' : '未使用'}}</p>
        <p>券类型:
          {{couponUsers.type === 'FREE' ? '无门槛优惠券' :
          couponUsers.type === 'NEW_USER' ? '新用户' :
          couponUsers.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type}}
        </p>
        <p>面额 {{couponUsers.deductPrice}} 满 {{couponUsers.chargePrice}} 天可用</p>
        <p>有效时间 {{new Date(parseInt(couponUser.validAt)).toLocaleString()}}</p>
        <p>过期时间 {{new Date(parseInt(couponUser.expiredAt)).toLocaleString()}}</p>
      </div>
      <div v-if="!couponUsers.elements || couponUsers.elements.length === 0">
        <p>暂无数据</p>
      </div>
    </div>
  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpCouponApi } from '../../../../../api/http/ltorder/httpCouponApi'

  export default {
    metaInfo: {
      title: '我的优惠券'
    },
    middleware: 'auth',
    components: { NavBar },
    data() {
      return {
        couponUsers: null,
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '优惠券',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      this._loadCoupon()
    },
    methods: {
      _loadCoupon() {
        httpCouponApi.getCouponUser(this.$route.params.shortId, false, 0, 999).then(res => {
          this.couponUsers = res
        })
      }
    }
  }
</script>

<style scoped>

</style>
