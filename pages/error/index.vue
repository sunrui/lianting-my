<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="empty" v-if="ui.error.frequent">
      <img class="empty_image" src="/img/no/no_crash.png">
      <div class="empty_label2">您的操作过于频繁，请于{{elapsedTime(ui.error.frequent)}}后重试。</div>
    </div>
    <div v-else>
      <div class="empty" v-if="!ui.v_report">
        <img class="empty_image" src="/img/no/no_crash.png">
        <div class="empty_label">呃〜访问出错了！</div>
        <div class="empty_label2">您可将出错原因反馈给我们或返回重试。</div>

        <div class="button_box">
          <div class="button_big" @click="btnReport">编辑反馈</div>
        </div>
      </div>
      <div v-else>
        <div class="box">
          <div class="addition box_radius">
            <div class="addition_item" v-if="ui.error.message">
              <div class="addition_item_label_text_area">内容</div>
              <div class="addition_item_text_area">
                <textarea class="addition_item_text_input" v-model="ui.error.message"></textarea>
              </div>
            </div>
            <div v-else-if="ui.error.json.error">
              <div class="addition_item">
                <div class="addition_item_label"></div>
                <input class="addition_item_input">
              </div>
              <div class="addition_item">
                <div class="addition_item_label">error</div>
                <input class="addition_item_input" v-model="ui.error.json.error">
              </div>
              <div class="addition_item">
                <div class="addition_item_label_text_area">data</div>
                <div class="addition_item_text_area">
                  <textarea class="addition_item_text_input" v-model="ui.error.json.data"></textarea>
                </div>
              </div>
              <div class="addition_item">
                <div class="addition_item_label">file</div>
                <input class="addition_item_input" v-model="ui.error.json.file">
              </div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="report_input_area box_radius">
            <textarea class="report_input" placeholder="请告之我们您的出错过程..."></textarea>
          </div>
        </div>

        <div class="button_box">
          <div class="button_big" @click="btnReportConfirm">提交反馈</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { timeApi } from '../../api/local/timeApi'
  import { storeApi } from '../../api/local/storeApi'
  import TitleBar from '../../components/common/TitleBar'
  import { stringApi } from '../../api/local/stringApi'
  import { logApi } from '../../api/local/logApi'

  export default {
    metaInfo: {
      title: '内部错误'
    },
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '内部错误',
          backUri: null,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          v_report: false,
          reported: false,
          error: {
            frequent: null,
            json: {},
            message: null
          }
        }
      }
    },
    created: function() {
      let error = storeApi.object.get('error')

      if (!Boolean(error)) {
        this.ui.error.message = '未知错误'
        return
      }

      try {
        error = JSON.stringify(error)
        this.ui.error.json = JSON.parse(error)

        if (typeof this.ui.error.json === 'string') {
          this.ui.error.json = null
          this.ui.error.message = error
        } else {
          if (this.ui.error.json.error === 'CoreFrequent') {
            this.ui.error.frequent = this.ui.error.json.data.value * 1000
            this.ui.error.json = null
          }

          logApi.error(this.ui.error.json.data)

          this.ui.error.json.data = JSON.stringify(this.ui.error.json.data)
        }
      } catch (e) {
        this.ui.error.message = stringApi.trim(error)
      }

      // storeApi.object.set('error', null)
    },
    methods: {
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      btnReport() {
        this.ui.v_report = true
      },
      btnReportConfirm() {
        this.$msgBox.doModal({
          type: 'yes',
          title: '提交成功',
          content: '您已提交成功，感谢您的反馈。'
        }).then(async (val) => {
          this.ui.v_report = false
          this.ui.reported = true
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
