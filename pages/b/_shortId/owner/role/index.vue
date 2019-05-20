<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>相关人员可在关注恋厅公众号后处理日常工作。</li>
          <li>您也可直接点击人事头像进入工作台。</li>
        </ul>
      </div>
    </div>

    <captcha v-if="ui.vCaptcha" @closeCaptcha="closeCaptcha()" :title="ui.captcha.title" :text="ui.captcha.text"></captcha>

    <div class="box" v-for="role in ui.roles">
      <div class="list_title box_radius_header">
        <div class="list_role_icon" v-bind:class="{
        list_admin_icon: role.type === 'Admin',
        list_waiter_icon: role.type === 'Waiter' || role.type === 'TakeOut',
        list_cooker_icon: role.type === 'Cooker',
        list_cashier_icon: role.type === 'Cashier',
        }" @click="btnEnter(role)"></div>
        <div class="list_time_label" @click="btnEnter(role)">{{getTypeName(role.type)}}</div>
        <div class="list_item_add" @click="btnCreate(role)"></div>
        <div class="list_item_add_captcha" @click="btnCreateCaptcha(role)"></div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="role_user box_radius_footer">
        <div class="role_user_list">
          <div class="role_user_item" v-for="one in role.roles">
            <div class="role_user_one">
              <div class="role_user_one_label">{{one.name}}</div>
              <div class="badge_delete" @click="btnDelete(one)"></div>
            </div>

            <div class="blank_30"></div>
          </div>
        </div>
        <div class="no_role_user" v-if="role.roles.length === 0">没有{{getTypeName(role.type)}}角色</div>
        <div class="blank_50"></div>
      </div>
    </div>

    <div class="modal_center" v-if="ui.vRoleAdd">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">添加{{getTypeName(http.req.role.type)}}
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <label>
            <input type="number" class="modal_input"
                   oninput="value=value.replace(/[^0-9]/g,'');
                            if (value.length > 11) value = value.slice(0, 11);
                            if (value.length > 0 && value[0] !== '1') value=''"
                   placeholder="请输入手机号" v-model="http.req.role.phone">
          </label>
        </div>
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <label>
            <input class="modal_input" placeholder="请输入真实姓名" maxlength="16" v-model="http.req.role.name">
          </label>
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" v-if="http.req.role.phone && http.req.role.name" @click="btnCreateConfirm">确定</div>
        <div class="button_big button_gray" v-else>确定</div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpRoleAdminApi} from '../../../../../api/http/lt/httpRoleAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {validatorApi} from '../../../../../api/local/validatorApi'
  import {scrollApi} from '../../../../../api/local/scrollApi'
  import Captcha from '../../../../../components/common/Captcha'

  export default {
    metaInfo: {
      title: '人事'
    },
    middleware: 'auth',
    components: {TitleBar, Captcha},
    data() {
      return {
        title: {
          canBack: true,
          title: '人事',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            role: {}
          },
          res: {
            roles: {}
          }
        },
        ui: {
          vCaptcha: false,
          vRoleAdd: false,
          vCoverMask: false,
          roles: [],
          captcha: {
            title: null,
            text: null
          }
        }
      }
    },
    created() {
      this.httpRole()
    },
    methods: {
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
      httpRole() {
        this.ui.roles = []

        httpRoleAdminApi.getAll(this.$route.params.shortId).then(res => {
          this.http.res.roles = res

          this.ui.roles.push({
            type: 'Admin',
            roles: res.admins ? res.admins : []
          })

          this.ui.roles.push({
            type: 'Waiter',
            roles: res.waiters ? res.waiters : []
          })

          this.ui.roles.push({
            type: 'Cooker',
            roles: res.cookers ? res.cookers : []
          })

          this.ui.roles.push({
            type: 'Cashier',
            roles: res.cashiers ? res.cashiers : []
          })

          this.ui.roles.push({
            type: 'TakeOut',
            roles: res.takeouts ? res.takeouts : []
          })
        })
      },
      btnCoverMask() {
        this.ui.vRoleAdd = false
        this.ui.vCoverMask = false

        scrollApi.enable(true)
      },
      btnCreate(role) {
        this.ui.vCoverMask = true
        this.ui.vRoleAdd = true
        this.http.req.role = {}
        this.http.req.role.type = role.type

        scrollApi.enable(false)
      },
      btnCreateConfirm() {
        scrollApi.enable(true)
        this.ui.vRoleAdd = false
        this.ui.vCoverMask = false

        if (!validatorApi.phone(this.http.req.role.phone)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加' + this.getTypeName(this.http.req.role.type),
            content: '请输入正确的手机号码。'
          })

          return
        }

        httpRoleAdminApi.postRole(this.$route.params.shortId, this.http.req.role).then(res => {
          if (res.maxLimit) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }

          if (res.phoneNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: '手机用户不存在。'
            }).then(async (val) => {
              this.httpRole()
            })

            return
          }

          if (res.userExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: '用户已存在。'
            }).then(async (val) => {
              this.httpRole()
            })

            return
          }

          if (res.roleId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: '添加成功。'
            }).then(async (val) => {
              this.httpRole()
            })
          }
        })
      },
      btnDelete(role) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除角色',
          content: '您确认要删除吗？'
        }).then(async (val) => {
          if (val === 'Yes') {
            httpRoleAdminApi.deleteRole(this.$route.params.shortId, role.id).then(res => {
              if (res.roleIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除' + this.getTypeName(this.http.req.role.type),
                  content: '人事不存在。'
                }).then(async (val) => {
                  this.httpRole()
                })
              } else if (res.success) {
                this.ui.vRoleAdd = false
                this.ui.vCoverMask = false

                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除' + this.getTypeName(this.http.req.role.type),
                  content: '删除成功。'
                }).then(async (val) => {
                  this.httpRole()
                })
              }
            })
          }
        })
      },
      btnEnter(role) {
        this.$router.push(`/b/${this.$route.params.shortId}/${role.type.toLowerCase()}`)
      },
      btnCreateCaptcha(role) {
        this.ui.captcha.title = '邀请"' + this.getTypeName(role.type) + '"扫码加入'

        httpRoleAdminApi.postRoleCaptcha(this.$route.params.shortId, role.type).then(res => {
          this.ui.captcha.text = document.location.protocol + '//' + window.location.host + `/c/${this.$route.params.shortId}/role/` + res.captchaId
          this.ui.captcha.text += '?roleType=' + role.type
          this.ui.vCaptcha = true
        })
      },
      closeCaptcha() {
        this.ui.vCaptcha = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
