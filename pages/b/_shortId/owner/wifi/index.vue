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
          <label>
            <input class="addition_item_input" placeholder="请输入名称" maxlength="32"
                   v-model="http.req.wifi.name">
          </label>
        </div>

        <div class="box_divide" v-if="ui.open"></div>

        <div class="addition_item" v-if="ui.open">
          <div class="addition_item_label">密码</div>
          <label>
            <input class="addition_item_input" placeholder="请输入密码" maxlength="32"
                   v-model="http.req.wifi.password">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnEdit">更新</div>
    </div>
  </div>
</template>

<script>
  import { httpWifiApi } from '../../../../../api/http/lt/httpWifiApi'
  import { httpWifiAdminApi } from '../../../../../api/http/lt/httpWifiAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '无线'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '无线',
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
    mounted() {
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
          this.$msgBox.doModal({
            type: 'yes',
            title: '无线',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
</style>
