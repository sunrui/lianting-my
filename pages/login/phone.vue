<template>
  <div class="container">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="lt">
      <div class="lt_logo"></div>
      <div class="lt_label">恋厅</div>
    </div>

    <div class="blank_100"></div>

    <div class="login">
      <div class="addition box_radius">
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
            <div class="addition_item_code_send_button" v-if="ui.code.limit === 0" @click="btnSend">发送验证码</div>
            <div class="addition_item_code_send_time" v-if="ui.code.limit > 0">重新获取({{ui.code.limit}}s)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="blank_100"></div>

    <div class="button_box">
      <div class="button_big" @click="btnLogin">登录</div>
    </div>

    <div class="blank_30"></div>

    <div class="login_footer">
      <div class="login_third_title">
        <div class="login_third_divide"></div>
        <div class="login_third_label">第三方账号直接登录</div>
        <div class="login_third_divide"></div>
      </div>
      <div class="login_third_icon">
        <div class="login_third_icon_wechat" @click="btnWechat"></div>
        <div class="login_third_icon_alipay" @click="btnAlipay"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { validatorApi } from "../../api/local/validatorApi"
  import { httpSmsApi } from "../../api/http/user/httpSmsApi"
  import { stateApi } from "../../api/local/stateApi"
  import TitleBar from "../../components/common/TitleBar"
  import { httpUserApi } from "../../api/http/user/httpUserApi"
  import { timeApi } from "../../api/local/timeApi"

  export default {
    metaInfo: {
      title: "登录"
    },
    middleware: "auth",
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: false,
          title: "登录",
          backUri: ``,
          theme: "white",
          imageHeight: 0
        },
        http: {
          req: {
            bind: {
              phone: "13012341234",
              code: ""
            }
          }
        },
        ui: {
          code: {
            limit: 0,
            interval: 0
          }
        }
      }
    },
    created() {
      let phone = stateApi.user.getPhone()
      if (Boolean(phone)) {
        this.$msgBox.doModal({
          type: "yes",
          title: "绑定手机",
          content: "您已绑定过手机。"
        }).then(async (val) => {
          this.$router.back()
        })
      }
    },
    methods: {
      _updateTime() {
        if (--this.ui.code.limit === 0) {
          this.ui.code.buttonText = "发送"
          clearInterval(this.ui.code.interval)
        } else {
          this.ui.code.buttonText = "已发送(" + this.ui.code.limit + ")"
        }
      },
      btnSend() {
        if (this.ui.code.limit !== 0) {
          return
        }

        if (!validatorApi.phone(this.http.req.bind.phone)) {
          this.$msgBox.doModal({
            type: "yes",
            title: "绑定手机",
            content: "请输入正确的手机号码。"
          })

          return
        }

        httpSmsApi.postSend(this.http.req.bind.phone, "LOGIN").then(res => {
          if (res.success) {
            this.ui.code.limit = 60
            this.ui.code.interval = setInterval(this._updateTime, 1000)
          } else if (res.userExists) {
            this.$msgBox.doModal({
              type: "yes",
              title: "发送短信",
              content: `手机号码已存在。`
            })
          } else if (res.frequentLimit) {
            this.$msgBox.doModal({
              type: "yes",
              title: "发送短信",
              content: `操作过于频繁，请于 ${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
            })
          }
        })
      },
      btnLogin() {
        if (!validatorApi.phone(this.http.req.bind.phone)) {
          this.$msgBox.doModal({
            type: "yes",
            title: "绑定手机",
            content: "请输入正确的手机号码。"
          })
          return
        }

        if (!validatorApi.code(this.http.req.bind.code)) {
          this.$msgBox.doModal({
            type: "yes",
            title: "绑定手机",
            content: "验证码为 6 位数字。"
          })
          return
        }

        let shortId = this.$route.query.shortId
        if (!Boolean(shortId)) {
          shortId = "undefined"
        }

        httpUserApi.postLoginPhone(shortId, this.http.req.bind.phone, this.http.req.bind.code).then(res => {
          if (res.sendNeeded) {
            this.$msgBox.doModal({
              type: "yes",
              title: "登录",
              content: `短信验证码不存在，请重新发送。`
            }).then(async (val) => {
              this.$router.back()
            })
          } else if (res.verifyError) {
            this.$msgBox.doModal({
              type: "yes",
              title: "登录",
              content: `短信验证码错误。`
            }).then(async (val) => {
              this.$router.back()
            })
          } else if (res.frequentLimit) {
            this.$msgBox.doModal({
              type: "yes",
              title: "登录",
              content: `操作过于频繁，请于 ${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
            }).then(async (val) => {
              this.http.req.bind.code = ""
            })
          } else if (res.user) {
            stateApi.user.setId(res.user.id)
            stateApi.user.setPhone(res.user.phone)
            stateApi.user.setWechatOpenId(res.user.wechatOpenId)
            stateApi.user.setAlipayOpenId(res.user.alipayOpenId)

            this.$msgBox.doModal({
              type: "yes",
              title: "登录",
              content: `登录成功。`
            }).then(async (val) => {
              this.$router.back()
            })
          }
        })
      },
      btnWechat() {
        this.$router.push("/login?scope=snsapi_base")
      },
      btnAlipay() {
        this.$msgBox.doModal({
          type: "yes",
          title: "登录",
          content: `测试微信登录。`
        }).then(async (val) => {
          this.$router.push("/login/wechat?code=123456&state=123456")
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "phone";
</style>
