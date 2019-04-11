<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">店铺头像</div>
          <div class="addition_item_avatar_input">
            <image-upload :b="true" :file-url="http.req.info.logo" v-on:uploadSuccess="uploadLogoSuccess"></image-upload>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">店铺背景</div>
          <div class="addition_item_avatar_input">
            <image-upload :b="true" :file-url="http.req.info.image" v-on:uploadSuccess="uploadImageSuccess"></image-upload>
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
          <input type="number" class="addition_item_input" placeholder="请输入电话"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');
                          if (value.length > 11) value = value.slice(0, 11)"
                 v-model="http.req.info.phone">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">营业时间</div>
          <input class="addition_item_input" placeholder="请输入营业时间" maxlength="64" v-model="http.req.info.time">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入公告" v-model="http.req.info.notice"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">热门搜索关键字</div>

          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.searchWordEnable" @click="btnTag(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnTag(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import {httpInfoApi} from '../../../../../api/http/lt/httpInfoApi'
  import {httpInfoAdminApi} from '../../../../../api/http/lt/httpInfoAdminApi'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../../components/common/TitleBar'
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
        },
        ui: {
          searchWordEnable: false
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
              title: '资料',
              content: '已更新。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
            })
          })
        })
      },
      uploadLogoSuccess(fileName) {
        this.$set(this.http.req.info, 'logo', fileName)
      },
      uploadImageSuccess(fileName) {
        this.$set(this.http.req.info, 'image', fileName)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
