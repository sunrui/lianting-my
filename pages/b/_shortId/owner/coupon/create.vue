<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">面额</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入面额" maxlength="20"
                          v-model="http.req.coupon.deductPrice"></currency-input>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">满多少元可用</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入金额" maxlength="20"
                          v-model="http.req.coupon.chargePrice"></currency-input>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">多少天后才可以使用</div>
          <input class="addition_item_input" placeholder="请输入天数" maxlength="3"
                 oninput="this.value=this.value.replace(/[^0-9]/g,''); if (this.value === '') this.value = 0;"
                 v-model="http.req.coupon.validAfterDay">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">有效时间</div>
          <input class="addition_item_input" placeholder="请输入天数" maxlength="3"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                 v-model="http.req.coupon.expiredDate">
        </div>
      </div>
    </div>

    <div class="role_title">领取规则</div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">新用户</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.coupon.type === 'NEW_USER'"></div>
            <div class="addition_item_check_off" v-else @click="btnCloseRole('NEW_USER')"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">免费领取</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.coupon.type === 'FREE'"></div>
            <div class="addition_item_check_off" v-else @click="btnCloseRole('FREE')"></div>
          </div>
        </div>

        <div class="box_divide" v-if="http.req.coupon.type === 'FREE'"></div>

        <div class="addition_item" v-if="http.req.coupon.type === 'FREE'">
          <div class="addition_item_label">领取次数</div>
          <input class="addition_item_input" placeholder="请输入次数" maxlength="3"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                 v-model="http.req.coupon.perLimit">
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">消费满返赠</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.coupon.type === 'ORDER_RETURN'"></div>
            <div class="addition_item_check_off" v-else @click="btnCloseRole('ORDER_RETURN')"></div>
          </div>
        </div>

        <div class="box_divide" v-if="http.req.coupon.type === 'ORDER_RETURN'"></div>

        <div class="addition_item" v-if="http.req.coupon.type === 'ORDER_RETURN'">
          <div class="addition_item_label">消费满多少元返赠</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入金额" maxlength="20"
                          v-model="http.req.coupon.needChargePrice"></currency-input>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">添加</div>
    </div>
  </div>
</template>

<script>
  import { httpCouponAdminApi } from '../../../../../api/http/ltorder/httpCouponAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import CurrencyInput from '../../../../../components/common/CurrencyInput'

  export default {
    metaInfo: {
      title: '添加优惠券'
    },
    middleware: 'auth',
    components: { TitleBar, CurrencyInput },
    data() {
      return {
        title: {
          canBack: true,
          title: '添加优惠券',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            coupon: {
              deductPrice: null,
              chargePrice: null,
              needChargePrice: null,
              validAfterDay: null,
              expiredDate: null,
              type: 'NEW_USER',
              perLimit: null
            }
          }
        }
      }
    },
    methods: {
      btnCloseRole(type) {
        this.http.req.coupon.type = type
      },
      btnCreate() {
        if (!Boolean(this.http.req.coupon.deductPrice)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入面额。'
          })

          return
        }

        if (this.http.req.coupon.chargePrice === null) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入满多少元可用。'
          })

          return
        }

        if (!this.http.req.coupon.validAfterDay) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入多少天后可用。'
          })

          return
        }

        if (!Boolean(this.http.req.coupon.expiredDate) || this.http.req.coupon.expiredDate <= 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入有效天数。'
          })

          return
        }

        if (this.http.req.coupon.type === 'FREE' && !this.http.req.coupon.perLimit) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入领取次数。'
          })

          return
        }

        if (this.http.req.coupon.type === 'ORDER_RETURN' && this.http.req.coupon.needChargePrice === null) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加优惠券',
            content: '请输入消费满多少元返赠。'
          })

          return
        }

        httpCouponAdminApi.postCoupon(this.$route.params.shortId, this.http.req.coupon).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加优惠券',
              content: '超过最大授权限制。'
            })

            return
          }

          if (res.couponId) {
            this.$router.back()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'create';
</style>
