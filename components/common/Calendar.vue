<template>
  <div class="calendar">
    <div class="calendar_title">
      <div class="calendar_title_cancel" @click="btnCancel">
        <div class="calendar_title_cancel_label">取消</div>
      </div>
      <div class="calendar_title_date_minus" v-if="canBack" @click="btnMonthMinus">
        <div class="calendar_title_date_minus_icon"></div>
      </div>
      <div class="calendar_title_date_minus_disable" v-else></div>
      <div class="calendar_title_date">
        <div class="calendar_title_date_label">{{ui.date.year}}.{{ui.date.month}}</div>
      </div>
      <div class="calendar_title_date_add" @click="btnMonthAdd">
        <div class="calendar_title_date_add_icon"></div>
      </div>
      <div class="calendar_title_confirm" @click="btnConfirm">
        <div class="calendar_title_confirm_label">确认</div>
      </div>
    </div>
    <div class="calendar_week">
      <div class="calendar_week_one" v-for="weekday in ui.weekdays">{{weekday}}</div>
    </div>
    <div class="calendar_day">
      <div class="calendar_day_one" v-for="one in ui.days">
        <div class="calendar_day_one_label_disable" v-if="!one.enable">{{one.day}}</div>
        <div class="calendar_day_one_label" v-if="!one.select && one.enable && one.day !== ui.date.day" @click="btnChooseDay(one)">{{one.day}}</div>
        <div class="calendar_day_one_label_select" v-if="one.day === ui.date.day">{{one.day}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ui: {
          date: {
            year: 0,
            month: 0,
            day: 0
          },
          weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          days: []
        }
      }
    },
    created() {
      this.init(new Date())
    },
    computed: {
      canBack() {
        let date = new Date()

        if (this.ui.date.year < date.getFullYear()) {
          return false
        }

        if (this.ui.date.year === date.getFullYear()) {
          if (date.getMonth() + 1 < this.ui.date.month) {
            return true
          }
        }

        return false
      }
    },
    methods: {
      init(date) {
        this.ui.date.year = date.getFullYear()
        this.ui.date.month = date.getMonth() + 1
        this.ui.date.day = null

        let weekOfDay1 = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
        let daysOfMonth = new Date(this.ui.date.year, this.ui.date.month, 0).getDate()

        this.ui.days = []
        for (let i = 0; i < weekOfDay1; i++) {
          let one = {}
          one.date = ''
          one.enable = false

          this.ui.days.push(one)
        }

        for (let i = 0; i < daysOfMonth; i++) {
          let now = new Date()
          let one = {}
          one.day = i + 1
          one.enable = true

          if (this.ui.date.year <= now.getFullYear()) {
            if (this.ui.date.month <= now.getMonth() + 1) {
              if (one.day < now.getDate()) {
                one.enable = false
              } else if (one.day === now.getDate()) {
                this.ui.date.day = one.day
              }
            }
          }

          this.ui.days.push(one)
        }

        let left = 35 - this.ui.days.length
        for (let i = 0; i < left; i++) {
          let one = {}
          one.date = ''
          one.enable = false

          this.ui.days.push(one)
        }
      },
      btnMonthMinus() {
        if (this.ui.date.month === 1) {
          this.ui.date.month = 12
          this.ui.date.year -= 1
        } else {
          this.ui.date.month -= 1
        }

        this.init(new Date(this.ui.date.year, this.ui.date.month - 1, 1))
      },
      btnMonthAdd() {
        if (this.ui.date.month === 12) {
          this.ui.date.month = 1
          this.ui.date.year += 1
        } else {
          this.ui.date.month += 1
        }

        this.init(new Date(this.ui.date.year, this.ui.date.month - 1, 1))
      },
      btnChooseDay(one) {
        this.ui.date.day = one.day
      },
      btnCancel() {
        this.$emit('chooseCalendar', false, null)
      },
      btnConfirm() {
        let date = new Date(this.ui.date.year, this.ui.date.month - 1, this.ui.date.day)
        this.$emit('chooseCalendar', true, date)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'Calendar';
</style>
