<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_100"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image " :src="http.res.info.headImgUrl" :alt="this.http.res.info.nickName">
        </div>

        <div class="wall_user_info">
          <div class="wall_user_info_nick">{{this.http.res.info.nickName ? this.http.res.info.nickName :
            '匿名用户'}}
          </div>
          <div class="user_info_edit" @click="btnInfoEdit"></div>
        </div>

        <div class="user_phone">
          <div class="user_phone_label" style="user-select: text;" v-if="ui.phone">绑定手机 {{ui.phone}}</div>
          <div class="user_phone_label" v-else>未绑定手机</div>
          <div class="user_phone_unbind" v-show="!ui.phone" @click="btnBindPhone">(绑定手机)</div>
        </div>

        <div class="blank_40"></div>

        <div class="addition">
          <div v-for="(nav, index) in ui.navs">
            <div class="addition_item" @click="btnNav(nav.url)">
              <div class="addition_item_label">{{nav.name}}</div>
              <div class="addition_item_link"></div>
            </div>
            <div class="box_divide" v-if="index !== ui.navs.length - 1"></div>
          </div>
        </div>

        <div class="blank_5"></div>
      </div>
    </div>

    <div class="copyright" @click="btnCopyright">恋厅©提供技术支持</div>
    <div class="blank_30"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import {stateApi} from '../../../../api/local/stateApi'
  import {httpUserApi} from '../../../../api/http/user/httpUserApi'
  import {httpOrderApi} from '../../../../api/http/lt/httpOrderApi'
  import {httpQueueApi} from '../../../../api/http/lt/httpQueueApi'
  import {httpReserveApi} from '../../../../api/http/lt/httpReserveApi'
  import {httpWallApi} from '../../../../api/http/lt/httpWallApi'
  import {httpCouponApi} from '../../../../api/http/lt/httpCouponApi'

  export default {
    metaInfo: {
      title: '个人中心'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '个人中心',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          phone: '',
          navs: [
            {name: '我的订单', url: 'order/history'},
            {name: '我的排队', url: 'queue/history'},
            {name: '我的预订', url: 'reserve/history'},
            {name: '我的优惠券', url: 'coupon/history'},
            {name: '我的留言墙', url: 'wall/history'},
            {name: '退出登录', url: 'logout'},
            // { name: '我的收货地址', url: 'address' }
          ]
        },
        http: {
          res: {
            info: {}
          }
        }
      }
    },
    created() {
      let phone = stateApi.user.getPhone()
      if (Boolean(phone)) {
        this.ui.phone = phone
      }

      this.httpUserInfo()
    },
    methods: {
      httpUserInfo() {
        httpUserApi.getInfo(stateApi.user.getId()).then(res => {
          if (res.userIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '个人信息',
              content: '资料不存在。'
            })

            return
          }

          stateApi.user.setPhone(res.phone)
          this.ui.phone = res.phone

          if (!Boolean(res.info)) {
            res.info = {}
            res.info.nickName = '匿名用户'
          }

          this.http.res.info = res.info
        })
      },
      btnNav(url) {
        if (url === 'order/history') {
          httpOrderApi.getAll(this.$route.params.shortId, 0, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/order/history/empty`)
            }
          })
        } else if (url === 'queue/history') {
          httpQueueApi.getAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/queue/history/empty`)
            }
          })
        } else if (url === 'reserve/history') {
          httpReserveApi.getAll(this.$route.params.shortId, null, null, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/reserve/history/empty`)
            }
          })
        } else if (url === 'wall/history') {
          httpWallApi.getMyAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/wall/history/empty`)
            }
          })
        } else if (url === 'coupon/history') {
          httpCouponApi.getAll(this.$route.params.shortId, 0, 99).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/c/${this.$route.params.shortId}/coupon/history/empty`)
            }
          })
        } else if (url === 'logout') {
          this.$msgBox.doModal({
            type: 'yesOrNo',
            title: '退出登录',
            content: '您确认要退出登录吗?'
          }).then(async (val) => {
            if (val === 'Yes') {
              this.$router.push(`/logout`)
            }
          })

          return
        }

        this.$router.push(`/c/${this.$route.params.shortId}/${url}`)
      },
      btnBindPhone() {
        this.$router.push(`/c/${this.$route.params.shortId}/me/bind/phone`)
      },
      btnInfoEdit() {
        this.$router.push(`/c/${this.$route.params.shortId}/me/edit`)
      },
      btnCopyright() {
        window.location = 'https://www.lt.city/'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
