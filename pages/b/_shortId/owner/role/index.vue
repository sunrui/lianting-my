<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="box" v-for="role in ui.roles">
      <div class="list_title box_radius_header">
        <div class="list_role_icon" v-bind:class="{
        list_admin_icon: role.type === 'Admin',
        list_waiter_icon: role.type === 'Waiter',
        list_cooker_icon: role.type === 'Cooker',
        list_cashier_icon: role.type === 'Cashier',
        }" @click="btnEnter(role)"></div>
        <div class="list_time_label" @click="btnEnter(role)">{{getTypeName(role.type)}}</div>
        <div class="list_item_add" @click="btnCreate(role)"></div>
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
      </div>
    </div>

    <div class="modal_center" v-if="ui.v_role_add">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">添加{{getTypeName(http.req.role.type)}}
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input"
                 oninput="this.value=this.value.replace(/[^0-9]/g,''); if (this.value === '0') this.value = ''"
                 placeholder="请输入手机号" maxlength="11" v-model="http.req.role.phone">
        </div>
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" placeholder="请输入真实姓名" maxlength="10" v-model="http.req.role.name">
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" @click="btnCreateConfirm">确定</div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import { httpRoleAdminApi } from '../../../../../api/http/lt/httpRoleAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import { validatorApi } from '../../../../../api/local/validatorApi'
  import { langApi } from '../../../../../api/local/langApi'

  export default {
    metaInfo: {
      title: '人事'
    },
    middleware: 'auth',
    components: { TitleBar },
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
          v_role_add: false,
          v_cover_mask: false,
          roles: []
        }
      }
    },
    created() {
      this.httpRole()
    },
    methods: {
      getTypeName(type) {
        if (type === 'Admin') {
          return '管理员'
        } else if (type === 'Waiter') {
          return '服务员'
        } else if (type === 'Cooker') {
          return '厨师'
        } else if (type === 'Waiter') {
          return '服务员'
        } else if (type === 'Cashier') {
          return '收银'
        } else {
          return '未知'
        }
      },
      httpRole() {
        this.ui.roles = []

        httpRoleAdminApi.getAll(this.$route.params.shortId).then(res => {
          this.roles = res
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
        })
      },
      btnCoverMask() {
        this.ui.v_role_add = false
        this.ui.v_cover_mask = false
      },
      btnCreate(role) {
        this.ui.v_cover_mask = true
        this.ui.v_role_add = true
        this.http.req.role = {}
        this.http.req.role.type = role.type
      },
      btnCreateConfirm() {
        if (!Boolean(this.http.req.role.phone)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加' + this.getTypeName(this.http.req.role.type),
            content: '请输入手机号码。'
          })

          return
        }

        if (!validatorApi.phone(this.http.req.role.phone)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加' + this.getTypeName(this.http.req.role.type),
            content: '请输入正确的手机号码。'
          })

          return
        }

        if (!Boolean(this.http.req.role.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加' + this.getTypeName(this.http.req.role.type),
            content: '请输入真实姓名。'
          })

          return
        }

        httpRoleAdminApi.postRole(this.$route.params.shortId, this.http.req.role).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: langApi.maxLimit
            })

            return
          }

          if (res.phoneNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: '手机用户不存在。'
            })

            return
          }

          if (res.userExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加' + this.getTypeName(this.http.req.role.type),
              content: '用户已存在。'
            })

            return
          }

          if (res.roleId) {
            this.ui.v_role_add = false
            this.ui.v_cover_mask = false

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
                this.ui.v_role_add = false
                this.ui.v_cover_mask = false

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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
