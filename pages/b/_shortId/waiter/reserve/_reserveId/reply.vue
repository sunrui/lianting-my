<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme"
               :imageHeight="title.imageHeight"></title-bar>

    <div class="reply_area">
      <div class="reply_label">请选择预订状态</div>

      <div class="reply_remark">
        <div class="reply_remark_one" v-for="status in ui.status">
          <div class="reply_remark_name" v-if="http.req.reply.status !== status.data" @click="btnChooseStatus(status)">
            {{status.label}}
          </div>
          <div class="reply_remark_name_select" v-if="http.req.reply.status === status.data">{{status.label}}</div>
        </div>
      </div>

      <div v-if="http.req.reply.status === 'Accept'">
        <div class="reply_label">安排餐桌号</div>
        <div class="reply_device_area">
          <label>
            <input class="reply_device_input" maxlength="6" v-model="http.req.reply.tableNumber">
          </label>
        </div>
      </div>

      <div class="reply_label">回复留言</div>

      <div class="reply_remark_area">
        <textarea class="reply_remark_input" placeholder="请输入要回复给顾客的留言" maxlength="256" v-model="http.req.reply.remark"></textarea>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnReply">确认回复</div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpReserveAdminApi} from '../../../../../../api/http/lt/httpReserveAdminApi'

  export default {
    metaInfo: {
      title: '回复预订'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '回复预订',
          backUri: `/b/${this.$route.params.shortId}/waiter/reserve`,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          status: [
            {label: '预订成功', data: 'Accept'},
            {label: '预订失败', data: 'Refused'}
          ]
        },
        http: {
          req: {
            reply: {
              status: null,
              tableNumber: null,
              remark: null
            }
          }
        }
      }
    },
    created() {
      this.btnChooseStatus(this.ui.status[0])
    },
    methods: {
      btnChooseStatus(status) {
        this.http.req.reply.status = status.data
      },
      btnReply() {
        if (!Boolean(this.http.req.reply.status)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '回复预订',
            content: '请先选择预订状态。'
          })

          return
        }

        if (this.http.req.reply.status === 'Accept') {
          if (!Boolean(this.http.req.reply.tableNumber)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '回复预订',
              content: '请输入安排的餐桌号。'
            })

            return
          }
        }

        httpReserveAdminApi.putReply(this.$route.params.shortId, this.$route.params.reserveId, this.http.req.reply).then(res => {
          if (res.reserveIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '回复预订',
              content: '预订不存在。'
            }).then(async (val) => {
              this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve`)
            })
          } else if (res.success) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '回复预订',
              content: '已回复。'
            }).then(async (val) => {
              this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve`)
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
