<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">头像</div>
          <div class="addition_item_avatar_input">
            <image-upload :b="false" :file-url="http.res.info.headImgUrl" v-on:uploadSuccess="uploadSuccess"></image-upload>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">昵称</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的昵称" v-model="http.res.info.nickName" autofocus>
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">性别</div>

          <div class="addition_item_radio">
            <div style="display: inline-block" @click="btnChooseMale(true)">
              <div v-bind:class="{
                addition_item_radio_icon_select: http.res.info.male,
                addition_item_radio_icon_unselect: !http.res.info.male
                }"></div>
              <div class="addition_item_radio_label">男</div>
            </div>
            <div style="display: inline-block" @click="btnChooseMale(false)">
              <div v-bind:class="{
                addition_item_radio_icon_select: !http.res.info.male,
                addition_item_radio_icon_unselect: http.res.info.male
                }"></div>
              <div class="addition_item_radio_label">女</div>
            </div>
          </div>

        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">地址</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的地址" v-model="http.res.info.address">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">个性签名</div>
          <label>
            <input class="addition_item_input" placeholder="请输入您的个性签名" v-model="http.res.info.signature">
          </label>
        </div>
      </div>

      <div class="blank_20"></div>
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
  import {httpUserApi} from '../../../../../api/http/user/httpUserApi'
  import {stateApi} from '../../../../../api/local/stateApi'
  import ImageUpload from '../../../../../components/common/ImageUpload'

  export default {
    metaInfo: {
      title: '资料'
    },
    middleware: 'auth',
    components: {TitleBar, ImageUpload},
    data() {
      return {
        title: {
          canBack: true,
          title: '资料',
          backUri: `/c/${this.$route.params.shortId}/me`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            info: {}
          }
        }
      }
    },
    created() {
      this.httpUserInfo()
    },
    methods: {
      uploadSuccess(fileName) {
        this.$set(this.http.res.info, 'headImgUrl', fileName)
      },
      httpUserInfo() {
        httpUserApi.getInfo(stateApi.user.getId()).then(res => {
          if (res.userIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '资料',
              content: '用户不存在。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
            })

            return
          }

          this.http.res.info = res.info ? res.info : {
            male: true
          }
        })
      },
      btnChooseMale(male) {
        this.http.res.info.male = male
      },
      btnSyncWechat() {
        this.$router.push('/login?scope=snsapi_userinfo&r=' + this.$route.path)
      },
      btnUpdate() {
        httpUserApi.putInfo(this.http.res.info).then(res => {
          if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '资料',
              content: '更新成功。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
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
