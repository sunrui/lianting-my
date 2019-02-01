<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">预订时间</div>
          <div class="addition_item_content">{{getWeekDesc(http.req.reserve.date)}}
            {{http.req.reserve.date.getMonth() + 1}}-{{http.req.reserve.date.getDate()}}
            {{http.req.reserve.date.getHours() >= 10 ? http.req.reserve.date.getHours() :
            '0' + http.req.reserve.date.getHours() }}:{{http.req.reserve.date.getMinutes() >= 10 ?
            http.req.reserve.date.getMinutes() : '0' + http.req.reserve.date.getMinutes()}}
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">餐桌类型</div>
          <div class="addition_item_content">{{http.req.reserve.tableGroupName}}</div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">人数</div>
          <div class="addition_item_number">
            <div class="addition_item_number_minus" @click="btnPeopleMinus"></div>
            <div class="addition_item_number_label">{{http.req.reserve.people}}</div>
            <div class="addition_item_number_add" @click="btnPeopleAdd"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">联系人</div>
          <input class="addition_item_input" placeholder="请输入您的姓名" maxlength="20" v-model="http.req.reserve.name">
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">性别</div>
          <div class="addition_item_radio">
            <div style="display: inline-block" @click="btnChooseSex(true)">
              <div v-bind:class="{
                addition_item_radio_icon_select: http.req.reserve.male,
                addition_item_radio_icon_unselect: !http.req.reserve.male
                }"></div>
              <div class="addition_item_radio_label">男</div>
            </div>
            <div style="display: inline-block" @click="btnChooseSex(false)">
              <div v-bind:class="{
                addition_item_radio_icon_select: !http.req.reserve.male,
                addition_item_radio_icon_unselect: http.req.reserve.male
                }"></div>
              <div class="addition_item_radio_label">女</div>
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">手机号</div>
          <div class="addition_item_content" v-show="http.req.reserve.phone">{{http.req.reserve.phone}}</div>
          <div class="addition_item_link" v-show="!http.req.reserve.phone" @click="btnBindPhone">未绑定</div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label_text_area">备注</div>
          <div class="addition_item_text_area">
            <textarea class="addition_item_text_input" placeholder="请输入您的备注要求，我们会尽量安排。" maxlength="256" v-model="http.req.reserve.remark"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnReserve">立即预订</div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../components/TitleBar'
  import {timeApi} from '../../../../api/local/timeApi'
  import {stateApi} from '../../../../api/local/stateApi'
  import {httpReserveApi} from '../../../../api/http/ltorder/httpReserveApi'

  export default {
    metaInfo: {
      title: '提交预订'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '提交预订',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        http: {
          req: {
            reserve: {
              tableGroupName: '',
              date: new Date(),
              people: 1,
              name: '',
              male: true,
              remark: ''
            }
          }
        }
      }
    },
    created() {
      if (!Boolean(this.$route.query.date) || !Boolean(this.$route.query.tableGroupName)) {
        this.$router.push(`/m/${this.$route.params.shortId}/reserve`)
        return
      }

      this.http.req.reserve.date = new Date(parseInt(this.$route.query.date))
      this.http.req.reserve.tableGroupName = this.$route.query.tableGroupName

      let phone = stateApi.user.getPhone()
      if (Boolean(phone)) {
        this.http.req.reserve.phone = phone
      }
    },
    methods: {
      getWeekDesc(date) {
        return timeApi.getWeekDesc2(date)
      },
      btnChooseSex(male) {
        this.http.req.reserve.male = male
      },
      btnBindPhone() {
        this.$router.push(`/m/${this.$route.params.shortId}/me/bind/phone`)
      },
      btnPeopleAdd() {
        if (this.http.req.reserve.people >= 99) {
          return
        }

        this.http.req.reserve.people++
      },
      btnPeopleMinus() {
        if (this.http.req.reserve.people <= 1) {
          return
        }

        this.http.req.reserve.people--
      },
      btnReserve() {
        if (!Boolean(this.http.req.reserve.name)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '立即预订',
            content: '请输入您的姓名。'
          })

          return
        }

        httpReserveApi.post(this.$route.params.shortId, this.http.req.reserve).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即预订',
              content: '已超过当前授权最大数目限制。'
            })
          } else if (res.reserveExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即预订',
              content: '预订已存在。'
            })
          } else if (res.dayExpired) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即预订',
              content: '预订时间已过期。'
            })
          } else if (res.reserveClosed) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即预订',
              content: '尚未开通预订。'
            })
          } else if (res.reserveId) {
            this.$router.push(`/m/${this.$route.params.shortId}/reserve/${res.reserveId}`)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import 'create';
</style>
