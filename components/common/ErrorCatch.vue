<template>
  <div>
    <div class="empty" v-if="ui.error.frequent">
      <img class="empty_image" src="/img/no/no_crash.png" alt="">
      <div class="empty_label">您的操作过于频繁，请于{{elapsedTime(ui.error.frequent)}}后重试。</div>
    </div>
    <div v-else>
      <div class="empty" v-if="!ui.vReport">
        <img class="empty_image" src="/img/no/no_crash.png" alt="">
        <div v-if="!ui.reported">
          <div class="empty_label">{{ui.error.notFound? '404 - 呃〜好像迷路了！' : '呃〜服务器又去度假了！'}}</div>
          <div class="empty_label_tip">您可<span class="empty_label_tip_link" @click="btnReport">提交反馈</span>来帮助我们或返回重试。</div>
          <div class="blank_30"></div>
        </div>
        <div v-else>
          <div class="empty_label">感谢您的反馈，请您关闭窗口。</div>
        </div>
      </div>
      <div v-else>
        <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

        <div class="box">
          <div class="addition box_radius_header">
            <div class="addition_item" v-if="ui.error.message">
              <div class="addition_item_label_text_area">内容</div>
              <div class="addition_item_text_area">
                <label>
                  <textarea class="addition_item_text_input" v-model="ui.error.message"></textarea>
                </label>
              </div>
            </div>
          </div>

          <div class="box_divide_radius">
            <div class="box_divide_radius_line"></div>
          </div>

          <div class="report_input_area box_radius_footer">
            <textarea class="report_input" placeholder="请描述您浮现的过程，以帮助我们更好的改进产品。" v-model="http.req.report.message" maxlength="256"></textarea>
          </div>
        </div>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnReportConfirm">提交反馈</div>

        <div class="blank_30"></div>
        <div class="report_return" @click="btnReturn">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {timeApi} from '../../api/local/timeApi'
  import {storeApi} from '../../api/local/storeApi'
  import TitleBar from '../../components/common/TitleBar'
  import {stringApi} from '../../api/local/stringApi'
  import {httpReportApi} from '../../api/http/report/httpReportApi'

  export default {
    metaInfo: {
      title: '访问异常'
    },
    components: {TitleBar},
    props: ['error'],
    data() {
      return {
        http: {
          req: {
            report: {
              exception: '',
              message: ''
            }
          }
        },
        title: {
          canBack: false,
          title: '问题反馈',
          backUri: null,
          theme: 'image',
          imageHeight: 460
        },
        ui: {
          vReport: false,
          reported: false,
          error: {
            notFound: false,
            frequent: null,
            message: null
          }
        }
      }
    },
    created() {
      this.initError()
    },
    methods: {
      initError() {
        this.ui.error.notFound = this.error && this.error.statusCode === 404
        this.ui.error.message = this.error ? this.error.message : null

        if (this.ui.error.notFound || Boolean(this.ui.error.message)) {
          return
        }

        let error = storeApi.object.get('error')
        if (error === null) {
          this.ui.error.message = 'unknown error'
          return
        }

        try {
          let errorJson = JSON.parse(JSON.stringify(error))

          if (typeof errorJson === 'string') {
            this.ui.error.message = error
          } else if (typeof errorJson === 'object') {
            if (errorJson.error === 'CoreFrequent') {
              this.ui.error.frequent = errorJson.data.value * 1000
            } else {
              this.ui.error.message = JSON.stringify(errorJson, null, 2)
            }
          } else {
            this.ui.error.message = errorJson.toString()
          }
        } catch (e) {
          this.ui.error.message = stringApi.trim(e.toString())
        }
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      btnReport() {
        this.ui.vReport = true
      },
      btnReturn() {
        this.ui.vReport = false
      },
      btnReportConfirm() {
        this.initError()

        if (this.ui.error.frequent) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '问题反馈',
            content: '由于您的操作过于繁频，您无需反馈请稍候重试。'
          })

          return
        }

        if (!Boolean(this.http.req.report.message)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '问题反馈',
            content: '请描述您浮现的过程。'
          })

          return
        }

        if (this.ui.error.message.length > 1024) {
          this.ui.error.message = this.ui.error.message.slice(0, 1023)
        }

        httpReportApi.post({
          exception: this.ui.error.message,
          message: this.http.req.report.message
        }).then(res => {
          storeApi.object.set('error', null)
          this.ui.vReport = false
          this.ui.reported = true
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'ErrorCatch';
</style>
