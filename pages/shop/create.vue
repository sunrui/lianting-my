<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div v-show="ui.shopGroupName">
          <div class="addition_item">
            <div class="addition_item_label">品牌名称</div>
            <div class="addition_item_label">{{http.req.shop.shopGroupId}}</div>
          </div>

          <div class="box_divide"></div>
        </div>

        <div class="addition_item">
          <div class="addition_item_label">店铺名称</div>
          <input class="addition_item_input" placeholder="请输入店铺名称" minlength="1" maxlength="32"
                 v-model="http.req.shop.name">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">唯一标识</div>
          <input class="addition_item_input" placeholder="请输入唯一标识" minlength="2" maxlength="20"
                 onkeyup="value=value.replace(/[^\w.\/]/ig,'')"
                 v-model="http.req.shop.shortId">
        </div>

        <div v-show="!havePhone">
          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">手机号</div>
            <input class="addition_item_input" placeholder="请输入手机号" maxlength="11"
                   oninput="value=value.replace(/[^\d]/g,'')"
                   v-model="http.req.bind.phone">
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">
              <input class="addition_item_code_input" placeholder="请输入验证码" maxlength="6"
                     oninput="value=value.replace(/[^\d]/g,'')"
                     v-model="http.req.bind.code">
            </div>

            <div class="addition_item_code_send">
              <div class="addition_item_code_send_divide">
                <div class="addition_item_code_send_divide_line"></div>
              </div>
              <div class="addition_item_code_send_button" v-show="ui.code.limit === 0" @click="btnSend">发送验证码</div>
              <div class="addition_item_code_send_time" v-show="ui.code.limit > 0">重新获取({{ui.code.limit}}s)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">立即创建</div>
    </div>
  </div>
</template>

<script>
  import { stateApi } from '../../api/local/stateApi'
  import { httpSmsApi } from '../../api/http/user/httpSmsApi'
  import { validatorApi } from '../../api/local/validatorApi'
  import { httpUserApi } from '../../api/http/user/httpUserApi'
  import TitleBar from '../../components/common/TitleBar'
  import { httpShopApi } from '../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '创建店铺'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: false,
          title: '创建店铺',
          theme: 'image',
          imageHeight: 220
        },
        http: {
          req: {
            shop: {
              shopGroupId: '',
              name: '',
              shortId: ''
            },
            bind: {
              phone: '13012341234',
              code: ''
            }
          }
        },
        ui: {
          phone: null,
          shopGroupName: null,
          code: {
            limit: 0,
            interval: 0
          }
        }
      }
    },
    computed: {
      havePhone() {
        let phone = stateApi.user.getPhone()
        return Boolean(phone)
      }
    },
    mounted() {
      this.http.req.shop.shopGroupId = this.$route.query.shopGroupId
      this.ui.shopGroupName = this.$route.query.shopGroupName
    },
    methods: {
      _updateTime() {
        if (--this.ui.code.limit === 0) {
          this.ui.code.buttonText = '发送'
          clearInterval(this.ui.code.interval)
        } else {
          this.ui.code.buttonText = '已发送(' + this.ui.code.limit + ')'
        }
      },
      btnSend() {
        if (this.ui.code.limit !== 0) {
          return
        }

        if (!validatorApi.phone(this.http.req.bind.phone)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '创建店铺',
            content: '请输入正确的手机号码。'
          })

          return
        }

        httpSmsApi.postSend(this.http.req.bind.phone, 'LOGIN').then(res => {
          if (res.success) {
            this.ui.code.limit = 60
            this.ui.code.interval = setInterval(this._updateTime, 1000)
          } else if (res.userExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '发送短信',
              content: `手机号码已存在。`
            })
          } else if (res.frequentLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '发送短信',
              content: `操作过于频繁，请于${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
            })
          }
        })
      },
      httpCreate() {
        httpShopApi.post(this.http.req.shop).then(res => {
          if (res.haveNormal) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '您最多仅允许创建一个免费店铺。'
            })
          } else if (res.shopGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '店铺组不存在。'
            })
          } else if (res.shortIdExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '唯一标识已存在。'
            })
          } else if (res.shopId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '创建成功。'
            }).then(async (val) => {
              this.$router.push(`/b/${this.http.req.shop.shortId}/init`)
            })
          }
        })
      },
      btnCreate() {
        if (!Boolean(this.http.req.shop.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '创建店铺',
            content: '请输入店铺名称。'
          })
          return
        }

        if (!Boolean(this.http.req.shop.shortId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '创建店铺',
            content: '请输入唯一标识。'
          })
          return
        }

        if (!this.havePhone) {
          if (!validatorApi.phone(this.http.req.bind.phone)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '请输入正确的手机号码。'
            })
            return
          }

          if (!validatorApi.code(this.http.req.bind.code)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '验证码为 6 位数字。'
            })
            return
          }

          httpUserApi.postBindPhone(this.http.req.bind.phone, this.http.req.bind.code).then(res => {
            if (res.bindExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '创建店铺',
                content: '已绑定过手机。'
              })
            } else if (res.phoneExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '创建店铺',
                content: '手机号码已存在。'
              })
            } else if (res.sendNeeded) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '创建店铺',
                content: '短信验证码不存在，请重新发送。'
              })
            } else if (res.verifyError) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '创建店铺',
                content: '短信验证码错误。'
              })
            } else if (res.frequentLimit) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '创建店铺',
                content: `操作过于频繁，请于${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
              }).then(async (val) => {
                this.http.req.bind.code = ''
              })
            } else if (res.user) {
              stateApi.user.setId(res.user.id)
              stateApi.user.setPhone(res.user.phone)
              stateApi.user.setWechatOpenId(res.user.wechatOpenId)
              stateApi.user.setAlipayOpenId(res.user.alipayOpenId)

              this.httpCreate()
            }
          })
        } else {
          this.httpCreate()
        }
      },
      btnBack() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
