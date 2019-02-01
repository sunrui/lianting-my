<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">启用</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.open" @click="btnEnable(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnEnable(true)"></div>
          </div>
        </div>

        <div class="box_divide" v-if="ui.open"></div>

        <div class="addition_item" v-if="ui.open">
          <div class="addition_item_label">名称</div>
          <input class="addition_item_input" placeholder="请输入名称" maxlength="32"
                 v-model="http.req.wifi.name">
        </div>

        <div class="box_divide" v-if="ui.open"></div>

        <div class="addition_item" v-if="ui.open">
          <div class="addition_item_label">密码</div>
          <input class="addition_item_input" placeholder="请输入密码" maxlength="32"
                 v-model="http.req.wifi.password">
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnEdit">确认</div>
    </div>
  </div>
</template>

<script>
  import {httpWifiApi} from '../../../../../api/http/ltorder/httpWifiApi'
  import {httpWifiAdminApi} from '../../../../../api/http/ltorder/httpWifiAdminApi'
  import TitleBar from '../../../../../components/TitleBar'

  export default {
    metaInfo: {
      title: '编辑 WIFI'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '编辑 WIFI',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            wifi: {
              name: '',
              password: ''
            }
          }
        },
        ui: {
          open: false
        }
      }
    },
    created() {
      this.httpWifi()
    },
    methods: {
      btnEnable(open) {
        this.ui.open = open

        if (!open) {
          this.http.req.wifi.name = null
          this.http.req.wifi.password = null
        }
      },
      httpWifi() {
        httpWifiApi.getWifi(this.$route.params.shortId).then(res => {
          this.http.req.wifi = res

          this.ui.open = Boolean(this.http.req.wifi.name) && Boolean(this.http.req.wifi.password)
        })
      },
      btnEdit() {
        httpWifiAdminApi.putWifi(this.$route.params.shortId, this.http.req.wifi).then(res => {
          this.$router.back()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
</style>
