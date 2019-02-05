<template>
  <section>
    <hr>

    <div v-if="ui.loading">
      <p>正在加载中</p>
    </div>
    <div v-else>
      <div v-bind:key="coupon.id" v-for="coupon in coupons">
        <hr>
        <button @click="btnFetchCoupon(coupon)">领取</button>
        <p>券类型:
          {{coupon.type === 'FREE' ? '无门槛优惠券' :
          coupon.type === 'NEW_USER' ? '新用户' :
          coupon.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type}}
        </p>
        <p>面额 {{coupon.deductPrice}} 满 {{coupon.chargePrice}} 天可用</p>
        <p>{{coupon.validAfterDay}} 天后可以使用，有效时间 {{coupon.expiredDate}} 天</p>
        <p>限制领取次数 {{coupon.perLimit}}</p>
      </div>
      <div v-if="coupons.length === 0">
        <p>暂无数据</p>
      </div>
    </div>
  </section>
</template>

<script>
  import { httpCouponApi } from '../../../../api/http/ltorder/httpCouponApi'

  export default {
    metaInfo: {
      title: '优惠券'
    },
    middleware: 'auth',
    components: { },
    data() {
      return {
        coupons: [],
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
        httpCouponApi.getCoupon(this.$route.params.shortId).then(res => {
          console.log(res)
          this.coupons = res
          this.ui.loading = false
        })
      },
      btnFetchCoupon(coupon) {
        httpCouponApi.postCouponUser(this.$route.params.shortId, coupon.id).then(res => {
          console.log(res)

          if (res.couponIdNotExists) {
            alert('优惠券不存在')
            return
          }

          if (res.notNewUser) {
            alert('仅限新用户领取')
            return
          }

          if (res.fetchLimit) {
            alert('超过领取限制')
            return
          }

          if (res.couponUserId) {
            alert('领取成功')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
