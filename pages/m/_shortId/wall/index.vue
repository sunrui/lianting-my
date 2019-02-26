<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div v-bind:class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div v-for="wall in http.res.walls.elements">
      <div class="box">
        <div class="wall box_radius_header">
          <div class="wall_user_info">
            <div class="wall_user_avatar_radius" @click="btnUser(wall.userId)">
              <img class="wall_user_avatar_radius_image" :src="getWechatHead(wall.userId)" alt="">
            </div>
            <div class="wall_user_info_title">
              <div class="wall_user_info_nick" @click="btnUser(wall.userId)">{{getWechatNick(wall.userId)}}</div>
              <div class="wall_order_time">{{new Date(parseInt(wall.createdAt)).toLocaleString()}}</div>
            </div>
            <div class="wall_order_menu" @click="btnOrder(wall)">
              <div class="wall_order_menu_icon"></div>
              <div class="wall_order_menu_label">查看菜谱</div>
            </div>
          </div>

          <!--<div class="wall_picture">-->
          <!--<div class="wall_picture_box">-->
          <!--<div class="wall_picture_one">-->
          <!--<div class="wall_picture_one_image"></div>-->
          <!--<div class="wall_picture_one_label">添加</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->

          <div class="wall_order" @click="btnWallOne(wall)">
            <div class="wall_order_one">
              <img class="wall_order_icon" src="/img/m/wall/wall_order.png" alt="">
              <div class="wall_order_label">{{wall.tableGroupName}} {{wall.tableFullNumber}}</div>
            </div>
            <div class="wall_order_one">
              <img class="wall_order_icon" src="/img/m/wall/wall_food.png" alt="">
              <div class="wall_order_label">{{wall.countFood}}</div>
            </div>
            <div class="wall_order_one">
              <img class="wall_order_icon" src="/img/m/wall/wall_people.png" alt="">
              <div class="wall_order_label">{{wall.people}}</div>
            </div>
            <div class="wall_order_one">
              <img class="wall_order_icon" src="/img/m/wall/wall_time.png" alt="">
              <div class="wall_order_label">{{wall.elapsedTime === 0 ? '进行中' : elapsedTime(wall.elapsedTime)}}</div>
            </div>
          </div>
        </div>

        <div class="box_divide_radius" @click="btnWallOne(wall)">
          <div class="box_divide_radius_line"></div>
        </div>

        <div class="wall_message box_radius_footer">
          <div class="wall_message_paper" @click="btnWallOne(wall)">{{wall.message}}</div>
          <div class="wall_message_extra">
            <div class="wall_message_one" @click="btnWallOne(wall)">
              <img class="wall_message_icon" src="/img/m/wall/wall_message.png" alt="">
              <div class="wall_message_label">{{wall.countReply}}</div>
            </div>
            <!--<div class="wall_message_one">-->
            <!--<img class="wall_message_icon" src="/img/m/wall/wall_like.png" alt="">-->
            <!--<div class="wall_message_label">20</div>-->
            <!--</div>-->
          </div>

          <div class="wall_reply" v-if="getWallReplies(wall.id).length > 0" @click="btnWallOne(wall)">
            <div class="wall_reply_one" v-for="reply in getWallReplies(wall.id)">
              <div class="wall_reply_nick" @click="btnUser(reply.userId)">{{getWechatNick(reply.userId)}}</div>
              <span class="wall_reply_content">{{reply.message}}</span>
            </div>
          </div>
        </div>

        <div class="box" v-if="ui.v_order_menu">
          <div class="modal_center box_radius">
            <div class="modal_header">
              <div class="modal_title">查看菜谱</div>

              <div class="modal_close_box" @click="btnCoverMask">
                <img class="modal_close" src="/img/common/close.png" alt="">
              </div>
            </div>

            <div class="box_divide"></div>

            <div class="menu_food_list">
              <div class="menu_food" v-for="orderFood in http.res.order.orderFoods">
                <div class="menu_food_category">{{orderFood.foodCategoryName}}</div>
                <div class="menu_food_name">({{orderFood.foodName}})</div>
                <div class="menu_food_count">{{orderFood.count}}</div>
              </div>
            </div>

            <div class="box_divide"></div>

            <div class="menu_food_footer">
              <div class="menu_food_total">({{countFood(http.res.order)}})</div>
              <div class="menu_food_price">{{http.res.order.price}}</div>
            </div>

            <div class="blank_20"></div>
          </div>
        </div>
      </div>

      <div class="blank_30"></div>
    </div>
  </div>
</template>

<script>
  import { httpWallApi } from '../../../../api/http/lt/httpWallApi'
  import { timeApi } from '../../../../api/local/timeApi'
  import { httpOrderApi } from '../../../../api/http/lt/httpOrderApi'
  import { foodDetailApi } from '../../../../api/local/foodDetail'
  import TitleBar from '../../../../components/common/TitleBar'
  import { httpUserApi } from '../../../../api/http/user/httpUserApi'
  import { stateApi } from '../../../../api/local/stateApi'
  import { scrollApi } from '../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '留言墙'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '留言墙',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'image',
          imageHeight: 330
        },
        ui: {
          v_cover_mask: false,
          v_order_menu: false,
          infos: [],
          infoLoads: [],
          wallReplyies: [],
          title: ''
        },
        http: {
          res: {
            walls: {},
            order: {}
          }
        }
      }
    },
    created() {
      if (Boolean(this.$route.query.my)) {
        this.title.title = '我的留言墙'
      } else {
        this.title.title = '留言墙'
      }

      this.httpWall()
    },
    methods: {
      httpWall() {
        if (Boolean(this.$route.query.my)) {
          httpWallApi.getMyAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/wall/empty`)
              return
            }

            this.http.res.walls = res
          })
        } else {
          httpWallApi.getAll(this.$route.params.shortId, 0, 20).then(res => {
            if (res.elements.length === 0) {
              this.$router.push(`/m/${this.$route.params.shortId}/wall/empty`)
              return
            }

            this.http.res.walls = res
          })
        }
      },
      getWechatHead(userId) {
        for (let index in this.ui.infos) {
          let one = this.ui.infos[index]

          if (!one.info) {
            one.info = {}
          }

          if (one.userId === userId) {
            return one.info.headImgUrl
          }
        }

        for (let index in this.ui.infoLoads) {
          let _userId = this.ui.infoLoads[index]

          if (_userId === userId) {
            return
          }
        }

        this.ui.infoLoads.push(userId)

        httpUserApi.getInfo(userId).then(res => {
          this.ui.infos.push({
            userId: userId,
            info: res.info
          })
        })

        return ''
      },
      getWechatNick(userId) {
        for (let index in this.ui.infos) {
          let one = this.ui.infos[index]

          if (!one.info) {
            one.info = {}
          }

          if (one.userId === userId) {
            return one.info.nickName ? one.info.nickName : '匿名用户'
          }
        }

        for (let index in this.ui.infoLoads) {
          let _userId = this.ui.infoLoads[index]

          if (_userId === userId) {
            return
          }
        }

        this.ui.infoLoads.push(userId)

        httpUserApi.getInfo(userId).then(res => {
          this.ui.infos.push({
            userId: userId,
            info: res.info
          })
        })

        return ''
      },
      getWallReplies(wallId) {
        for (let index in this.ui.wallReplyies) {
          let one = this.ui.wallReplyies[index]

          if (one.wallId === wallId) {
            return one.wallReplyies
          }
        }

        httpWallApi.getReplyAll(this.$route.params.shortId, wallId, 0, 20).then(res => {
          this.ui.wallReplyies.push({
            wallId: wallId,
            wallReplyies: res.elements
          })
        })

        return []
      },
      elapsedTime(time) {
        return timeApi.elapsedTime(time)
      },
      countFood(order) {
        return foodDetailApi.countFood(order)
      },
      btnCoverMask() {
        this.ui.v_order_menu = false
        this.ui.v_cover_mask = false

        scrollApi.enable(true)
      },
      btnWallOne(wall) {
        this.$router.push(`/m/${this.$route.params.shortId}/wall/${wall.id}`)
      },
      btnOrder(wall) {
        httpOrderApi.getOrder(this.$route.params.shortId, wall.orderOneId).then(res => {
          this.http.res.order = res

          this.ui.v_order_menu = true
          this.ui.v_cover_mask = true

          scrollApi.enable(false)
        })
      },
      btnUser(userId) {
        if (userId === stateApi.user.getId()) {
          this.$router.push(`/m/${this.$route.params.shortId}/me/edit`)
        } else {
          this.$router.push(`/m/${this.$route.params.shortId}/user/${userId}`)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/wall';
  @import 'index';
</style>
