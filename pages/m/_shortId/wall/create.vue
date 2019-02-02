<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="wall">
      <div class="wall_user_info">
        <div class="wall_user_avatar_radius" @click="btnUser">
          <img class="wall_user_avatar_radius_image" :src="http.res.wechatInfo.headImgUrl">
        </div>
        <div class="wall_user_info_title">
          <div class="wall_user_info_nick" @click="btnUser">{{http.res.wechatInfo.nickName}}</div>
          <div class="wall_order_time">{{new Date().toLocaleString()}}</div>
        </div>
      </div>

      <div class="wall_order">
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_order.png">
          <div class="wall_order_label" v-if="http.res.order.orderTable">{{http.res.order.orderTable.tableGroupName}} {{http.res.order.orderTable.tableFullNumber}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_food.png">
          <div class="wall_order_label">{{countFood(http.res.order)}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_people.png">
          <div class="wall_order_label">{{http.res.order.people}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_time.png">
          <div class="wall_order_label">{{elapsedTime(http.res.order)}}</div>
        </div>
      </div>
    </div>

    <!--<div class="wall_picture">-->
    <!--<div class="wall_picture_add">添加图片</div>-->
    <!--<div class="wall_picture_box">-->
    <!--<div class="wall_picture_one">-->
    <!--<div class="wall_picture_one_image"></div>-->
    <!--<div class="wall_picture_one_label">添加</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <div class="wall_text_input_area">
      <textarea class="wall_text_input" :placeholder="ui.input_tip" v-model="http.req.wall.message"></textarea>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnWall">留言</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import { httpWallApi } from '../../../../api/http/ltorder/httpWallApi'
  import { stateApi } from '../../../../api/local/stateApi'
  import { httpUserApi } from '../../../../api/http/user/httpUserApi'
  import { stringApi } from '../../../../api/local/stringApi'
  import { httpOrderApi } from '../../../../api/http/ltorder/httpOrderApi'
  import { timeApi } from '../../../../api/local/timeApi'
  import { foodDetailApi } from '../../../../api/local/foodDetail'

  export default {
    metaInfo: {
      title: '提交留言墙'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '提交留言墙',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          input_tip: '记录您都和谁一起? 为什么要到此餐厅来？菜的味道如何？ 饭桌上你们都在聊些什么？或者对酒店和厨师说的话等等。 您的留言会被其它的顾客看到。'
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
            wechatInfo: {}
          }
        }
      }
    },
    created() {
      if (!Boolean(this.$route.query.orderOneId)) {
        this.$msgBox.doModal({
          type: 'yes',
          title: '提交留言墙',
          content: '订单号不能为空。'
        }).then(async (val) => {
          this.$router.back()
        })
      }

      this.http.req.wall.orderOneId = this.$route.query.orderOneId

      this.httpUserInfo()
      this.httpOrder()
    },
    methods: {
      httpUserInfo() {
        httpUserApi.getInfo(stateApi.user.getId()).then(res => {
          if (res.userIdNotExists) {
            return
          }

          if (!Boolean(res.wechatInfo)) {
            res.wechatInfo = {}
            res.wechatInfo.headImgUrl = '/img/food/food.png'
            res.wechatInfo.nickName = '匿名用户'
          }

          this.http.res.wechatInfo = res.wechatInfo
        })
      },
      httpOrder() {
        httpOrderApi.getOrder(this.$route.params.shortId, this.http.req.wall.orderOneId).then(res => {
          this.http.res.order = res

          this.ui.v_order_menu = true
          this.ui.v_cover_mask = true
        })
      },
      elapsedTime(order) {
        let time = order.payPaidAt ? order.payPaidAt : order.createdAt
        return timeApi.elapsedTime(time / 1000)
      },
      countFood(order) {
        return foodDetailApi.countFood(order)
      },
      btnUser() {
        this.$router.push(`/m/${this.$route.params.shortId}/me/edit`)
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
              this.$router.back()
            })
          }
        })
      }
    }
  }

</script>


<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/wall';
</style>
