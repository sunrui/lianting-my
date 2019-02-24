<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="status status_top box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image " :src="http.res.wechatInfo.headImgUrl" :alt="http.res.wechatInfo.nickName">
        </div>

        <div class="blank_40"></div>
        <div class="blank_40"></div>

        <div class="addition ">
          <div class="addition_item">
            <div class="addition_item_label">昵称</div>
            <label>
              <input class="addition_item_input" v-model="http.res.wechatInfo.nickName">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">性别</div>

            <div class="addition_item_radio">
              <div style="display: inline-block" @click="btnChooseSex(1)">
                <div v-bind:class="{
                addition_item_radio_icon_select: http.res.wechatInfo.sex !== 2,
                addition_item_radio_icon_unselect: http.res.wechatInfo.sex === 2
                }"></div>
                <div class="addition_item_radio_label">男</div>
              </div>
              <div style="display: inline-block" @click="btnChooseSex(2)">
                <div v-bind:class="{
                addition_item_radio_icon_select: http.res.wechatInfo.sex === 2,
                addition_item_radio_icon_unselect: http.res.wechatInfo.sex !==2
                }"></div>
                <div class="addition_item_radio_label">女</div>
              </div>
            </div>

          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">省</div>
            <label>
              <input class="addition_item_input" v-model="http.res.wechatInfo.province">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">市</div>
            <label>
              <input class="addition_item_input" v-model="http.res.wechatInfo.city">
            </label>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">国家</div>
            <label>
              <input class="addition_item_input" v-model="http.res.wechatInfo.country">
            </label>
          </div>
        </div>
      </div>

      <div class="status_footer"></div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
      <div class="blank_20"></div>
      <div class="sync_wechat" @click="btnSyncWechat">同步微信</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import { httpUserApi } from '../../../../../api/http/user/httpUserApi'
  import { stateApi } from '../../../../../api/local/stateApi'

  export default {
    metaInfo: {
      title: '编辑资料'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '编辑资料',
          backUri: `/m/${this.$route.params.shortId}/me`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            wechatInfo: {
              sex: 1
            }
          }
        }
      }
    },
    created() {
      this.httpUserInfo()
    },
    methods: {
      httpUserInfo() {
        httpUserApi.getInfo(stateApi.user.getId()).then(res => {
          if (res.userIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑资料',
              content: '用户不存在。'
            }).then(async (val) => {
              this.$router.back()
            })

            return
          }

          if (!Boolean(res.wechatInfo)) {
            res.wechatInfo = {}
            res.wechatInfo.nickName = '匿名用户'
            res.wechatInfo.province = '保密'
            res.wechatInfo.city = '保密'
            res.wechatInfo.country = '保密'
          }

          this.http.res.wechatInfo = res.wechatInfo
        })
      },
      btnChooseSex(sex) {
        this.http.res.wechatInfo.sex = sex
      },
      btnSyncWechat() {
        this.$router.push('/login?scope=snsapi_userinfo&r=' + this.$route.path)
      },
      btnUpdate() {
        httpUserApi.putInfo(this.http.res.wechatInfo).then(res => {
          if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑资料',
              content: '更新成功。'
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
