<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要启用排队功能，请至少添加一名店长和服务员。</li>
          <li>可在店长工作台中开启和关闭排队功能。</li>
          <li>可在服务员工作台中完成叫号功能。</li>
          <li>叫号时，顾客微信和展屏将同步收到推送提醒。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的公告" v-model="http.req.state.notice" autofocus></textarea>
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
            this.$router.push(this.title.backUri)
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
