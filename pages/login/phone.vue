<template>
  <section>
    <h1>手机登录</h1>
    <div class="form">
      <div class="form-group">
        <label>手机号</label>
        <input type="text" class="form-control" v-model="loginReq.model.phone" placeholder="手机号">
      </div>
      <div class="form-group">
        <label>验证码</label>
        <input type="text" class="form-control" v-model="loginReq.model.code" placeholder="验证码">
        <button class="btn btn-secondary" @click="btnSendSmsCode" v-text="ui.code.buttonText">发送</button>
      </div>

      <button class="btn btn-secondary btn-block" @click="btnLogin">登录</button>
    </div>

    <hr>
    <button class="btn btn-secondary" @click="btnWechatLogin">微信登录</button>
    <button class="btn btn-secondary" @click="btnAlipayLogin">支付宝登录</button>
    <button class="btn btn-secondary" @click="btnTestWechatLogin">测试微信登录</button>
  </section>
</template>

<script>
  import {validatorApi} from '../../api/local/validatorApi'
  import {httpSmsApi} from '../../api/http/user/httpSmsApi'
  import {httpUserApi} from '../../api/http/user/httpUserApi'
  import {stateApi} from '../../api/local/stateApi'
  import {timeApi} from '../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '手机登录'
    },
    middleware: 'user-agent',
    async asyncData({store, route, userAgent}) {
      return {
        userAgent
      }
    },
    data() {
      return {
        loginReq: {
          model: {
            phone: '13012341234',
            code: '123456'
          },
          rule: {
            phone: [
              {required: true, message: '请输入手机号', trigger: 'blur'},
              {type: 'string', min: 11, max: 11, message: '手机号码为 11 位数字', trigger: 'blur'}
            ],
            code: [
              {required: true, message: '请输入验证码', trigger: 'blur'},
              {type: 'string', min: 6, max: 6, message: '验证码为 6 位数字', trigger: 'blur'}
            ]
          }
        },
        ui: {
          code: {
            buttonText: '发送',
            limit: 0,
            interval: 0
          }
        }
      }
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
      btnSendSmsCode() {
        if (!validatorApi.phone(this.loginReq.model.phone)) {
          alert('手机号码不合法')
          return
        }

        if (this.ui.code.limit !== 0) {
          return
        }

        httpSmsApi.postSend(this.loginReq.model.phone, 'LOGIN').then(res => {
          if (res.success) {
            this.ui.code.limit = 60
            this.ui.code.interval = setInterval(this._updateTime, 1000)
          } else if (res.userExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '发送短信',
              content: `用户已存在。`
            })
          } else if (res.frequentLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '发送短信',
              content: `操作过于频繁，请于 ${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
            })
          }
        })
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time * 1000)
      },
      btnLogin() {
        if (!validatorApi.phone(this.loginReq.model.phone)) {
          alert('手机号码不合法')
          return
        }

        if (!validatorApi.code(this.loginReq.model.code)) {
          alert('验证码不合法')
          return
        }
        let shortId = this.$route.query.shortId
        if (!Boolean(shortId)) {
          shortId = 'undefined'
        }

        httpUserApi.postLoginPhone(shortId, this.loginReq.model.phone, this.loginReq.model.code).then(res => {
          console.log(res)

          if (res.sendNeeded) {
            alert('短信验证码不存在，请重新发送。')
            return
          }

          if (res.verifyError) {
            alert('短信验证码错误')
            return
          }

          if (res.frequentLimit) {
            alert('发送操作过于频繁，请于 ' + this.elapsedTime(res.frequentLimit) + ' 后重试。')
          }

          if (res.user) {
            alert('登录成功')
            stateApi.user.setId(res.user.id)
            stateApi.user.setPhone(res.user.phone)
            stateApi.user.setWechatOpenId(res.user.wechatOpenId)
            stateApi.user.setAlipayOpenId(res.user.alipayOpenId)

            let r = this.$route.query.r
            if (!Boolean(r)) {
              r = '/'
            }
            this.$router.push(r)
          }
        })
      },
      btnWechatLogin() {
        this.$router.push('/login?scope=snsapi_base')
      },
      btnAlipayLogin() {
      },
      btnTestWechatLogin() {
        this.$router.push('/login/wechat?code=123456&state=123456')

      }
    }
  }
</script>
