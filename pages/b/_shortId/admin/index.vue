<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="shop_nav">
      <div class="shop_center">
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
            <img class="shop_menu_icon" src="/img/b/menu/b_menu_shop_open.png" v-if="http.res.shop.open" @click="btnShopOpen" alt="">
            <img class="shop_menu_icon" src="/img/b/menu/b_menu_shop_close.png" v-else @click="btnShopOpen" alt="">
            <img class="shop_menu_icon" src="/img/b/menu/b_menu_ring.png" @click="btnNotifyOrder" alt="">
          </div>

          <div class="blank_30"></div>
        </div>
      </div>

      <div class="shop_nav_box shop_nav_box_role">
        <div class="shop_nav_blank"></div>

        <div class="shop_nav_box_one_box">
          <div class="shop_nav_box_one shop_nav_box_one_role" v-for="nav in ui.navs" @click="btnNav(nav)">
            <img class="shop_nav_box_one_icon shop_nav_box_one_icon_role" :src="nav.icon" :alt="nav.name">
            <div class="shop_nav_box_one_label">{{nav.name}}</div>
          </div>
        </div>
      </div>
    </div>

    <captcha v-if="ui.vCaptcha" @closeCaptcha="closeCaptcha()" :title="ui.captcha.title" :text="ui.captcha.text"></captcha>
  </div>
</template>

<script>
  import {httpInfoApi} from '../../../../api/http/lt/httpInfoApi'
  import {httpShopApi} from '../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../components/common/TitleBar'
  import Captcha from '../../../../components/common/Captcha'
  import {highlightApi} from '../../../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '店长'
    },
    middleware: 'auth',
    components: {TitleBar, Captcha},
    data() {
      return {
        title: {
          canBack: false,
          title: '店长',
          backUri: `/b/${this.$route.params.shortId}/admin`,
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
            // {
            //   tag: 'table',
            //   name: '餐桌',
            //   icon: '/img/b/nav/role/b_nav_role_table.png',
            //   url: `/b/${this.$route.params.shortId}/admin/table`
            // },
            // {
            //   tag: 'order',
            //   name: '订单',
            //   icon: '/img/b/nav/role/b_nav_role_order.png',
            //   url: `/b/${this.$route.params.shortId}/admin/order`
            // },
            {
              tag: 'food',
              name: '餐食',
              icon: '/img/b/nav/role/b_nav_role_food.png',
              url: `/b/${this.$route.params.shortId}/admin/food`
            },
            {
              tag: 'queue',
              name: '排队',
              icon: '/img/b/nav/role/b_nav_role_queue.png',
              url: `/b/${this.$route.params.shortId}/admin/queue`
            },
            {
              tag: 'radio',
              name: '播报',
              icon: '/img/b/nav/role/b_nav_role_radio.png',
              url: `/b/${this.$route.params.shortId}/admin/radio`
            },
            {
              tag: 'printer',
              name: '打印',
              icon: '/img/b/nav/role/b_nav_role_printer.png',
              url: `/b/${this.$route.params.shortId}/admin/printer`
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
    mounted() {
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
        this.$router.push(nav.url)
      },
      btnShopOpen() {
        let title = '店铺' + (this.http.res.shop.open ? '打烊' : '营业')

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: title,
          content: `${this.http.res.shop.open ? '打烊后顾客将无法下单或排队，' : ''}您确定要${highlightApi.highlight(this.http.res.shop.open ? '打烊' : '营业')}吗？`
        }).then(async (val) => {
          if (val === 'Yes') {
            this.http.res.shop.open = !this.http.res.shop.open
            httpShopApi.putOpen(this.$route.params.shortId, this.http.res.shop.open).then(res => {
              this.$msgBox.doModal({
                type: 'yes',
                title: title,
                content: `店铺已${this.http.res.shop.open ? '营业' : '打烊'}。`
              })
            })
          }
        })
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
        this.$router.push(`/b/${this.$route.params.shortId}/admin/notify`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "~assets/c/shop";
  @import '~assets/b/b_nav';
  @import '~assets/b/b_nav_role';
</style>
