<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的公告" v-model="http.req.state.notice"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnNotice">更新</div>
    </div>
  </div>
</template>

<script>
  import { httpQueueApi } from '../../../../../api/http/lt/httpQueueApi'
  import { httpQueueAdminApi } from '../../../../../api/http/lt/httpQueueAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '排队'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '排队',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            state: {}
          }
        }
      }
    },
    created() {
      this.httpState()
    },
    methods: {
      httpState() {
        httpQueueApi.getState(this.$route.params.shortId).then(res => {
          this.http.req.state = res
        })
      },
      btnNotice() {
        httpQueueAdminApi.putState(this.$route.params.shortId, this.http.req.state).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '排队',
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
