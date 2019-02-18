<template>
  <div>
    <div v-if="ui.fullScreen" class="tv_full_screen">
      <div class="tv_full_screen_header">
        <img class="tv_shop_icon" :src="http.res.info.logo" :alt="http.res.shop.name">
        <div class="tv_shop_title">{{http.res.shop.name}}</div>
        <div class="tv_shop_state">
          <div class="tv_shop_state_icon_open" v-if="http.res.shop.open"></div>
          <div class="tv_shop_state_icon_close" v-else></div>
          <div class="tv_shop_state_label">{{http.res.shop.open ? '营业中' : '已打烊' }}</div>
        </div>
      </div>
      <div class="tv_full_screen_radio">
        <div class="tv_full_screen_radio_icon"></div>
        <div class="tv_full_screen_radio_label">
          <marquee id="tv_radio_table" scrollamount="10">
            <div class="tv_full_screen_radio_label_content" v-if="ui.radioTable">
              请<span class="tv_full_screen_radio_label_number">{{ui.radioTable}}</span>号顾客前往迎宾台就餐。
            </div>
          </marquee>
        </div>
      </div>
      <div class="tv_full_screen_footer">
        <div class="tv_full_screen_captcha_box">
          <div class="tv_full_screen_captcha">
            <canvas id="tv_captcha" v-show="ui.showCaptcha"></canvas>
          </div>
          <div class="tv_full_screen_captcha_label">扫码可排队点餐</div>
        </div>
        <div class="tv_full_screen_time_box">
          <div class="tv_full_screen_time_box_left">
            <div class="tv_full_screen_time_label">{{ui.time.time}}</div>
          </div>
          <div class="tv_full_screen_time_box_right">
            <div class="tv_full_screen_time_week">{{ui.time.week}}</div>
            <div class="tv_full_screen_time_date">{{ui.time.date}}</div>
          </div>
        </div>
        <div class="tv_full_screen_footer_table">
          <div class="tv_full_screen_footer_table_title" v-for="title in ui.titles">{{title}}</div>

          <div v-for="tableOne in ui.tables">
            <div class="tv_full_screen_footer_table_content" v-for="(one, index) in tableOne">{{one}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="tv_prompt">
      <div class="blank_100"></div>
      <div class="tv_prompt_label">展屏</div>
      <div class="blank_20"></div>
      <div class="tv_promt_demo"></div>
      <div class="tv_prompt_label">由于浏览器限制，仅允许<span class="tv_prompt_button" @click="btnFullScreen">手动全屏</span>。</div>
    </div>
  </div>

</template>

<script>
  import {screenApi} from "../../../api/local/screenApi"
  import {httpQueueApi} from '../../../api/http/lt/httpQueueApi'
  import {httpTableApi} from '../../../api/http/lt/httpTableApi'
  import {httpShopApi} from '../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../api/http/lt/httpInfoApi'

  import QRCode from 'qrcode'
  import {timeApi} from "../../../api/local/timeApi"
  import {loadingApi} from "../../../api/local/loadingApi"

  export default {
    metaInfo: {
      title: '展屏'
    },
    middleware: 'auth',
    data() {
      return {
        http: {
          res: {
            shop: {},
            info: {},
            state: {},
            tableGroups: {},
            tableGroupNows: {}
          }
        },
        ui: {
          fullScreen: false,
          drewCaptcha: false,
          showCaptcha: false,
          time: {
            time: '00:00',
            week: '星期一',
            date: '2000-01-01'
          },
          titles: ['餐桌', '等待桌数', '当前就餐', '首桌已等待'],
          tables: [],
          radioTable: ''
        }
      }
    },
    created() {
      document.addEventListener("fullscreenchange", this.onFullScreenChange)
      document.addEventListener("mozfullscreenchange", this.onFullScreenChange)
      document.addEventListener("webkitfullscreenchange", this.onFullScreenChange)
      document.addEventListener("msfullscreenchange", this.onFullScreenChange)

      loadingApi.enable = false

      this.httpState()
      this.httpShop()
      this.httpInfo()

      this.updateTime()

      setInterval(this.updateTime, 60 * 1000)
      setInterval(this.httpState, 10 * 1000)
    },
    methods: {
      updateTime() {
        let date = new Date()
        this.ui.time.time = timeApi.dateFormat(date, 'HH:mm')
        this.ui.time.week = timeApi.getWeekDesc(date)
        this.ui.time.date = timeApi.dateFormat(date, 'yyyy-MM-dd')
      },
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
      getGroupNow(tableGroupId) {
        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]

          if (tableGroupNow.tableGroupId === tableGroupId) {
            return tableGroupNow
          }
        }

        return null
      },
      getWaitPeople(tableGroupId) {
        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]

          if (tableGroupNow.tableGroupId === tableGroupId) {
            return tableGroupNow.waitPeople
          }
        }

        return 0
      },
      getGroupWaitSeconds(tableGroup) {
        let seconds = 0

        for (let index in this.http.res.tableGroupNows.elements) {
          let tableGroupNow = this.http.res.tableGroupNows.elements[index]
          if (tableGroupNow.tableGroupId === tableGroup.id && tableGroupNow.elapsedAverage) {
            seconds = tableGroupNow.elapsedAverage * tableGroupNow.waitPeople
            break
          }
        }

        return seconds
      },
      getTime(seconds) {
        let day = parseInt(seconds / 60 / 60 / 24)
        let hour = parseInt(seconds / 60 / 60)
        let minute = parseInt(seconds / 60 % 60)
        let second = parseInt(seconds % 60)

        if (day > 0) {
          return `${day}`
        }

        if (hour > 0) {
          return `${hour}`
        }

        if (minute > 0) {
          return `${minute}`
        }

        if (second > 0) {
          return `${second}`
        }

        return '--'
      },
      getTime2(seconds) {
        let day = parseInt(seconds / 60 / 60 / 24)
        let hour = parseInt(seconds / 60 / 60)
        let minute = parseInt(seconds / 60 % 60)
        let second = parseInt(seconds % 60)

        if (day > 0) {
          return `天`
        }

        if (hour > 0) {
          return `小时`
        }

        if (minute > 0) {
          return `分钟`
        }

        if (second > 0) {
          return `秒`
        }

        return '分钟'
      },
      httpState() {
        this.http.res.state = {}
        this.http.res.tableGroups = {}

        this.ui.v_queue_number = false
        this.ui.v_table_select = false
        this.ui.v_cover_mask = false

        httpQueueApi.getState(this.$route.params.shortId).then(res => {
          this.http.res.state = res

          if (this.http.res.state.needQueues.length === 0) {
            this.$router.push(`/m/${this.$route.params.shortId}/queue/close`)
            return
          }

          this.httpTableGroup()
        })
      },
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroups = res

          let haveNeedQueue = false

          for (let index in this.http.res.tableGroups.elements) {
            let tableGroup = this.http.res.tableGroups.elements[index]
            tableGroup.needQueue = false

            for (let enableQueueIndex in this.http.res.state.needQueues) {
              let tableGroupId = this.http.res.state.needQueues[enableQueueIndex]

              if (tableGroupId === tableGroup.id) {
                tableGroup.needQueue = true
                haveNeedQueue = true

                if (!this.ui.selectTableGroupId) {
                  this.ui.selectTableGroupId = tableGroup.id
                }

                break
              }
            }
          }

          this.httpNow()
        })
      },
      httpNow() {
        httpQueueApi.getNowAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroupNows = res
          this.refreshTables()
        })
      },
      refreshTables() {
        this.ui.tables = []

        for (let index in this.http.res.tableGroups.elements) {
          let tableGroup = this.http.res.tableGroups.elements[index]

          let table = []
          table.push(`${tableGroup.name} (${tableGroup.minPeople}-${tableGroup.maxPeople}人)`)
          table.push(this.getWaitPeople(tableGroup.id))

          if (this.getGroupNow(tableGroup.id)) {
            let queueTicket = this.getGroupNow(tableGroup.id).queueTicket
            table.push(queueTicket.tableGroupNumberPrefix + queueTicket.sequence)

            if (this.getWaitPeople(tableGroup.id) === 0) {
              table.push('--')
            } else {
              table.push(this.getTime((new Date().getTime() - queueTicket.createdAt) / 1000) +
                this.getTime2((new Date().getTime() - queueTicket.createdAt) / 1000))
            }
          } else {
            table.push('--')
            table.push('--')
          }

          this.ui.tables.push(table)
        }

        this.refreshRadioContent()

        this.ui.showCaptcha = !this.ui.showCaptcha
        if (!this.ui.drewCaptcha) {
          this.drawCaptcha()
        }
      },
      refreshRadioContent() {
        this.ui.radioTable = new Date().getSeconds()
        let element = document.getElementById('tv_radio_table')
        if (element !== null) {
          element.start()
        }
      },
      drawCaptcha() {
        let canvas = document.getElementById('tv_captcha')
        if (canvas != null) {
          let text = document.location.protocol + '//' + window.location.host + `/m/${this.$route.params.shortId}`
          QRCode.toCanvas(canvas, text)
          this.ui.drewCaptcha = true
        }
      },
      onFullScreenChange(e) {
        if (!screenApi.isFullScreen()) {
          this.ui.fullScreen = false
        }

        this.ui.drewCaptcha = false
      },
      btnFullScreen() {
        // let element = window.document.getElementById('tv_full_screen')
        // screenApi.enterFullScreen(element)
        this.ui.fullScreen = true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "tv";
</style>