<template>
  <div>
    <div v-if="ui.fullScreen" class="tv_full_screen">
      <div class="tv_full_screen_header">
        <img class="tv_shop_icon" :src="http.res.info.logo" :alt="http.res.shop.name" onerror="this.style.display='none'">
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
          <marquee id="tv_radio_table">
            <div class="tv_full_screen_radio_label_content" v-if="http.res.notifyRadio.tableFullNumber">
              请<span class="tv_full_screen_radio_label_number">{{http.res.notifyRadio.tableFullNumber}}</span>号顾客前往迎宾台就餐。
            </div>
            <div class="tv_full_screen_radio_label_content" v-else-if="http.res.notifyRadio.content">
              {{http.res.notifyRadio.content}}
            </div>
            <div class="tv_full_screen_radio_label_content" v-else>
              {{http.res.info.notice ? http.res.info.notice : '欢迎您的光临。'}}
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
    <div v-else>
      <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

      <div class="box">
        <div class="tip">
          <ul class="tip_ul">
            <li>要启用展屏功能，首先您的餐厅需要拥有一台显示设备。</li>
            <li>推荐显示尺寸为 1920x1080，同样支持 4K 及以上高清电视。</li>
            <li>您可在要显示设备的浏览器中直接访问以下地址。</li>
            <li><a class="tv_link" :href="getTvUrl()">{{getTvUrl()}}</a></li>
          </ul>
        </div>
      </div>

      <div class="button_box">
        <div class="button_big" @click="btnFullScreen">打开展屏</div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import {screenApi} from '../../../../api/local/screenApi'
  import {httpQueueApi} from '../../../../api/http/lt/httpQueueApi'
  import {httpTableApi} from '../../../../api/http/lt/httpTableApi'
  import {httpShopApi} from '../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../api/http/lt/httpInfoApi'
  import {timeApi} from '../../../../api/local/timeApi'
  import {loadingApi} from '../../../../api/local/loadingApi'
  import {httpNotifyAdminApi} from '../../../../api/http/lt/httpNotifyAdminApi'
  import QRCode from 'qrcode'

  export default {
    metaInfo: {
      title: '展屏'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          title: '展屏',
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            shop: {},
            info: {},
            state: {},
            tableGroups: {},
            tableGroupNows: {},
            notifyRadio: {}
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
          radioFetchTimes: 0
        }
      }
    },
    created() {
      document.addEventListener('fullscreenchange', this.onFullScreenChange)
      document.addEventListener('mozfullscreenchange', this.onFullScreenChange)
      document.addEventListener('webkitfullscreenchange', this.onFullScreenChange)
      document.addEventListener('msfullscreenchange', this.onFullScreenChange)

      loadingApi.enable = false

      this.httpState()
      this.httpShop()
      this.httpInfo()

      this.updateTime()

      setInterval(this.updateTime, 60 * 1000)
      setInterval(this.httpState, 10 * 1000)
    },
    methods: {
      getTvUrl() {
        return document.location.protocol + '//' + window.location.host + `/b/${this.$route.params.shortId}/tv`
      },
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
        if (!this.ui.fullScreen) {
          return
        }

        this.http.res.state = {}
        this.http.res.tableGroups = {}

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
            let ticketNow = this.getGroupNow(tableGroup.id)
            if (!ticketNow) {
              table.push('--')
              table.push('--')
              continue
            }

            if (Boolean(ticketNow.nowTicketNumber)) {
              table.push(ticketNow.nowTicketNumber)
            } else {
              table.push('--')
            }

            if (this.getWaitPeople(tableGroup.id) === 0) {
              table.push('--')
            } else {
              table.push(this.getTime((new Date().getTime() - ticketNow.queueTicket.createdAt) / 1000) +
                this.getTime2((new Date().getTime() - ticketNow.queueTicket.createdAt) / 1000))
            }
          } else {
            table.push('--')
            table.push('--')
          }

          this.ui.tables.push(table)
        }

        this.refreshRadioTable()

        this.ui.showCaptcha = !this.ui.showCaptcha
        if (!this.ui.drewCaptcha) {
          this.drawCaptcha()
        }
      },
      refreshRadioTable() {
        httpNotifyAdminApi.getRadio(this.$route.params.shortId, 1).then(res => {
          if (res.notFound) {
            if (Boolean(this.http.res.notifyRadio.tableFullNumber) || Boolean(this.http.res.notifyRadio.content)) {
              if (++this.ui.radioFetchTimes === 5 * (60 / 10)) {
                this.http.res.notifyRadio.tableFullNumber = null
                this.http.res.notifyRadio.content = null
              }
            }
          } else if (res.notifyRadio) {
            this.http.res.notifyRadio = res.notifyRadio
            this.ui.radioFetchTimes = 0

            let element = document.getElementById('tv_radio_table')
            if (element !== null) {
              element.stop()
              element.start()
            }

            let radioText

            if (res.notifyRadio.tableFullNumber) {
              radioText = `请${res.notifyRadio.tableFullNumber}号顾客前往迎宾台就餐。`
            } else {
              radioText = res.notifyRadio.content
            }

            let utterThis = new window.SpeechSynthesisUtterance(radioText)
            window.speechSynthesis.speak(utterThis)
          }
        })
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
        if (window.screen.height > window.screen.width) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '无法打开展屏',
            content: '请首先确认您的显示设备比例正确，且处在横屏模式后再使用。'
          })

          return
        }

        let element = window.document.getElementById('tv_full_screen')
        screenApi.enterFullScreen(element)
        this.ui.fullScreen = true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
