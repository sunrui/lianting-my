<template>
  <section>
    <h1 v-if="ui.shopGroupName">品牌名称: {{ui.shopGroupName}}</h1>

    <hr>
    <div ref="shopGroupReq" :model="shopGroupReq.model" :rules="shopGroupReq.rule">
      <div class="form-group">
        <label>名称</label>
        <input type="text" class="form-control" v-model="shopGroupReq.model.name" placeholder="">
      </div>
      <div class="form-group">
        <label>公司</label>
        <input type="text" class="form-control" v-model="shopGroupReq.model.corporation" placeholder="">
      </div>
    </div>

    <hr style="margin-bottom: 20px">

    <div v-if="ui.phoneBindNeeded" ref="phoneBindReq" :model="phoneBindReq.model" :rules="phoneBindReq.rule">
      <div class="form-group">
        <label>手机号</label>
        <input type="text" class="form-control" v-model="phoneBindReq.model.phone" placeholder="手机号">
      </div>
      <div class="form-group">
        <label>验证码</label>
        <input type="text" class="form-control" v-model="phoneBindReq.model.code" placeholder="验证码">
      </div>
      <button class="btn btn-secondary" @click="btnSendSmsCode" v-text="ui.code.buttonText">发送</button>
    </div>

    <button class="btn btn-secondary" @click="btnCreateShop">立即创建</button>
  </section>
</template>

<script>
  import { stateApi } from '../../../api/local/stateApi'
  import { httpSmsApi } from '../../../api/http/user/httpSmsApi'
  import { validatorApi } from '../../../api/local/validatorApi'
  import { httpUserApi } from '../../../api/http/user/httpUserApi'
  import { httpShopGroupApi } from '../../../api/http/shop/httpShopGroupApi'
  import {timeApi} from '../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '创建品牌'
    },
    middleware: 'auth',
    components: { },
    data() {
      return {
        shopGroupReq: {
          model: {
            name: null,
            corporation: null
          },
          rule: {
            shortId: [
              { required: true, message: '请输入唯一标识', trigger: 'blur' },
              { type: 'string', min: 4, max: 20, message: '唯一标识长度需在 4 - 20 位之间', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入店铺名称', trigger: 'blur' },
              { type: 'string', min: 1, max: 32, message: '店铺名长度需在 1 - 32 位之间', trigger: 'blur' }
            ],
            category: [
              { required: true, message: '请输入主营类目', trigger: 'blur' },
              { type: 'string', min: 1, max: 32, message: '店铺名长度需在 1 - 32 位之间', trigger: 'blur' }
            ]
          }
        },
        phoneBindReq: {
          model: {
            phone: null,
            code: null
          },
          rule: {
            phone: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { type: 'string', min: 11, max: 11, message: '手机号码为 11 位数字', trigger: 'blur' }
            ],
            code: [
              { required: true, message: '请输入验证码', trigger: 'blur' },
              { type: 'string', min: 6, max: 6, message: '验证码为 6 位数字', trigger: 'blur' }
            ]
          }
        },
        ui: {
          code: {
            buttonText: '发送',
            limit: 0,
            interval: 0
          },
          phoneBindNeeded: false
        }
      }
    },
    created() {
      let phone = stateApi.user.getPhone()
      if (!Boolean(phone)) {
        this.ui.phoneBindNeeded = true
      }
    },
    methods: {
      _createShopGroup() {
        httpShopGroupApi.post(this.shopGroupReq.model).then(res => {
          if (res.haveNormal) {
            alert('已存在未激活店铺')
          } else if (res.limit3Group) {
            alert('最多创建 3 个品牌')
          } else if (res.shopGroupId) {
            alert('创建成功')
            this.$router.push(`/shop`)
          }
        })
      },
      btnCreateShop() {
        if (!Boolean(this.shopGroupReq.model.name)) {
          alert('品牌名称不能为空')
          return
        }

        if (!Boolean(this.shopGroupReq.model.corporation)) {
          alert('公司名称不能为空')
          return
        }

        if (this.ui.phoneBindNeeded) {
          if (!validatorApi.phone(this.phoneBindReq.model.phone)) {
            alert('手机号码不合法')
            return
          }

          if (!validatorApi.code(this.phoneBindReq.model.code)) {
            alert('验证码为 6 位数字')
            return
          }

          httpUserApi.postBindPhone(this.phoneBindReq.model.code).then(res => {
            if (res.bindExists) {
              alert('已绑定过手机')
              return
            }

            if (res.phoneExists) {
              alert('手机号码已存在')
              return
            }

            if (res.sendNeeded) {
              alert('短信验证码不存在，请重新发送。')
              return
            }

            if (res.verifyError) {
              alert('短信验证码错误')
              return
            }

            if (res.user) {
              stateApi.user.setId(res.user.userId)
              stateApi.user.setPhone(res.user.phone)
              stateApi.user.setWechatOpenId(res.user.wechatOpenId)
              stateApi.user.setAlipayOpenId(res.user.alipayOpenId)

              alert('绑定成功')

              this._createShopGroup()
            }
          })
        } else {
          this._createShopGroup()
        }
      },
      updateTime() {
        if (--this.ui.code.limit === 0) {
          this.ui.code.buttonText = '发送'
          clearInterval(this.ui.code.interval)
        } else {
          this.ui.code.buttonText = '已发送(' + this.ui.code.limit + ')'
        }
      },
      btnSendSmsCode() {
        if (!validatorApi.phone(this.phoneBindReq.model.phone)) {
          alert('手机号码不合法')
          return
        }

        if (this.ui.code.limit !== 0) {
          return
        }

        httpSmsApi.postSend(this.phoneBindReq.model.phone, 'LOGIN').then(res => {
          if (res.success) {
            this.ui.code.limit = 60
            this.ui.code.interval = setInterval(this.updateTime, 1000)
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
              content: `操作过于频繁，请于${timeApi.elapsedTime(res.frequentLimit * 1000)}后重试。`
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
