<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="wall">
      <div class="wall_user_info">
        <div class="wall_user_avatar_radius" @click="btnUser">
          <img class="wall_user_avatar_radius_image" :src="http.res.info.headImgUrl" :alt="http.res.info.nickName">
        </div>
        <div class="wall_user_info_title">
          <div class="wall_user_info_nick" @click="btnUser">{{http.res.info.nickName}}</div>
          <div class="wall_order_time">{{dateFormat(new Date())}}</div>
        </div>
      </div>

      <div class="wall_order">
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/c/wall/wall_order.png" alt="">
          <div class="wall_order_label" v-if="http.res.order.orderTable">{{http.res.order.orderTable.tableGroupName}} {{http.res.order.orderTable.tableFullNumber}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/c/wall/wall_food.png" alt="">
          <div class="wall_order_label">{{countFood(http.res.order)}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/c/wall/wall_people.png" alt="">
          <div class="wall_order_label">{{http.res.order.people}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/c/wall/wall_time.png" alt="">
          <div class="wall_order_label">{{http.res.order.finishedAt ? elapsedTime(http.res.order.finishedAt - http.res.order.createdAt) : '进行中'}}</div>
        </div>
      </div>

      <div class="blank_10"></div>
    </div>

    <div class="wall_text_input_area">
      <label>
        <textarea class="wall_text_input" :placeholder="ui.inputTip" v-model="http.req.wall.message"></textarea>
      </label>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnWall">留言</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import {httpWallApi} from '../../../../api/http/lt/httpWallApi'
  import {userApi} from '../../../../api/local/userApi'
  import {httpUserApi} from '../../../../api/http/user/httpUserApi'
  import {stringApi} from '../../../../api/local/stringApi'
  import {httpOrderApi} from '../../../../api/http/lt/httpOrderApi'
  import {timeApi} from '../../../../api/local/timeApi'
  import {foodDetailApi} from '../../../../api/local/foodDetail'
  import {scrollApi} from '../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '我的留言墙'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '我的留言墙',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          inputTip: '记录您都和谁一起? 为什么要到此餐厅来？菜的味道如何？ 饭桌上你们都在聊些什么？或者对酒店和厨师说的话等等。 您的留言会被其它的顾客看到。'
        },
        http: {
          req: {
            wall: {
              orderOneId: null,
              message: null,
              image0: null,
              image1: null,
              image2: null
            }
          },
          res: {
            order: {},
            info: {}
          }
        }
      }
    },
    created() {
      this.httpUserInfo()
      this.httpOrder()
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      },
      httpUserInfo() {
        httpUserApi.getInfo(userApi.getUserId()).then(res => {
          if (res.userIdNotExists) {
            return
          }

          if (!Boolean(res.info)) {
            res.info = {}
          }

          if (!Boolean(res.info.nickName)) {
            res.info.nickName = '匿名用户'
          }

          if (!Boolean(res.info.headImgUrl)) {
            res.info.headImgUrl = '/img/default/default_user_avatar.png'
          }

          this.http.res.info = res.info
        })
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.$route.query.orderOneId).then(res => {
          this.http.res.order = res

          this.ui.vCoverMask = true
          scrollApi.enable(false)

          this.ui.vOrderMenu = true
        })
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      countFood(order) {
        return foodDetailApi.countFood(order)
      },
      btnUser() {
        this.$router.push(`/c/${this.$route.params.shortId}/me/edit`)
      },
      btnWall() {
        if (!Boolean(this.http.req.wall.message)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '提交留言墙',
            content: '留言内容不能为空。'
          })

          return
        }

        this.http.req.wall.message = stringApi.trim(this.http.req.wall.message)
        this.http.req.wall.orderOneId = this.$route.query.orderOneId

        httpWallApi.putWall(this.$route.params.shortId, this.http.req.wall).then(res => {
          this.ui.loading = false

          if (res.orderOneIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '提交留言墙',
              content: '订单不存在。'
            })
          } else if (res.wallId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '提交留言墙',
              content: '留言成功。'
            }).then(async (val) => {
              this.$router.push(this.title.backUri)
            })
          }
        })
      }
    }
  }

</script>


<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/wall';
</style>
