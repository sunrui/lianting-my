<template>
  <div v-if="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="coupon in http.res.coupon.valid" @click="btnChooseCoupon(coupon)">
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
          <div class="coupon_expired_time">有效期：{{
            new Date(parseInt(coupon.validAt)).toLocaleDateString() }} 至 {{
            new Date(parseInt(coupon.expiredAt)).toLocaleDateString()
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="limit_coupon_label" v-if="http.res.coupon.notPriceRich.length > 0 ||
    http.res.coupon.notDay.length > 0 || http.res.coupon.expired.length > 0 || http.res.coupon.used.length > 0">
      不可用红包 ({{http.res.coupon.notDay.length + http.res.coupon.notPriceRich.length + http.res.coupon.expired.length + http.res.coupon.used.length}}张)
    </div>

    <div class="box" v-for="coupon in http.res.coupon.notDay">
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
            <div class="coupon_title_charge_label coupon_disable">满{{coupon.chargePrice}}元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">{{coupon.deductPrice}}</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：{{
            new Date(parseInt(coupon.validAt)).toLocaleDateString() }} 至 {{
            new Date(parseInt(coupon.expiredAt)).toLocaleDateString()
            }}
          </div>
        </div>
      </div>
      <div class="coupon_limit box_radius_footer">
        <div class="coupon_limit_title">不可用原因</div>
        <div class="coupon_limit_label">· 未到使用时间</div>
      </div>
    </div>

    <div class="box" v-for="coupon in http.res.coupon.notPriceRich">
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
            <div class="coupon_title_charge_label coupon_disable">满{{coupon.chargePrice}}元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">{{coupon.deductPrice}}</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：{{
            new Date(parseInt(coupon.validAt)).toLocaleDateString() }} 至 {{
            new Date(parseInt(coupon.expiredAt)).toLocaleDateString()
            }}
          </div>
        </div>
      </div>
      <div class="coupon_limit box_radius_footer">
        <div class="coupon_limit_title">不可用原因</div>
        <div class="coupon_limit_label">· 金额未达到指定金额</div>
      </div>
    </div>

    <div class="box" v-for="coupon in http.res.coupon.expired">
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
            <div class="coupon_title_charge_label coupon_disable">满{{coupon.chargePrice}}元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">{{coupon.deductPrice}}</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：{{
            new Date(parseInt(coupon.validAt)).toLocaleDateString() }} 至 {{
            new Date(parseInt(coupon.expiredAt)).toLocaleDateString()
            }}
          </div>
        </div>
      </div>
      <div class="coupon_limit box_radius_footer">
        <div class="coupon_limit_title">不可用原因</div>
        <div class="coupon_limit_label">· 已过期</div>
      </div>
    </div>

    <div class="box" v-for="coupon in http.res.coupon.used">
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
            <div class="coupon_title_charge_label coupon_disable">满{{coupon.chargePrice}}元可用</div>
          </div>
        </div>
        <div class="coupon_price coupon_price_disable">{{coupon.deductPrice}}</div>

        <div class="box_divide"></div>

        <div class="coupon_footer">
          <div class="coupon_expired_time">有效期：{{
            new Date(parseInt(coupon.validAt)).toLocaleDateString() }} 至 {{
            new Date(parseInt(coupon.expiredAt)).toLocaleDateString()
            }}
          </div>
        </div>
      </div>
      <div class="coupon_limit box_radius_footer">
        <div class="coupon_limit_title">不可用原因</div>
        <div class="coupon_limit_label">· 已使用</div>
      </div>
    </div>

    <div class="blank_100"></div>
    <div class="blank_20"></div>

    <div class="coupon_choose_none" @click="btnChooseNone">不使用任何优惠券</div>
  </div>
</template>

<script>
  import {httpCouponApi} from '../../../../../api/http/lt/httpCouponApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '我的优惠券'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '我的优惠券',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            coupon: {
              valid: [],
              notDay: [],
              notPriceRich: [],
              expired: [],
              used: []
            }
          }
        },
        ui: {
          loading: true
        }
      }
    },
    created() {
      this.httpCoupon()
    },
    methods: {
      httpCoupon() {
        httpCouponApi.getAll(this.$route.params.shortId, 0, 99).then(res => {
          if (res.elements.length === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}/history/empty`)
            return
          }

          for (let index in res.elements) {
            let coupon = res.elements[index]

            if (Boolean(coupon.orderId)) {
              this.http.res.coupon.used.push(coupon)
              continue
            }

            if (new Date().getTime() < coupon.validAt) {
              this.http.res.coupon.notDay.push(coupon)
              continue
            }

            if (new Date().getTime() > coupon.expiredAt) {
              this.http.res.coupon.expired.push(coupon)
              continue
            }

            if (this.$route.query.price < coupon.chargePrice) {
              this.http.res.coupon.notPriceRich.push(coupon)
              continue
            }

            this.http.res.coupon.valid.push(coupon)
          }

          this.ui.loading = false
        })
      },
      btnChooseCoupon(coupon) {
        this.$router.push({
          path: `/c/${this.$route.params.shortId}/order/${this.$route.query.orderOneId}`,
          query: {
            couponId: coupon.id,
            deductPrice: coupon.deductPrice
          }
        })
      },
      btnChooseNone() {
        this.$router.push(`/c/${this.$route.params.shortId}/order/${this.$route.query.orderOneId}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/coupon';
  @import 'index';
</style>
