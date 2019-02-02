<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div v-bind:class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="reserve_notice_box">
      <div class="reserve_notice">
        <div class="reserve_notice_icon"></div>
        <div class="reserve_notice_label">{{http.res.state.notice ? http.res.state.notice : '听到叫号请到迎宾台，过号顺延3桌安排。'}}
        </div>
      </div>
    </div>

    <div class="reserve_content_box">
      <div class="blank_10"></div>
      <div class="blank_50"></div>

      <div class="date_select_box">
        <div class="time">
          <div class="date_item" v-for="(date, index) in ui.dates">
            <div class="date_item_desc" v-bind:class="{date_item_select_color: isSelectDate(date)}"
                 @click="btnDate(index, date)">{{getWeekDesc(date)}}
            </div>
            <div class="date_item_date" v-bind:class="{date_item_select_color: isSelectDate(date)}">{{date.getMonth() +
              1}}-{{date.getDate()}}
            </div>
            <div class="date_item_select" v-if="isSelectDate(date)">
              <div class="date_item_select_line"></div>
            </div>
          </div>
        </div>

        <div class="date_divide"></div>

        <div class="calendar_box" @click="btnCalendar">
          <div class="calendar_icon"></div>
        </div>
      </div>

      <div class="table_box">
        <div class="table_select_label">餐桌类型</div>

        <div class="table">
          <div class="table_list">
            <div v-bind:class="{
            table_box_table_info: ui.selectTableGroup.id !== tableGroup.id,
            table_box_table_info_select: ui.selectTableGroup.id === tableGroup.id}"
                 v-for="tableGroup in http.res.tableGroups.elements" @click="btnTableGroup(tableGroup)">
              <div class="table_box_table_title">
                <div v-bind:class="{
                table_box_table_name: ui.selectTableGroup.id !== tableGroup.id,
                table_box_table_name_select: ui.selectTableGroup.id === tableGroup.id
                }">{{tableGroup.name}}
                </div>
                <div class="table_box_table_private" v-if="tableGroup.privateRoom">包间</div>
              </div>
              <div v-bind:class="{table_box_table_people: ui.selectTableGroup.id !== tableGroup.id,
                table_box_table_people_select: ui.selectTableGroup.id === tableGroup.id}"
              >{{tableGroup.minPeople}}-{{tableGroup.maxPeople}}人
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="time_select_box">
        <div class="time_select_label">可预订时段</div>

        <div class="time_select_list">
          <div class="time_select_item" v-for="time in ui.dayTimes">
            <div class="time_select_item_one_select" v-if="ui.selectTime === time">{{time}}</div>
            <div class="time_select_item_one" v-if="ui.selectTime !== time" @click="btnChooseTime(time)">{{time}}</div>
          </div>

          <div class="time_select_item_none" v-if="ui.dayTimes.length === 0">没有可预订时段</div>
          <div class="blank_10"></div>
        </div>
      </div>

      <div class="blank_20"></div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnReserve">立即预订</div>
    </div>

    <transition name="toggle">
      <calendar @chooseCalendar="chooseCalendar" v-if="ui.v_calendar"></calendar>
    </transition>

  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import Calendar from '../../../../components/common/Calendar'
  import {timeApi} from '../../../../api/local/timeApi'
  import {httpTableApi} from '../../../../api/http/ltorder/httpTableApi'
  import {httpShopApi} from '../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../api/http/ltorder/httpInfoApi'
  import {httpReserveApi} from '../../../../api/http/ltorder/httpReserveApi'

  export default {
    metaInfo: {
      title: '预订'
    },
    middleware: 'auth',
    components: {TitleBar, Calendar},
    data() {
      return {
        title: {
          canBack: true,
          title: '预订',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          v_cover_mask: false,
          v_calendar: false,
          selectDate: null,
          selectTime: null,
          selectTableGroup: {},
          dates: [],
          dayTimes: []
        },
        http: {
          res: {
            shop: {},
            info: {},
            tableGroups: {},
            state: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
      this.httpReserveLive()
      this.httpState()
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
      httpState() {
        httpReserveApi.getState(this.$route.params.shortId).then(res => {
          this.http.res.state = res

          if (!res.enable) {
            this.$router.push(`/m/${this.$route.params.shortId}/reserve/close`)
          }

          this.httpTableGroup()
        })
      },
      httpReserveLive() {
        httpReserveApi.getAll(this.$route.params.shortId, 'Wait, Accept, Refused', null, 0, 1).then(res => {
          if (res.elements.length > 0) {
            this.$router.push(`/m/${this.$route.params.shortId}/reserve/${res.elements[0].id}`)
          }
        })
      },
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroups = res

          if (this.http.res.tableGroups.length === 0) {
            this.$router.push(`/m/${this.$route.params.shortId}/reserve/close`)
            return
          }

          this.ui.selectTableGroup = this.http.res.tableGroups.elements[0]
          this.btnDate(0, new Date())
        })
      },
      getWeekDesc(date) {
        return timeApi.getWeekDesc2(date)
      },
      isSelectDate(date) {
        return this.ui.selectDate.toDateString() === date.toDateString()
      },
      btnCalendar() {
        this.ui.v_cover_mask = true
        this.ui.v_calendar = true
      },
      btnDate(index, date) {
        this.ui.selectDate = date

        let day = 24 * 60 * 60 * 1000

        for (let i = 0; i < 4; i++) {
          if (index > i) {
            this.ui.dates[i] = new Date(date.getTime() - (index - i) * day)
          } else if (index === i) {
            this.ui.dates[i] = new Date(date.getTime())
          } else {
            this.ui.dates[i] = new Date(date.getTime() + (i - index) * day)
          }
        }

        switch (this.ui.selectDate.getDay()) {
          case 0:
            this.ui.dayTimes = this.http.res.state.monday
            break
          case 1:
            this.ui.dayTimes = this.http.res.state.tuesday
            break
          case 2:
            this.ui.dayTimes = this.http.res.state.wednesday
            break
          case 3:
            this.ui.dayTimes = this.http.res.state.thursday
            break
          case 4:
            this.ui.dayTimes = this.http.res.state.friday
            break
          case 5:
            this.ui.dayTimes = this.http.res.state.saturday
            break
          case 6:
            this.ui.dayTimes = this.http.res.state.sunday
            break
          default:
            this.ui.dayTimes = []
            this.ui.selectTime = null
            return
        }

        if (timeApi.isToday(this.ui.selectDate)) {
          let enableTimes = []

          for (let index in this.ui.dayTimes) {
            let enableTime = this.ui.dayTimes[index]
            let fmt = `${this.ui.selectDate.getFullYear()}-${this.ui.selectDate.getMonth() + 1}-${this.ui.selectDate.getDate()} ${enableTime}:00.000`
            if (new Date(fmt).getTime() >= new Date().getTime()) {
              enableTimes.push(enableTime)
            }
          }

          this.ui.dayTimes = enableTimes
        }

        if (this.ui.dayTimes.length > 0) {
          this.ui.selectTime = this.ui.dayTimes[0]
        } else {
          this.ui.selectTime = null
        }

        this.ui.v_calendar = false
        this.ui.v_cover_mask = false
      },
      btnTableGroup(tableGroup) {
        this.ui.selectTableGroup = tableGroup
      },
      chooseCalendar(ok, date) {
        if (ok) {
          this.btnDate(0, date)
        } else {
          this.ui.v_calendar = false
          this.ui.v_cover_mask = false
        }
      },
      btnChooseTime(time) {
        this.ui.selectTime = time
      },
      btnCoverMask() {
        this.ui.v_calendar = false
        this.ui.v_cover_mask = false
      },
      btnReserve() {
        if (!this.ui.selectTime) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '预订',
            content: '没有可预订时段。'
          })

          return
        }

        let fmt = `${this.ui.selectDate.getFullYear()}/${this.ui.selectDate.getMonth() + 1}/${this.ui.selectDate.getDate()} ${this.ui.selectTime}:00`

        this.$router.push({
          path: `/m/${this.$route.params.shortId}/reserve/create`,
          query: {
            date: new Date(fmt).getTime(),
            tableGroupName: this.ui.selectTableGroup.name
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
