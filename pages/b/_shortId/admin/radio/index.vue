<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要启用此功能，首先确认您的屏屏处在工作状态中。</li>
          <li>您可以在下方输入您要播报的内容。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">内容</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的播报内容" v-model="http.req.notifyRadio.content"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-if="http.req.notifyRadio.content" @click="btnRadio">播报</div>
      <div class="button_big button_gray" v-else>播报</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpNotifyAdminApi} from '../../../../../api/http/lt/httpNotifyAdminApi'

  export default {
    metaInfo: {
      title: '播报'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '播报',
          backUri: `/b/${this.$route.params.shortId}/admin`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            notifyRadio: {
              content: null
            }
          }
        }
      }
    },
    methods: {
      btnRadio() {
        httpNotifyAdminApi.postRadio(this.$route.params.shortId, null, this.http.req.notifyRadio.content).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '播报',
            content: '播报成功。'
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
