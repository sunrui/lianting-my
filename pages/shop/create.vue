<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div v-show="$route.query.shopGroupName">
          <div class="addition_item">
            <div class="addition_item_label">品牌名称</div>
            <div class="addition_item_label">{{$route.query.shopGroupName}}</div>
          </div>

          <div class="box_divide"></div>
        </div>

        <div class="addition_item">
          <div class="addition_item_label">店铺名称</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的店铺名称" minlength="1" maxlength="32"
                   v-model="http.req.shop.name">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">恋厅号</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的专属恋厅号，如：ltcity。" minlength="2" maxlength="20"
                   onkeyup="value=value.replace(/[^\w.\/]/ig,'')"
                   v-model="http.req.shop.shortId">
          </label>
        </div>

        <div v-show="!ui.phone">
          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">手机号</div>
            <label>
              <input type="number" class="addition_item_input" placeholder="请输入手机号" maxlength="11"
                     oninput="value=value.replace(/[^0-9]/g,'');
                              if (value.length > 11) value = value.slice(0, 11);
                              if (value.length > 0 && value[0] !== '1') value=''"
                     v-model="http.req.bind.phone">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">
              <label>
                <input type="number" class="addition_item_code_input" placeholder="请输入验证码" maxlength="6"
                       v-model="http.req.bind.code">
              </label>
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

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">来源</div>
          <label>
            <input class="addition_item_input" placeholder="请告之我们您从哪里了解到的恋厅?" minlength="1" maxlength="32"
                   v-model="http.req.shop.referrer">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnCreate">立即创建</div>
    </div>
  </div>
</template>

<script>
  import {userApi} from '../../api/local/userApi'
  import {httpSmsApi} from '../../api/http/user/httpSmsApi'
  import {validatorApi} from '../../api/local/validatorApi'
  import {httpUserApi} from '../../api/http/user/httpUserApi'
  import TitleBar from '../../components/common/TitleBar'
  import {httpShopApi} from '../../api/http/shop/httpShopApi'
  import {timeApi} from '../../api/local/timeApi'
  import {highlightApi} from '../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '创建店铺'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          backUri: '',
          title: '创建店铺',
          theme: 'image',
          imageHeight: 220
        },
        http: {
          req: {
            shop: {
              shopGroupId: '',
              name: '',
              shortId: '',
              referrer: ''
            },
            bind: {
              phone: '',
              code: ''
            }
          }
        },
        ui: {
          phone: null,
          code: {
            limit: 0,
            interval: 0
          }
        }
      }
    },
    mounted() {
      this.ui.phone = userApi.getUserPhone()
      this.http.req.shop.shopGroupId = this.$route.query.shopGroupId
    },
    methods: {
      updateTime() {
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
            this.ui.code.interval = setInterval(this.updateTime, 1000)
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
        if (!new RegExp(/[a-zA-Z0-9_]{2,20}$/).test(this.http.req.shop.shortId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '创建店铺',
            content: '请输入正确的恋厅号。'
          })

          return
        }

        httpShopApi.post(this.http.req.shop).then(res => {
          if (res.haveFree) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '创建店铺',
              content: '您最多可拥有一个试用店铺。'
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
              content: '恋厅号已存在。'
            })
          } else if (res.shopId) {
            this.$router.push(`/b/${this.http.req.shop.shortId}/init`)
          }
        })
      },
      httpBindPhoneAndCreate() {
        if (!this.ui.phone) {
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
            } else if (res.sendSmsCodeNeeded) {
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
              userApi.setUserId(res.user.id)
              userApi.setUserPhone(res.user.phone)
              userApi.setUserWechatOpenId(res.user.wechatOpenId)
              userApi.setUserAlipayOpenId(res.user.alipayOpenId)

              this.httpCreate()
            }
          })
        } else {
          this.httpCreate()
        }
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
            content: '请输入恋厅号。'
          })
          return
        }

        if (this.http.req.shop.shortId.length < 2 || this.http.req.shop.shortId.length > 20) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '创建店铺',
            content: '恋厅号长度在2-20位之间。'
          })
          return
        }

        let url = 'https://shop.lt.city/c/'
        let content = `请您认真阅读以上开店流程，如您在使用中遇到任何问题可联系我们客服。`
        content += `<br/><br/>您的店铺名称为：<br/>${highlightApi.highlight(this.http.req.shop.name)}`
        content += `<br/><br/>您的店铺地址为：<br/>${url}${highlightApi.highlight(this.http.req.shop.shortId)}`

        if (Boolean(this.http.req.shop.referrer)) {
          content += `<br/><br/>告之我们您从哪里了解到的恋厅?<br/>${highlightApi.highlight(this.http.req.shop.referrer)}`
        }

        this.$msgBox.doModal({
          type: 'yes',
          title: '创建店铺',
          content: content
        }).then(async (val) => {
          if (val === 'Yes') {
            this.httpBindPhoneAndCreate()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
