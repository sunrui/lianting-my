<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>要启用此功能，请确认展屏处在工作状态中。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">内容</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input" placeholder="请输入您要播报的通知" v-model="http.req.radio.radioText"></textarea>
            </label>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">标准女生播报</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.radio.standardVoice" @click="btnStandardVoice(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnStandardVoice(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-if="http.req.radio.radioText" @click="btnRadioTry">试听</div>
      <div class="button_big button_gray" v-else>试听</div>
      <div class="button_big" v-if="http.req.radio.radioText" @click="btnRadio">播报</div>
      <div class="button_big button_gray" v-else>播报</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpNotifyAdminApi} from '../../../../../api/http/lt/httpNotifyAdminApi'
  import {httpRadioAdminApi} from '../../../../../api/http/lt/httpRadioAdminApi'
  import {highlightApi} from '../../../../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '播报'
    },
    middleware: 'auth',
    components: {TitleBar},
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
            radio: {
              standardVoice: true,
              radioText: ''
            }
          }
        }
      }
    },
    mounted() {
      this.httpRadioConfig()
    },
    methods: {
      httpRadioConfig() {
        httpRadioAdminApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.radio = res
        })
      },
      btnStandardVoice(enable) {
        this.http.req.radio.standardVoice = enable

        httpRadioAdminApi.putConfig(this.$route.params.shortId, this.http.req.radio).then(res => {
        })
      },
      btnRadioTry() {
        let url = httpRadioAdminApi.getSpeechUrl(this.$route.params.shortId, this.http.req.radio.radioText)
        let audio = new Audio(url)
        audio.play()
      },
      btnRadio() {
        let content = `以下内容将发送至展屏:`
        content += `<br/><br/>${highlightApi.highlight(this.http.req.radio.radioText)}`

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '播报提醒',
          content: content
        }).then(async (val) => {
          if (val === 'Yes') {
            httpNotifyAdminApi.postRadio(this.$route.params.shortId, null, this.http.req.radio.radioText).then(res => {
              this.$msgBox.doModal({
                type: 'yes',
                title: '播报',
                content: '播报成功。'
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
