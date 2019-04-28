<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme"
               :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

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
          <label>
            <input class="addition_item_input" placeholder="请输入店铺名称" maxlength="20" v-model="http.req.shop.name">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">地址</div>
          <label>
            <input class="addition_item_input" placeholder="请输入地址" maxlength="256" v-model="http.req.info.address">
          </label>
        </div>

        <!--<div class="box_divide"></div>-->

        <!--<div class="addition_item">-->
        <!--<div class="addition_item_label">定位</div>-->
        <!--<input class="addition_item_input" placeholder="请点击定位" maxlength="20" v-model="nameReq.model.name">-->
        <!--</div>-->

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">电话</div>
          <label>
            <input type="number" class="addition_item_input" placeholder="请输入电话"
                   oninput="value=value.replace(/[^0-9]/g,'');
                            if (value.length > 12) value = value.slice(0, 12);"
                   v-model="http.req.info.phone">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">营业时间</div>
          <label>
            <input class="addition_item_input" placeholder="请输入营业时间" maxlength="64"
                   v-model="http.req.info.time">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入公告" v-model="http.req.info.notice"></textarea>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">热门搜索</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="ui.searchWordEnable"
                 @click="btnSearchWord(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnSearchWord(true)"></div>
          </div>
        </div>

        <div v-if="ui.searchWordEnable">
          <div class="food_price">
            <div class="food_price_title">
              <div class="food_price_title_label"></div>
              <div class="food_price_table_add" @click="btnSearchWordAdd"></div>
            </div>

            <div v-for="searchWord in ui.searchWords">
              <div class="food_price_one">
                <div class="food_price_name">{{searchWord}}</div>
                <div class="food_price_delete" @click="btnSearchWordDelete(searchWord)"></div>
              </div>
              <div class="box_divide"></div>
            </div>
            <div v-if="ui.searchWords.length === 0">
              <div class="food_price_empty">
                <div class="food_price_empty_label">暂无搜索关键字。</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal_center" v-if="ui.vSearchWordAdd">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">添加关键字</div>

        <div class="modal_input_box">
          <div class="modal_input_area">
            <label>
              <input class="modal_input" placeholder="请输入关键字，如：米饭。" maxlength="12" v-model="ui.searchWord"
              >
            </label>
          </div>
        </div>

        <div class="modal_button_box">
          <div class="button_big" v-if="ui.searchWord" @click="btnSearchWordAddConfirm">确定</div>
          <div class="button_big button_gray" v-else>确定</div>
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
  import {httpSearchApi} from '../../../../../api/http/lt/httpSearchApi'
  import {httpSearchAdminApi} from '../../../../../api/http/lt/httpSearchAdminApi'

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
            shop: {},
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
          vCoverMask: false,
          searchWordEnable: false,
          searchWords: ['米饭', '酒'],
          searchWord: null,
          vSearchWordAdd: false
        }
      }
    },
    created() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.req.shop = res
      })

      httpInfoApi.get(this.$route.params.shortId).then(res => {
        this.http.req.info = res
      })

      if (this.http.req.shop.licenseType !== 'Free') {
        httpSearchApi.getSearchWord(this.$route.params.shortId).then(res => {
          if (res.length > 0) {
            this.ui.searchWords = res
            this.ui.searchWordEnable = true
          }
        })
      }
    },
    methods: {
      btnUpdate() {
        httpShopApi.putName(this.$route.params.shortId, this.http.req.shop.name).then(res => {
          httpInfoAdminApi.put(this.$route.params.shortId, this.http.req.info).then(res => {
            if (this.http.req.shop.licenseType !== 'Free') {
              if (!this.ui.searchWordEnable) {
                this.ui.searchWords = []
              }

              httpSearchAdminApi.putSearchWord(this.$route.params.shortId, this.ui.searchWords).then(res => {
                if (res.maxLimit) {
                  this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
                } else if (res.success) {
                  this.$msgBox.doModal({
                    type: 'yes',
                    title: '资料',
                    content: '已更新。'
                  }).then(async (val) => {
                    this.$router.push(this.title.backUri)
                  })
                }
              })
            } else {
              this.$msgBox.doModal({
                type: 'yes',
                title: '资料',
                content: '已更新。'
              }).then(async (val) => {
                this.$router.push(this.title.backUri)
              })
            }
          })
        })
      },
      uploadLogoSuccess(fileName) {
        this.$set(this.http.req.info, 'logo', fileName)
      },
      uploadImageSuccess(fileName) {
        this.$set(this.http.req.info, 'image', fileName)
      },
      btnCoverMask() {
        this.ui.vCoverMask = false
        this.ui.vSearchWordAdd = false
      },
      btnSearchWord(enable) {
        if (enable) {
          if (this.http.req.shop.licenseType === 'Free') {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
            return
          }
        }

        this.ui.searchWordEnable = enable
      },
      btnSearchWordAdd() {
        if (this.http.req.shop.licenseType === 'Free') {
          this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
          return
        }

        this.ui.searchWord = ''
        this.ui.vCoverMask = true
        this.ui.vSearchWordAdd = true
      },
      btnSearchWordDelete(searchWord) {
        for (let index in this.ui.searchWords) {
          let one = this.ui.searchWords[index]

          if (one === searchWord) {
            this.ui.searchWords.splice(index, 1)
            break
          }
        }
      },
      btnSearchWordAddConfirm() {
        this.ui.vCoverMask = false
        this.ui.vSearchWordAdd = false

        if (this.ui.searchWords.length > 20) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加关键字',
            content: '最多允许 20 组关键字。'
          })

          return
        }

        let have = false

        for (let index in this.ui.searchWords) {
          let one = this.ui.searchWords[index]

          if (one === this.ui.searchWord) {
            have = true
            break
          }
        }

        if (have) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '添加关键字',
            content: '关键字已存在。'
          })
        } else {
          this.ui.searchWords.push(this.ui.searchWord)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_food';
  @import 'index';
</style>
