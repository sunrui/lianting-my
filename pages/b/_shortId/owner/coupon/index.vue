<template>
  <div>
    <title-bar ref="titleBar_Coupon" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="empty" v-if="http.res.coupons.elements.length === 0">
      <img class="empty_image" src="/img/no/no_coupon.png" alt="没有优惠券">
      <div class="empty_label">没有优惠券</div>

      <div class="button_box">
        <div class="button_big" @click="btnCreate">添加优惠券</div>
      </div>
    </div>

    <div class="box" v-for="coupon in http.res.coupons.elements">
      <div class="coupon_header box_radius_header">
        <div class="badge_delete" @click="btnDelete(coupon)"></div>
        <div class="coupon_box">
          <div class="coupon_box_left">
            <div class="coupon_type_title">{{
              coupon.type === 'FREE' ? '无门槛优惠券' :
              coupon.type === 'NEW_USER' ? '新用户领取' :
              coupon.type === 'ORDER_RETURN' ? '消费满返赠' : coupon.type
              }}
            </div>
            <div class="coupon_type_name">{{
              coupon.type === 'FREE' ? '限制领取' + coupon.perLimit + '次' :
              coupon.type === 'NEW_USER' ? '仅限新用户领取' :
              coupon.type === 'ORDER_RETURN' ? '消费满' + coupon.needChargePrice + '元返赠' : coupon.type
              }}
            </div>
          </div>
          <div class="coupon_box_right">
            <div class="coupon_deduct_price">{{coupon.deductPrice}}</div>
            <div class="coupon_charge_price">满{{coupon.chargePrice}}元可使用</div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="coupon_footer box_radius_footer">
        <div class="addition_item">
          <div class="addition_item_label">自领取日{{coupon.validAfterDay}}天后可用{{coupon.expiredDate}}天后过期</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="coupon.enable" @click="btnEnable(coupon)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnable(coupon)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加优惠券</div>
    </div>
  </div>
</template>

<script>
  import {httpCouponAdminApi} from '../../../../../api/http/lt/httpCouponAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import Empty from '../../../../../components/common/Empty'

  export default {
    metaInfo: {
      title: '优惠券'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '优惠券',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 300
        },
        http: {
          res: {
            coupons: {
              elements: []
            }
          }
        }
      }
    },
    mounted() {
      this.httpCoupon()
    },
    methods: {
      httpCoupon() {
        httpCouponAdminApi.getCoupon(this.$route.params.shortId, 0, 20).then(res => {
          if (res.elements.length !== 0) {
            this.$refs.titleBar_Coupon.setTheme('image')
          }

          this.http.res.coupons = res
        })
      },
      btnCreate() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/coupon/create`)
      },
      btnDelete(coupon) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除优惠券',
          content: '用户已领取过的优惠券仍然可用，确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpCouponAdminApi.deleteCoupon(this.$route.params.shortId, coupon.id).then(res => {
              if (res.couponIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除优惠券',
                  content: '优惠券不存在。'
                })
              } else if (res.success) {
                this.httpCoupon()
              }
            })
          }
        })
      },
      btnEnable(coupon) {
        httpCouponAdminApi.putCouponEnable(this.$route.params.shortId, coupon.id, !coupon.enable).then(res => {
          if (res.couponIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '启用优惠券',
              content: '优惠券不存在。'
            })
          } else if (res.success) {
            this.httpCoupon()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
