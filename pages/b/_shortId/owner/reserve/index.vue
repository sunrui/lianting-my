<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">公告</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的公告" v-model="http.req.reserve.notice" autofocus></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="reserve_title">
      <div class="reserve_title_icon"></div>
      <div class="reserve_title_label">启用预订</div>
      <div class="addition_item_check">
        <div class="addition_item_check_on" v-if="http.req.reserve.enable" @click="btnEnable(false)"></div>
        <div class="addition_item_check_off" v-if="!http.req.reserve.enable" @click="btnEnable(true)"></div>
      </div>
    </div>

    <div class="box" v-for="day in ui.week" v-if="http.req.reserve.enable">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">{{day.name}}</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="day.enable || getReserveDay(day).length > 0" @click="btnDayEnable(day, false)"></div>
            <div class="addition_item_check_off" v-else @click="btnDayEnable(day, true)"></div>
          </div>
        </div>
      </div>

      <div class="week" v-if="day.enable || getReserveDay(day).length > 0">
        <div class="week_list">
          <div class="week_one" v-for="time in ui.times">
            <div class="week_one_name_select" v-if="isTimeEnable(day, time)" @click="btnTimeEnable(day, time, false)">{{time}}</div>
            <div class="week_one_name" v-if="!isTimeEnable(day, time)" @click="btnTimeEnable(day, time, true)">{{time}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import { httpReserveApi } from '../../../../../api/http/lt/httpReserveApi'
  import { httpReserveAdminApi } from '../../../../../api/http/lt/httpReserveAdminApi'
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '预订'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '预订',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            reserve: {}
          }
        },
        ui: {
          week: [
            { label: 'monday', name: '星期一', enable: false },
            { label: 'tuesday', name: '星期二', enable: false },
            { label: 'wednesday', name: '星期三', enable: false },
            { label: 'thursday', name: '星期四', enable: false },
            { label: 'friday', name: '星期五', enable: false },
            { label: 'saturday', name: '星期六', enable: false },
            { label: 'sunday', name: '星期天', enable: false }
          ],
          times: [
            '0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30',
            '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
          ]
        }
      }
    },
    created() {
      this.httpState()
    },
    methods: {
      httpState() {
        httpReserveApi.getState(this.$route.params.shortId).then(res => {
          this.http.req.reserve = res
          this.refreshEnable()
        })
      },
      btnEnable(enable) {
        this.http.req.reserve.enable = enable

        if (!enable) {
          for (let index in this.ui.week) {
            let day = this.ui.week[index]
            day.enable = false

            let reserveDay = this.getReserveDay(day)
            reserveDay.splice(0, reserveDay.length)
          }
        }
      },
      btnDayEnable(day, enable) {
        day.enable = enable

        if (!day.enable) {
          let reserveDay = this.getReserveDay(day)
          reserveDay.splice(0, reserveDay.length)

          this.refreshEnable()
        }
      },
      refreshEnable() {
        let haveEnable = false

        for (let index in this.ui.week) {
          let day = this.ui.week[index]

          let reserveDay = this.getReserveDay(day)
          if (reserveDay.enable || reserveDay.length > 0) {
            haveEnable = true
            break
          }
        }

        this.http.req.reserve.enable = haveEnable
      },
      getReserveDay(day) {
        if (day.label === 'monday') {
          return this.http.req.reserve.monday
        } else if (day.label === 'tuesday') {
          return this.http.req.reserve.tuesday
        } else if (day.label === 'wednesday') {
          return this.http.req.reserve.wednesday
        } else if (day.label === 'thursday') {
          return this.http.req.reserve.thursday
        } else if (day.label === 'friday') {
          return this.http.req.reserve.friday
        } else if (day.label === 'saturday') {
          return this.http.req.reserve.saturday
        } else if (day.label === 'sunday') {
          return this.http.req.reserve.sunday
        }
      },
      isTimeEnable(day, time) {
        let reserveDay = this.getReserveDay(day)
        return reserveDay.indexOf(time) !== -1
      },
      btnTimeEnable(day, time, enable) {
        let reserveDay = this.getReserveDay(day)
        let index = reserveDay.indexOf(time)

        if (enable && index === -1) {
          reserveDay.push(time)
        } else {
          reserveDay.splice(index, 1)
        }
      },
      btnUpdate() {
        httpReserveAdminApi.putState(this.$route.params.shortId, this.http.req.reserve).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '预订',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
