<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="status status_top box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image " :src="http.res.wechatInfo.headImgUrl">
        </div>

        <div class="blank_40"></div>
        <div class="blank_40"></div>

        <div class="addition ">
          <div class="addition_item">
            <div class="addition_item_label">昵称</div>
            <div class="addition_item_content">{{http.res.wechatInfo.nickName}}</div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">性别</div>

            <div class="addition_item_content" v-if="http.res.wechatInfo.sex === 1">男</div>
            <div class="addition_item_content" v-if="http.res.wechatInfo.sex === 2">女</div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">省</div>
          <div class="addition_item_content">{{http.res.wechatInfo.province}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">市</div>
          <div class="addition_item_content">{{http.res.wechatInfo.city}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">国家</div>
          <div class="addition_item_content">{{http.res.wechatInfo.country}}</div>
        </div>
      </div>
    </div>

    <div class="status_footer"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/TitleBar'
  import {httpUserApi} from '../../../../../api/http/user/httpUserApi'
  import {stateApi} from '../../../../../api/local/stateApi'

  export default {
    metaInfo: {
      title: '用户资料'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '用户资料',
          backUri: `/m/${this.$route.params.shortId}`,
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
        httpUserApi.getInfo(this.$route.params.userId).then(res => {
          if (res.userIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '查看资料',
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import "index";
</style>
