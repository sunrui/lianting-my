<template>
  <div>
    <div class="shop_bg"></div>

    <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>

    <div class="shop_nav">
      <div class="shop_center">
        <div class="shop_info">
          <div class="shop_info_logo">
            <div class="shop_logo_radius shop_logo_radius_center">
              <img class="shop_logo_radius_image" :src="http.res.info.logo">
            </div>
          </div>

          <div class="shop_title_name">{{http.res.shop.name}}</div>

          <div class="shop_notice">
            <div class="shop_notice_icon">公告</div>
            <span class="shop_notice_label">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</span>
          </div>

          <div class="box_divide"></div>

          <div class="shop_extra">
            <div class="shop_extra_left">
              <div class="shop_addr">
                <div class="shop_addr_icon"></div>
                <div class="shop_addr_label">{{http.res.info.address ? http.res.info.address : '尚未设置餐厅地址'}}</div>
              </div>

              <div class="box_divide"></div>

              <div class="shop_time">
                <div class="shop_time_icon"></div>
                <div class="shop_time_label">{{http.res.info.time ? http.res.info.time : '周一到周日 0:00-24:00'}}</div>
              </div>
            </div>
            <a class="shop_extra_right" :href="btnPhone()">
              <div class="shop_phone"></div>
            </a>
          </div>

          <div class="coupon" v-if="http.res.coupons.length > 0" @click="btnCouponFetch">
            <div class="coupon_label_left">满{{getLittleCouponPrice()}}元可用</div>
            <div class="coupon_divide_radius"></div>
            <div class="coupon_label_right">领取</div>
          </div>

          <div class="shop_center_footer"></div>
        </div>
      </div>

      <div class="shop_nav_blank"></div>

      <div class="shop_nav_box">
        <div class="shop_nav_box_one" v-for="nav in ui.navs" @click="btnNav(nav)">
          <img class="shop_nav_box_one_icon" :src="nav.icon">
          <div class="shop_nav_box_one_label">{{nav.name}}</div>
        </div>
      </div>
    </div>

    <div class="shop_footer">
      <div class="shop_footer_queue_icon"></div>
      <div class="shop_footer_queue_label">前方正在等待</div>
      <div class="shop_footer_queue_content">{{ui.queue.waitPeople}}</div>
      <div class="shop_footer_closed" v-if="!http.res.shop.open">餐厅已打烊</div>
    </div>

    <div class="modal_center" v-if="ui.v_wifi">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png">
      </div>

      <div class="wifi_box">
        <div class="wifi_blank_header"></div>
        <div class="wifi_box_icon"></div>

        <div class="wifi_name" v-if="http.res.wifi.name">
          <div class="wifi_name_label">账号</div>
          <div class="wifi_name_content">{{http.res.wifi.name}}</div>
        </div>
        <div class="wifi_password" v-if="http.res.wifi.password">
          <div class="wifi_password_label">密码</div>
          <div class="wifi_password_content">{{http.res.wifi.password}}</div>
        </div>

        <div class="wifi_empty" v-if="!http.res.wifi.name">很抱歉，暂时没有提供 WIFI。</div>

        <div class="blank_20"></div>
      </div>
    </div>

  </div>
</template>

<script>
  import { httpShopApi } from '../../../api/http/shop/httpShopApi'
  import { httpCouponApi } from '../../../api/http/lt/httpCouponApi'
  import { httpInfoApi } from '../../../api/http/lt/httpInfoApi'
  import { httpQueueApi } from '../../../api/http/lt/httpQueueApi'
  import { httpWifiApi } from '../../../api/http/lt/httpWifiApi'
  import { httpReserveApi } from '../../../api/http/lt/httpReserveApi'
  import { httpWallApi } from '../../../api/http/lt/httpWallApi'
  import { httpFoodApi } from '../../../api/http/lt/httpFoodApi'

  export default {
    metaInfo: {
      title: '恋厅'
    },
    middleware: 'auth',
    data() {
      return {
        ui: {
          v_cover_mask: false,
          v_wifi: false,
          navs: [
            {
              tag: 'food',
              name: '点餐',
              icon: '/img/m/shop/shop_nav_food.png',
              url: `/m/${this.$route.params.shortId}/food`
            },
            {
              tag: 'queue',
              name: '排队',
              icon: '/img/m/shop/shop_nav_queue.png',
              url: `/m/${this.$route.params.shortId}/queue`
            },
            {
              tag: 'reserve',
              name: '预订',
              icon: '/img/m/shop/shop_nav_reserve.png',
              url: `/m/${this.$route.params.shortId}/reserve`
            },
            {
              tag: 'wall',
              name: '留言墙',
              icon: '/img/m/shop/shop_nav_wall.png',
              url: `/m/${this.$route.params.shortId}/wall`
            },
            {
              tag: 'wifi',
              name: 'WIFI',
              icon: '/img/m/shop/shop_nav_wifi.png',
              url: `/m/${this.$route.params.shortId}/wifi`
            },
            {
              tag: 'me',
              name: '个人中心',
              icon: '/img/m/shop/shop_nav_me.png',
              url: `/m/${this.$route.params.shortId}/me`
            }
          ],
          queue: {
            waitPeople: 0
          }
        },
        http: {
          res: {
            shop: {},
            info: {},
            coupons: [],
            wifi: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
      this.httpCoupon()
      this.httpQueuePeople()
    },
    methods: {
      btnPhone() {
        return 'tel:' + this.http.res.info.phone
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpInfo() {
        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.http.res.info = res
        })
      },
      httpCoupon() {
        httpCouponApi.getFetch(this.$route.params.shortId).then(res => {
          this.http.res.coupons = res
        })
      },
      httpQueuePeople() {
        this.ui.queue.waitPeople = 0

        httpQueueApi.getNowAll(this.$route.params.shortId).then(res => {
          for (let index in res.elements) {
            let tableGroupNow = res.elements[index]
            this.ui.queue.waitPeople += tableGroupNow.waitPeople
          }
        })
      },
      getLittleCouponPrice() {
        let price = null

        for (let index in this.http.res.coupons) {
          let coupon = this.http.res.coupons[index]

          if (price === null || coupon.chargePrice < price) {
            price = coupon.chargePrice
          }
        }

        return parseFloat(price)
      },
      btnNav(nav) {
        if (nav.tag === 'food') {
          httpFoodApi.getGroupAll(this.$route.params.shortId, 0, 99).then(res => {
            if (res.elements.length > 0) {

              let haveFood = false
              for (let index in res.elements) {
                let categories = res.elements[index].foodCategories

                if (categories.length > 0) {
                  haveFood = true
                  break
                }
              }

              if (!haveFood) {
                this.$router.push(`/m/${this.$route.params.shortId}/food/empty`)
              } else {
                this.$router.push(nav.url)
              }
            } else {
              this.$router.push(`/m/${this.$route.params.shortId}/food/empty`)
            }
          })
        } else if (nav.tag === 'wifi') {
          this.httpWifi()
        } else if (nav.tag === 'queue') {
          httpQueueApi.getState(this.$route.params.shortId).then(res => {
            if (res.needQueues.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/queue/close`)

              return
            }

            this.$router.push(nav.url)
          })
        } else if (nav.tag === 'reserve') {
          httpReserveApi.getState(this.$route.params.shortId).then(res => {
            if (!res.enable) {
              this.$router.push(`/m/${this.$route.params.shortId}/reserve/close`)

              return
            }

            this.$router.push(nav.url)
          })
        } else if (nav.tag === 'wall') {
          httpWallApi.getAll(this.$route.params.shortId, 0, 1).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/wall/empty`)
            } else {
              this.$router.push(nav.url)
            }
          })
        } else {
          this.$router.push(nav.url)
        }
      },
      btnCoverMask() {
        this.ui.v_wifi = false
        this.ui.v_cover_mask = false
      },
      httpWifi() {
        httpWifiApi.getWifi(this.$route.params.shortId).then(res => {
          this.http.res.wifi = res
          this.ui.v_cover_mask = true
          this.ui.v_wifi = true
        })
      },
      btnCouponFetch() {
        this.$router.push(`/m/${this.$route.params.shortId}/coupon/fetch`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
