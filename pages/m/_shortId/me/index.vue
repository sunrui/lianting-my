<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="status status_top box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image " :src="http.res.wechatInfo.headImgUrl">
        </div>

        <div class="wall_user_info">
          <div class="wall_user_info_nick">{{this.http.res.wechatInfo.nickName ? this.http.res.wechatInfo.nickName :
            '匿名用户'}}
          </div>
          <div class="user_info_edit" @click="btnInfoEdit"></div>
        </div>

        <div class="user_phone">
          <div class="user_phone_label">{{ui.phone ? '手机号: ' + ui.phone : '未绑定手机'}}</div>
          <div class="user_phone_unbind" v-show="!ui.phone" @click="btnBindPhone">(绑定手机)</div>
        </div>

        <div class="blank_40"></div>

        <div class="addition ">
          <div v-for="(nav, index) in ui.navs">
            <div class="addition_item" @click="btnNav(nav.url)">
              <div class="addition_item_label">{{nav.name}}</div>
              <div class="addition_item_link"></div>
            </div>
            <div class="box_divide" v-if="index !== ui.navs.length - 1"></div>
          </div>
        </div>

        <div class="status_footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import { stateApi } from '../../../../api/local/stateApi'
  import { httpUserApi } from '../../../../api/http/user/httpUserApi'
  import { httpOrderApi } from '../../../../api/http/ltorder/httpOrderApi'
  import { httpQueueApi } from '../../../../api/http/ltorder/httpQueueApi'
  import { httpReserveApi } from '../../../../api/http/ltorder/httpReserveApi'
  import { httpWallApi } from '../../../../api/http/ltorder/httpWallApi'
  import { httpCouponApi } from '../../../../api/http/ltorder/httpCouponApi'

  export default {
    metaInfo: {
      title: '个人中心'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '个人中心',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          phone: '',
          navs: [
            { name: '我的订单', url: 'order/history' },
            { name: '我的排队', url: 'queue/history' },
            { name: '我的预订', url: 'reserve/history' },
            { name: '我的留言墙', url: 'wall/history' },
            { name: '我的优惠券', url: 'coupon/history' },
            { name: '我的收货地址', url: 'address' }
          ]
        },
        http: {
          res: {
            wechatInfo: {}
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
              content: '用户不存在。'
            })

            return
          }

          stateApi.user.setPhone(res.phone)
          this.ui.phone = res.phone

          if (!Boolean(res.wechatInfo)) {
            res.wechatInfo = {}
            res.wechatInfo.nickName = '匿名用户'
          }

          this.http.res.wechatInfo = res.wechatInfo
        })
      },
      btnNav(url) {
        if (url === 'order/history') {
          httpOrderApi.getAll(this.$route.params.shortId, 0, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/order/history/empty`)
            }
          })
        } else if (url === 'queue/history') {
          httpQueueApi.getAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/queue/history/empty`)
            }
          })
        } else if (url === 'reserve/history') {
          httpReserveApi.getAll(this.$route.params.shortId, null, null, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/reserve/history/empty`)
            }
          })
        } else if (url === 'wall/history') {
          httpWallApi.getMyAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/wall/history/empty`)
            }
          })
        } else if (url === 'coupon/history') {
          httpCouponApi.getCouponUser(this.$route.params.shortId, false, 0, 999).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/coupon/history/empty`)
            }
          })
        }

        this.$router.push(`/m/${this.$route.params.shortId}/${url}`)
      },
      btnBindPhone() {
        this.$router.push(`/m/${this.$route.params.shortId}/me/bind/phone`)
      },
      btnInfoEdit() {
        this.$router.push(`/m/${this.$route.params.shortId}/me/edit`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
