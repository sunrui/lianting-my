<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

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
          <div class="status_item_label">预订餐桌</div>
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
          <div class="status_item_label">手机号</div>
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
      <div class="button_big" @click="btnReply" v-if="http.res.reserve.status === 'Wait'">商家回复</div>
      <div class="button_big" @click="btnArrived" v-else-if="http.res.reserve.status === 'Accept'">已到店</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar';
  import {httpReserveApi} from '../../../../../../api/http/lt/httpReserveApi';
  import {httpReserveAdminApi} from '../../../../../../api/http/lt/httpReserveAdminApi';

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
          backUri: `/b/${this.$route.params.shortId}/waiter`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          req: {
            reply: {
              status: '',
              tableNumber: '',
              remark: ''
            }
          },
          res: {
            reserve: {}
          }
        },
        ui: {
          v_cover_mask: true
        }
      };
    },
    created() {
      this.httpReserve();
    },
    methods: {
      getStatus(status) {
        switch (status) {
          case 'Wait':
            return '等待确认';
          case 'Accept':
          case 'AcceptRead':
            return '预订成功';
          case 'Refused':
          case 'RefusedRead':
            return '预订失败';
          case 'Cancel':
            return '预订取消';
          case 'Arrived':
            return '已到店';
          default:
            return status;
        }
      },
      getProcessName(status) {
        switch (status) {
          case 'Wait':
            return '预约已提交，等待商家确认。';
          case 'Accept':
          case 'AcceptRead':
            return '您已预订成功，请及时到店。';
          case 'Refused':
          case 'RefusedRead':
            return '很抱歉，暂时无法接受您的预订。';
          case 'Cancel':
            return '您的预订已取消。';
          case 'Arrived':
            return '您已到店，祝您用餐愉快。';
          default:
            return status;
        }
      },
      httpReserve() {
        httpReserveApi.getOne(this.$route.params.shortId, this.$route.params.reserveId).then(res => {
          res.progress.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          });

          this.http.res.reserve = res;
        });
      },
      btnReply() {
        this.$router.push(`/b/${this.$route.params.shortId}/waiter/reserve/${this.$route.params.reserveId}/reply`);
      },
      btnArrived() {
        this.http.req.reply.status = 'Arrived';

        httpReserveAdminApi.putReply(this.$route.params.shortId, this.$route.params.reserveId, this.http.req.reply).then(res => {
          if (res.reserveIdNotExists) {
            alert('预订不存在');
            return;
          }

          if (res.success) {
            this.httpReserve();
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/reserve';
  @import 'index';
</style>
