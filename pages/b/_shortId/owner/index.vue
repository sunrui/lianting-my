<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="shop_bg shop_bg_owner"></div>

    <div class="shop_nav">
      <div class="shop_center shop_center_owner">
        <div class="shop_info">
          <div class="shop_info_logo">
            <div class="shop_logo_radius shop_logo_radius_center">
              <img class="shop_logo_radius_image" :src="http.res.info.logo">
            </div>
          </div>

          <div class="blank_100"></div>

          <div class="shop_title">
            <div class="shop_title_name">{{http.res.shop.name}}</div>
            <div class="shop_title_license">
              <div class="shop_title_license_king"></div>
              <div class="shop_title_license_label">{{
                http.res.shop.licenseType === 'Free' ? '免费会员' :
                http.res.shop.licenseType === 'Normal' ? '标准会员' :
                http.res.shop.licenseType === 'Senior' ? '旗舰会员' : http.res.shop.licenseType
                }}
              </div>
            </div>
          </div>

          <div class="shop_expired_date">{{new Date(parseInt(http.res.shop.licenseExpiredAt)).toLocaleDateString()}} 过期</div>
          <div class="shop_charge" @click="btnLicense">管理续费</div>

          <div class="blank_30"></div>
        </div>
      </div>

      <div class="shop_nav_box shop_nav_box_owner">
        <div class="shop_nav_blank"></div>

        <div class="shop_nav_box_one shop_nav_box_one_owner" v-for="nav in ui.navs" @click="btnNav(nav)">
          <img class="shop_nav_box_one_icon shop_nav_box_one_icon_owner" :src="nav.icon">
          <div class="shop_nav_box_one_label">{{nav.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { httpInfoApi } from '../../../../api/http/ltorder/httpInfoApi'
  import { httpShopApi } from '../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '我的店铺'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: false,
          title: '我的店铺',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 0
        },
        ui: {
          v_cover_mask: false,
          v_wifi: false,
          navs: [
            {
              tag: 'info',
              name: '资料',
              icon: '/img/b/nav/owner/b_nav_owner_info.png',
              url: `/b/${this.$route.params.shortId}/owner/info`
            },
            {
              tag: 'food',
              name: '餐食',
              icon: '/img/b/nav/owner/b_nav_owner_food.png',
              url: `/b/${this.$route.params.shortId}/owner/food`
            },
            {
              tag: 'table',
              name: '餐桌',
              icon: '/img/b/nav/owner/b_nav_owner_table.png',
              url: `/b/${this.$route.params.shortId}/owner/table`
            },
            // {
            //   tag: 'order',
            //   name: '订单',
            //   icon: '/img/b/nav/owner/b_nav_owner_order.png',
            //   url: `/b/${this.$route.params.shortId}/owner/order`
            // },
            {
              tag: 'role',
              name: '人事',
              icon: '/img/b/nav/owner/b_nav_owner_role.png',
              url: `/b/${this.$route.params.shortId}/owner/role`
            },
            // {
            //   tag: 'user',
            //   name: '顾客',
            //   icon: '/img/b/nav/owner/b_nav_owner_user.png',
            //   url: `/b/${this.$route.params.shortId}/owner/user`
            // },
            {
              tag: 'queue',
              name: '排队',
              icon: '/img/b/nav/owner/b_nav_owner_queue.png',
              url: `/b/${this.$route.params.shortId}/owner/queue`
            },
            {
              tag: 'reserve',
              name: '预订',
              icon: '/img/b/nav/owner/b_nav_owner_reserve.png',
              url: `/b/${this.$route.params.shortId}/owner/reserve`
            },
            {
              tag: 'pay',
              name: '支付',
              icon: '/img/b/nav/owner/b_nav_owner_pay.png',
              url: `/b/${this.$route.params.shortId}/owner/pay`
            },
            {
              tag: 'coupon',
              name: '优惠券',
              icon: '/img/b/nav/owner/b_nav_owner_coupon.png',
              url: `/b/${this.$route.params.shortId}/owner/coupon`
            },
            {
              tag: 'wifi',
              name: 'WIFI',
              icon: '/img/b/nav/owner/b_nav_owner_wifi.png',
              url: `/b/${this.$route.params.shortId}/owner/wifi`
            },
            {
              tag: 'captcha',
              name: '二维码',
              icon: '/img/b/nav/owner/b_nav_owner_captcha.png',
              url: `/b/${this.$route.params.shortId}/owner/captcha`
            }
          ]
        },
        http: {
          res: {
            shop: {},
            info: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
    },
    methods: {
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
      btnNav(nav) {
        this.$router.push(nav.url)
      },
      btnLicense() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/license`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_nav';
  @import '~assets/b/b_shop';
  @import 'index';
</style>
