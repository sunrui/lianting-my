<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>您好，您被<span class="tip_highlight">{{http.res.shop.name}}</span>店铺邀请成为<span class="tip_highlight">{{getRoleTypeName($route.query.roleType)}}</span>。</li>
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
  import {roleApi} from '../../../../../api/local/roleApi'

  export default {
    metaInfo: {
      title: '恋厅 - 人事邀请'
    },
    middleware: 'auth',
    components: {TitleBar, Captcha},
    data() {
      return {
        title: {
          canBack: false,
          title: '恋厅 - 人事邀请',
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
        ui: {
          link: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU5MTQzNzQxNA==#wechat_redirect',
          inWechat: false
        }
      }
    },
    mounted() {
      this.ui.inWechat = wechatApi.inWechat()

      this.httpShop()
    },
    methods: {
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      getRoleTypeName(type) {
        return roleApi.getRoleTypeName(type)
      },
      btnCreate() {
        if (!Boolean(this.http.req.role.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '加入' + this.getRoleTypeName(this.http.req.role.type),
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
              content: '您已经是本店铺的一员了。'
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
              content: '恭喜您，您已成为本店铺的一员。'
            }).then(async (val) => {
              if (this.ui.inWechat) {
                this.$msgBox.doModal({
                  type: 'yesOrNo',
                  title: '关注恋厅',
                  content: '为了方便您日后工作，现在就关注恋厅公众号吗？'
                }).then(async (val) => {
                  if (val === 'Yes') {
                    window.location.href = this.ui.link
                  } else {
                    this.$router.push('/shop/role')
                  }
                })
              }
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
