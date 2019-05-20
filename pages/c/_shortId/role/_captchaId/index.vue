<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>您好，您被<span class="tip_highlight">{{http.res.shop.name}}</span>店铺邀请成为<span class="tip_highlight">{{getTypeName($route.query.roleType)}}</span>。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的真实姓名" maxlength="16" v-model="http.req.role.name">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">同意加入</div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import Captcha from '../../../../../components/common/Captcha'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import {httpRoleApi} from '../../../../../api/http/lt/httpRoleApi'
  import {wechatApi} from '../../../../../api/local/wechatApi'

  export default {
    metaInfo: {
      title: '人事邀请'
    },
    middleware: 'auth',
    components: {TitleBar, Captcha},
    data() {
      return {
        title: {
          canBack: false,
          title: '人事邀请',
          backUri: `/c/${this.$route.params.shortId}/`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            role: {}
          },
          res: {
            shop: {}
          }
        },
        ui: {}
      }
    },
    mounted() {
      this.httpShop()
    },
    methods: {
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      getTypeName(type) {
        if (type === 'Admin') {
          return '店长'
        } else if (type === 'Waiter') {
          return '服务员'
        } else if (type === 'Cooker') {
          return '厨师'
        } else if (type === 'Waiter') {
          return '服务员'
        } else if (type === 'Cashier') {
          return '收银'
        } else if (type === 'TakeOut') {
          return '外卖'
        } else {
          return '未知'
        }
      },
      btnCreate() {
        if (!Boolean(this.http.req.role.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '加入' + this.getTypeName(this.http.req.role.type),
            content: '请输入您的真实姓名。'
          })

          return
        }

        httpRoleApi.postRole(this.$route.params.shortId, this.$route.params.captchaId, this.http.req.role.name).then(res => {
          if (res.captchaIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '人事邀请',
              content: '二维码已失效，请重新接受邀请。'
            }).then(async (val) => {
              wechatApi.closeWindow()
            })
          } else if (res.userExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '人事邀请',
              content: '您已经被邀请过了。'
            }).then(async (val) => {
              wechatApi.closeWindow()
            })
          } else if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '人事邀请',
              content: '已超过当前店铺最大邀请限制。'
            }).then(async (val) => {
              wechatApi.closeWindow()
            })
          } else if (res.roleId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '人事邀请',
              content: '恭喜您，您已成为本餐厅的一员。'
            }).then(async (val) => {
              this.$router.push('/shop/role')
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
