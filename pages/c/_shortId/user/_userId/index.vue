<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_100"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <img class="status_logo_radius_image " :src="http.res.info.headImgUrl" :alt="http.res.info.nickName">
        </div>

        <div class="blank_40"></div>
        <div class="blank_40"></div>

        <div class="addition ">
          <div class="addition_item">
            <div class="addition_item_label">昵称</div>
            <div class="addition_item_content">{{http.res.info.nickName}}</div>
          </div>

          <div class="box_divide"></div>

          <div class="addition_item">
            <div class="addition_item_label">性别</div>
            <div class="addition_item_content" v-if="http.res.info.sex === 1">{{http.res.info.male ? '男' : '女'}}</div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">地址</div>
          <div class="addition_item_content">{{http.res.info.address}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">个性签名</div>
          <div class="addition_item_content">{{http.res.info.signature}}</div>
        </div>
      </div>
    </div>

    <div class="blank_20"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import { httpUserApi } from '../../../../../api/http/user/httpUserApi'

  export default {
    metaInfo: {
      title: '用户资料'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '用户资料',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          res: {
            info: {
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
              this.$router.push(this.title.backUri)
            })

            return
          }

          if (!Boolean(res.info)) {
            res.info = {}
            res.info.nickName = '匿名用户'
            res.info.male = true
            res.info.headImgUrl = '/img/default/default_user_avatar.png'
          }

          this.http.res.info = res.info
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
