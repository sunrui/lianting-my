<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="coupon in http.res.coupons">
      <div class="coupon box_radius">
        <div class="coupon_title">
          <div class="coupon_title_label">优惠券</div>
          <div class="coupon_title_charge">
            <div class="coupon_title_charge_icon">{{
              coupon.type === 'FREE' ? '无门槛优惠券' :
              coupon.type === 'NEW_USER' ? '新用户' :
              coupon.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type
              }}
            </div>
            <div class="coupon_title_charge_label">满{{coupon.chargePrice}}元可用</div>
          </div>
        </div>
        <div class="coupon_price">{{coupon.deductPrice}}</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">自领取{{coupon.validAfterDay > 0 ? (coupon.validAfterDay + '天后') : '当日'}}可用, {{
            coupon.expiredDate }}天后过期。</div>
          <div class="coupon_button" @click="btnFetch(coupon)">立即领取</div>
        </div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpCouponApi} from '../../../../../api/http/lt/httpCouponApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '领取优惠券'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '领取优惠券',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            coupons: []
          }
        },
        ui: {}
      }
    },
    created() {
      this.httpFetch()
    },
    methods: {
      httpFetch() {
        httpCouponApi.getFetch(this.$route.params.shortId).then(res => {
          if (res.length === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}`)
            return
          }

          this.http.res.coupons = res
        })
      },
      btnFetch(coupon) {
        httpCouponApi.post(this.$route.params.shortId, coupon.id).then(res => {
          if (res.couponIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '优惠券不存在。'
            }).then(async (val) => {
              this.httpFetch()
            })

            return
          }

          if (res.notNewUser) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '仅限新用户领取。'
            }).then(async (val) => {
              this.httpFetch()
            })

            return
          }

          if (res.fetchLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '超过最大领取限制。'
            }).then(async (val) => {
              this.httpFetch()
            })

            return
          }

          if (res.couponUserId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '领取成功。'
            }).then(async (val) => {
              this.httpFetch()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/coupon';
</style>
