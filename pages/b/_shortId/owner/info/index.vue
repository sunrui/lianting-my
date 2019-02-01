<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">店铺头像</div>
          <div class="addition_item_avatar_input">
            <div class="addition_item_avatar_img_add" v-if="!http.req.info.logo"></div>
            <img class="addition_item_avatar_img" :src="http.req.info.logo" v-if="http.req.info.logo">
            <div class="addition_item_avatar_input_link" v-if="http.req.info.logo">></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">店铺名称</div>
          <input class="addition_item_input" placeholder="请输入店铺名称" maxlength="20" v-model="http.req.name.name">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">地址</div>
          <input class="addition_item_input" placeholder="请输入地址" maxlength="256" v-model="http.req.info.address">
        </div>

        <!--<div class="box_divide"></div>-->

        <!--<div class="addition_item">-->
        <!--<div class="addition_item_label">定位</div>-->
        <!--<input class="addition_item_input" placeholder="请点击定位" maxlength="20" v-model="nameReq.model.name">-->
        <!--</div>-->

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">电话</div>
          <input class="addition_item_input" placeholder="请输入电话" maxlength="20" v-model="http.req.info.phone">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">营业时间</div>
          <input class="addition_item_input" placeholder="请输入营业时间" maxlength="64" v-model="http.req.info.time">
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入公告" v-model="http.req.info.notice"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!--<div class="box">-->
    <!--<div class="addition box_radius">-->
    <!--<div class="addition_item">-->
    <!--<div class="addition_item_label_text_area">店铺图片</div>-->
    <!--<div class="addition_item_text_area">-->
    <!--<textarea class="addition_item_input_area_input" placeholder="" v-model="http.req.info.image"></textarea>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import {httpInfoApi} from '../../../../../api/http/ltorder/httpInfoApi'
  import {httpInfoAdminApi} from '../../../../../api/http/ltorder/httpInfoAdminApi'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../../components/TitleBar'

  export default {
    metaInfo: {
      title: '编辑资料'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '编辑资料',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            name: {},
            info: {
              logo: null,
              address: null,
              gps: null,
              phone: null,
              notice: null,
              image: null
            }
          }
        }
      }
    },
    created() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.req.name = res
      })

      httpInfoApi.get(this.$route.params.shortId).then(res => {
        this.http.req.info = res
      })
    },
    methods: {
      btnUpdate() {
        httpShopApi.putName(this.$route.params.shortId, this.http.req.name).then(res => {
          httpInfoAdminApi.put(this.$route.params.shortId, this.http.req.info).then(res => {
            this.$msgBox.doModal({
              type: 'yes',
              title: '编辑资料',
              content: '已更新。'
            }).then(async (val) => {
              this.$router.back()
            })
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common.scss';
  @import 'index';
</style>
