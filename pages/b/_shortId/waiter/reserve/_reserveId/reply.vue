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
            <input class="reply_device_input" maxlength="8" v-model="http.req.reply.tableNumber">
          </label>
        </div>
      </div>

      <div class="reply_label">回复内容</div>

      <div class="reply_remark_area">
        <label>
          <textarea class="reply_remark_input" placeholder="请输入回复内容" maxlength="15" v-model="http.req.reply.remark"></textarea>
        </label>
      </div>

      <div class="box" v-if="http.req.reply.smsSendEnable">
        <div class="tip">
          <ul class="tip_ul">
            <li>{{getSmsTypeLabel()}}</li>
          </ul>
        </div>
      </div>

      <div class="addition_item">
        <div class="addition_item_label">发送短信</div>
        <div class="addition_item_check">
          <div class="addition_item_check_on" v-if="http.req.reply.smsSendEnable"
               @click="btnSmsSendEnable(false)"></div>
          <div class="addition_item_check_off" v-else @click="btnSmsSendEnable(true)"></div>
        </div>
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
  import {httpInfoApi} from '../../../../../../api/http/lt/httpInfoApi'
  import {httpShopApi} from '../../../../../../api/http/shop/httpShopApi'
  import {httpReserveApi} from '../../../../../../api/http/lt/httpReserveApi'

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
              smsSendEnable: true,
              remark: null
            }
          },
          res: {
            shop: {},
            info: {},
            reserve: {}
          }
        }
      }
    },
    mounted() {
      this.httpShop()
      this.httpInfo()
      this.httpReserve()

      this.btnChooseStatus(this.ui.status[0])
    },
    methods: {
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpInfo() {
        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.http.res.info = res
        })
      },
      btnChooseStatus(status) {
        this.http.req.reply.status = status.data
      },
      btnSmsSendEnable(enable) {
        this.http.req.reply.smsSendEnable = enable
      },
      httpReserve() {
        httpReserveApi.getOne(this.$route.params.shortId, this.$route.params.reserveId).then(res => {
          res.progress.sort(function (a, b) {
            return b.createdAt - a.createdAt
          })

          this.http.res.reserve = res
        })
      },
      getSmsTypeLabel() {
        let name = this.http.res.reserve.name || '匿名用户'
        let shop = this.http.res.shop.name || '恋厅'
        let desk = this.http.req.reply.tableNumber || '--'
        let phone = this.http.res.info.phone || '--'

        let status = this.http.req.reply.status
        if (status === 'Accept') {
          return `尊敬的${name}，您在${shop}的预订已成功，安排桌号${desk}。商家电话：${phone}。`
        } else if (status === 'Refused') {
          return `尊敬的${name}，您在${shop}的预订未成功，请在预订页查看详情。商家电话：${phone}。`
        }
      },
      sendNotifySms() {

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
              content: '请输入安排餐桌号。'
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
            if (this.http.req.reply.smsSendEnable) {
              this.sendNotifySms()
            }

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
