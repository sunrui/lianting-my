<template>
  <section>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="coupon in coupons.elements">
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
            <div class="coupon_title_charge_label">满100元可用</div>
          </div>
        </div>
        <div class="coupon_price">10</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：2018.06.30 至 2019.06.30</div>
          <div class="coupon_button" @click="btnFetchCoupon(coupon)">立即领取</div>
        </div>
      </div>
    </div>

    <div class="limit_coupon_label">不可用红包（1张）</div>

    <div class="box" v-for="coupon in coupons.elements">
      <div class="coupon coupon_white box_radius_header">
        <div class="coupon_title">
          <div class="coupon_title_label coupon_disable">优惠券</div>
          <div class="coupon_title_charge">
            <div class="coupon_title_charge_icon coupon_title_charge_icon_disable">{{
              coupon.type === 'FREE' ? '无门槛优惠券' :
              coupon.type === 'NEW_USER' ? '新用户' :
              coupon.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type
              }}
            </div>
            <div class="coupon_title_charge_label coupon_disable">满100元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">10</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time coupon_disable">有效期：2018.06.30 至 2019.06.30</div>
        </div>
      </div>

      <div class="coupon_limit box_radius_footer">
        <div class="coupon_limit_title">不可用原因</div>
        <div class="coupon_limit_label">· 金额未达到指定金额</div>
      </div>
    </div>

    <div class="limit_coupon_label">已过期红包（1张）</div>

    <div class="box" v-for="coupon in coupons.elements">
      <div class="coupon coupon_white box_radius_header">
        <div class="coupon_title">
          <div class="coupon_title_label coupon_disable">优惠券</div>
          <div class="coupon_title_charge">
            <div class="coupon_title_charge_icon coupon_title_charge_icon_disable">{{
              coupon.type === 'FREE' ? '无门槛优惠券' :
              coupon.type === 'NEW_USER' ? '新用户' :
              coupon.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type
              }}
            </div>
            <div class="coupon_title_charge_label coupon_disable">满100元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">10</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：2018.06.30 至 2019.06.30</div>
        </div>
      </div>
    </div>

    <div>
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
  import {httpCouponApi} from '../../../../../api/http/lt/httpCouponApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '优惠券'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '优惠券',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        },
        coupons: [],
        ui: {}
      }
    },
    created() {
      this.httpCoupon()
    },
    methods: {
      httpCoupon() {
        httpCouponApi.getAll(this.$route.params.shortId, 0, 99).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/m/${this.$route.params.shortId}/history/empty`)
            return
          }

          this.coupons = res
        })
      },
      btnFetchCoupon(coupon) {
        httpCouponApi.post(this.$route.params.shortId, coupon.id).then(res => {
          if (res.couponIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '优惠券不存在。'
            }).then(async (val) => {
              this.httpCoupon()
            })

            return
          }

          if (res.notNewUser) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '仅限新用户领取。'
            }).then(async (val) => {
              this.httpCoupon()
            })

            return
          }

          if (res.fetchLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '超过最大领取限制。'
            }).then(async (val) => {
              this.httpCoupon()
            })

            return
          }

          if (res.couponUserId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '领取优惠券',
              content: '领取成功。'
            }).then(async (val) => {
              this.httpCoupon()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/coupon';
</style>
