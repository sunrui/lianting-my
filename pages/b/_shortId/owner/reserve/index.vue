<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的公告" v-model="http.req.reserve.notice"></textarea>
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
  import { httpReserveApi } from '../../../../../api/http/ltorder/httpReserveApi'
  import { httpReserveAdminApi } from '../../../../../api/http/ltorder/httpReserveAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '预订'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '预订',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            reserve: {}
          }
        }
      }
    },
    created() {
      this.httpState()
    },
    methods: {
      httpState() {
        httpReserveApi.getState(this.$route.params.shortId).then(res => {
          this.http.req.reserve = res
          this.refreshEnable()
        })
      },
      btnUpdate() {
        httpReserveAdminApi.putState(this.$route.params.shortId, this.http.req.reserve).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '预订',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.back()
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
