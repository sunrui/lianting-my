<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="blank_20"></div>

    <div class="box">
      <div class="status box_radius">
        <div class="status_logo_radius status_logo_radius_center">
          <div class="status_logo_radius_image " v-bind:class="{
          new_logo_radius_image: http.res.reserve.status === 'Wait',
          success_logo_radius_image: http.res.reserve.status === 'Accept' || http.res.reserve.status === 'AcceptRead' || http.res.reserve.status === 'Arrived',
          failed_logo_radius_image: http.res.reserve.status === 'Refused' || http.res.reserve.status === 'RefusedRead' || http.res.reserve.status === 'Cancel',
          }"></div>
        </div>

        <div class="status_title">{{getStatus(http.res.reserve.status)}}</div>

        <div class="status_detail">{{getProcessName(this.http.res.reserve.status)}}</div>

        <div class="blank_40"></div>

        <div class="box_divide"></div>

        <div class="status_item">
          <div class="status_item_label">预约时间</div>
          <div class="status_item_content">{{new Date(parseInt(http.res.reserve.date)).toLocaleString()}}</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">餐桌类型</div>
          <div class="status_item_content">{{http.res.reserve.tableGroupName}}</div>
        </div>
        <div class="status_item" v-if="http.res.reserve.tableNumber">
          <div class="status_item_label">安排餐桌</div>
          <div class="status_item_content">{{http.res.reserve.tableNumber}}</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">人数</div>
          <div class="status_item_content">{{http.res.reserve.people}} 人</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">联系人</div>
          <div class="status_item_content">{{http.res.reserve.name}}</div>
        </div>
        <div class="status_item">
          <div class="status_item_label">性别</div>
          <div class="status_item_content">{{http.res.reserve.male ? '先生' : '女士'}}</div>
        </div>
        <div class="status_item">
          <div class="status_item_label" style="user-select: text;">手机号</div>
          <div class="status_item_content">{{http.res.reserve.phone}}</div>
        </div>
        <div class="blank_20"></div>
      </div>
    </div>

    <div class="box">
      <div class="reserve_process box_radius">
        <div class="reserve_process_item" v-for="(process, index) in http.res.reserve.progress">
          <div class="reserve_process_icon_ball_new" v-if="index === 0"></div>
          <div class="reserve_process_icon_ball_new_dot" v-if="index === 0"></div>
          <div class="reserve_process_icon_ball_new_dot" v-if="index === 0"></div>
          <div class="reserve_process_icon_ball" v-if="index !== 0"></div>
          <div class="reserve_process_icon_line"></div>
          <div class="reserve_process_content">
            <div class="reserve_process_content_time_new" v-if="index === 0">{{new Date(parseInt(process.createdAt)).toLocaleString()}}</div>
            <div class="reserve_process_content_time" v-if="index !== 0">{{new Date(parseInt(process.createdAt)).toLocaleString()}}</div>
            <div class="reserve_process_content_name">{{getProcessName(process.status)}}</div>

            <div v-if="process.status === 'Wait'">
              <div class="reserve_process_content_remark" v-if="http.res.reserve.remark">{{http.res.reserve.remark}}</div>
            </div>
            <div v-else>
              <div class="reserve_process_content_remark" v-if="process.remark">{{process.remark}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnRead" v-if="http.res.reserve.status === 'Accept' || http.res.reserve.status === 'Refused'">确定</div>
      <div class="button_big" @click="btnCancel" v-if="http.res.reserve.status === 'Wait'">取消预约</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpReserveApi} from '../../../../../api/http/lt/httpReserveApi'

  export default {
    metaInfo: {
      title: '预订详情'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '预订详情',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {
            reserve: {}
          }
        }
      }
    },
    created() {
      this.httpReserve()
    },
    methods: {
      getStatus(status) {
        switch (status) {
          case 'Wait':
            return '等待确认'
          case 'Accept':
          case 'AcceptRead':
            return '预订成功'
          case 'Refused':
          case 'RefusedRead':
            return '预订失败'
          case 'Cancel':
            return '预订取消'
          case 'Arrived':
            return '已到店'
          default:
            return status
        }
      },
      getProcessName(status) {
        switch (status) {
          case 'Wait':
            return '预约已提交，等待商家确认。'
          case 'Accept':
          case 'AcceptRead':
            return '您已预订成功，请及时到店。'
          case 'Refused':
          case 'RefusedRead':
            return '很抱歉，暂时无法接受您的预订。'
          case 'Cancel':
            return '您的预订已取消。'
          case 'Arrived':
            return '您已到店，祝您用餐愉快。'
          default:
            return status
        }
      },
      httpReserve() {
        httpReserveApi.getOne(this.$route.params.shortId, this.$route.params.reserveId).then(res => {
          res.progress.sort(function (a, b) {
            return b.createdAt - a.createdAt
          })

          this.http.res.reserve = res
        })
      },
      btnReply() {
        this.$router.push(`/c/${this.$route.params.shortId}/reserve/${this.$route.params.reserveId}/cancel`)
      },
      btnRead() {
        httpReserveApi.putRead(this.$route.params.shortId, this.$route.params.reserveId).then(res => {
          if (res.reserveIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '预订详情',
              content: '预订不存在。'
            })
            return
          }

          if (res.notAcceptOrRefused) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '预订详情',
              content: '非回复状态，请刷新。'
            })
            return
          }

          if (res.success) {
            this.$router.push(`/c/${this.$route.params.shortId}/reserve`)
          }
        })
      },
      btnCancel() {
        this.$router.push(`/c/${this.$route.params.shortId}/reserve/${this.$route.params.reserveId}/cancel`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/reserve';
</style>
