<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="reserve in http.res.reserves.elements">
      <div class="list_title box_radius_header" @click="btnReserve(reserve)">
        <div class="reserve_name">{{reserve.name}}</div>
        <div class="reserve_sex">({{reserve.male ? '先生' : '女士'}})</div>
        <div class="reserve_status" v-bind:class="{
          reserve_status_arrived: reserve.status === 'Arrived',
          reserve_status_accept:reserve.status === 'Accept' || reserve.status === 'AcceptRead',
          reserve_status_refuse: reserve.status === 'Refuse' || reserve.status === 'RefuseRead',
          reserve_status_wating:reserve.status === 'Wait',
          reserve_status_cancel:reserve.status === 'Cancel'
        }">{{getStatus(reserve.status)}}
        </div>
      </div>

      <div class="box_divide_radius" @click="btnReserve(reserve)">
        <div class="box_divide_radius_line"></div>
      </div>
      <div class="reserve_info box_radius_footer">
        <div class="reserve_info_left" @click="btnReserve(reserve)">
          <div class="reserve_info_label">手机: <span class="reserve_info_label_phone">{{reserve.phone}}</span></div>
          <div class="reserve_info_label">餐桌: {{reserve.tableGroupName}}</div>
          <div class="reserve_info_label">人数: {{reserve.people}} 人</div>
        </div>
        <a class="reserve_info_middle" :href="btnPhone(reserve.phone)">
          <div class="reserve_info_phone"></div>
        </a>
        <div class="reserve_info_right" @click="btnReserve(reserve)">
          <div class="reserve_info_time">{{getReserveTime(reserve)}}</div>
        </div>
      </div>
      <div class="box" v-if="reserve.remark" @click="btnReserve(reserve)">
        <div class="reserve_remark box_radius_footer">
          <div class="reserve_remark_icon"></div>
          <span class="reserve_remark_label">{{reserve.remark}}</span>
        </div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpReserveApi} from '../../../../../api/http/lt/httpReserveApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {timeApi} from '../../../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '我的预订'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '我的预订',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 220
        },
        http: {
          res: {
            reserves: {}
          }
        }
      }
    },
    created() {
      this.httpReserves()
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
      btnPhone(phone) {
        return 'tel:' + phone
      },
      getReserveTime(reserve) {
        let date = new Date(parseInt(reserve.date))
        return timeApi.dateFormat(date, 'hh:mm')
      },
      httpReserves() {
        httpReserveApi.getAll(this.$route.params.shortId, null, null, 0, 99).then(res => {
          this.http.res.reserves = res
        })
      },
      btnReserve(reserve) {
        this.$router.push(`/c/${this.$route.params.shortId}/reserve/${reserve.id}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/reserve_history';
</style>
