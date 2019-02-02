<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="reply_area">
      <div class="reply_label">请告之我们您取消的原因</div>

      <div class="reply_remark">
        <div class="reply_remark_one" v-for="reason in ui.status">
          <div class="reply_remark_name" v-if="http.req.cancel.reason !== reason" @click="btnChooseReason(reason)">{{reason}}</div>
          <div class="reply_remark_name_select" v-if="http.req.cancel.reason === reason">{{reason}}</div>
        </div>
      </div>

      <div class="reply_remark_area">
        <textarea class="reply_remark_input" placeholder="请输入取消原因" maxlength="256" v-model="http.req.cancel.reason"></textarea>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnReply">确认取消</div>
      </div>
    </div>
  </div>
</template>

<script>

  import TitleBar from '../../../../../components/common/TitleBar'
  import { httpReserveApi } from '../../../../../api/http/ltorder/httpReserveApi'

  export default {
    metaInfo: {
      title: '取消预订'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '取消预订',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          status: [
            '临时改变行程', '已更换他家', '提前到现场', '其它原因'
          ]
        },
        http: {
          req: {
            cancel: {
              reason: null
            }
          }
        }
      }
    },
    created() {
      this.btnChooseReason(this.ui.status[0])
    },
    methods: {
      btnChooseReason(reason) {
        this.http.req.cancel.reason = reason
      },
      btnReply() {
        if (!Boolean(this.http.req.cancel.reason)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '取消预订',
            content: '请告之我们您取消的原因。'
          })

          return
        }

        httpReserveApi.putCancel(this.$route.params.shortId, this.$route.params.reserveId, this.http.req.cancel.reason).then(res => {
          if (res.reserveIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消预订',
              content: '预订不存在。'
            }).then(async (val) => {
              this.$router.push(`/m/${this.$route.params.shortId}/reserve`)
            })
          } else if (res.notNotWaitOrAccept) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消预订',
              content: '预订未进行中，无法取消。'
            }).then(async (val) => {
              this.$router.push(`/m/${this.$route.params.shortId}/reserve`)
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '取消预订',
              content: '取消成功。'
            }).then(async (val) => {
              this.$router.push(`/m/${this.$route.params.shortId}/reserve`)
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_reserve_reply';
</style>
