<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="shop_nav">
      <div class="shop_center shop_center_role">
        <div class="shop_info">
          <div class="shop_info_logo">
            <div class="shop_logo_radius shop_logo_radius_center">
              <img class="shop_logo_radius_image" :src="http.res.info.logo" alt="">
            </div>
          </div>

          <div class="blank_100"></div>

          <div class="shop_title">
            <div class="shop_title_name">{{http.res.shop.name}}</div>
            <div v-bind:class="{
            shop_status_open: http.res.shop.open,
            shop_status_close: !http.res.shop.open}">{{http.res.shop.open ? '营业中' : '已打烊'}}
            </div>
          </div>

          <div class="shop_menu">
            <img class="shop_menu_icon" src="/img/b/menu/b_menu_captcha.png" @click="btnCaptcha" alt="">
            <img class="shop_menu_icon" src="/img/b/menu/b_menu_ring.png" @click="btnNotifyOrder" alt="">
          </div>

          <div class="blank_30"></div>
        </div>
      </div>

      <div class="shop_nav_box shop_nav_box_role">
        <div class="shop_nav_blank"></div>

        <div class="shop_nav_box_one shop_nav_box_one_role" v-for="nav in ui.navs" @click="btnNav(nav)">
          <img class="shop_nav_box_one_icon shop_nav_box_one_icon_role" :src="nav.icon" :alt="nav.name">
          <div class="shop_nav_box_one_label">{{nav.name}}</div>
        </div>
      </div>
    </div>

    <captcha v-if="ui.vCaptcha" @closeCaptcha="closeCaptcha()" :title="ui.captcha.title" :text="ui.captcha.text"></captcha>

  </div>
</template>

<script>
  import { httpInfoApi } from '../../../../api/http/lt/httpInfoApi'
  import { httpShopApi } from '../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../components/common/TitleBar'
  import Captcha from '../../../../components/common/Captcha'
  import { httpOrderAdminApi } from '../../../../api/http/lt/httpOrderAdminApi'

  export default {
    metaInfo: {
      title: '厨师'
    },
    middleware: 'auth',
    components: { TitleBar, Captcha },
    data() {
      return {
        title: {
          canBack: false,
          title: '厨师',
          backUri: `/b/${this.$route.params.shortId}/cooker`,
          theme: 'image',
          imageHeight: 460
        },
        ui: {
          vCoverMask: false,
          vCaptcha: false,
          vWifi: false,
          captcha: {
            title: '',
            text: ''
          },
          navs: [
            {
              tag: 'table',
              name: '餐桌',
              icon: '/img/b/nav/role/b_nav_role_table.png',
              url: `/b/${this.$route.params.shortId}/cooker/table`
            },
            {
              tag: 'order',
              name: '订单',
              icon: '/img/b/nav/role/b_nav_role_order.png',
              url: `/b/${this.$route.params.shortId}/cooker/order`
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
          if (!Boolean(res.logo)) {
            res.logo = '/img/default/default_shop_logo.png'
          }

          this.http.res.info = res
        })
      },
      btnNav(nav) {
        if (nav.tag === 'order') {
          httpOrderAdminApi.getAll(this.$route.params.shortId, true, 0, 99).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/b/${this.$route.params.shortId}/cooker/order/empty`)
            } else {
              this.$router.push(nav.url)
            }
          })

          return
        }

        this.$router.push(nav.url)
      },
      btnCaptcha() {
        this.ui.captcha.title = this.http.res.shop.name
        this.ui.captcha.text = document.location.protocol + '//' + window.location.host + `/c/${this.$route.params.shortId}`
        this.ui.vCaptcha = true
      },
      closeCaptcha() {
        this.ui.vCaptcha = false
      },
      btnNotifyOrder() {
        this.$router.push(`/b/${this.$route.params.shortId}/cooker/notify`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_nav';
  @import '~assets/b/b_nav_role';
</style>
