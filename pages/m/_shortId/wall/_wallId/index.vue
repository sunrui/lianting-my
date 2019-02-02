<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div v-bind:class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="wall">
      <div class="wall_user_info">
        <div class="wall_user_avatar_radius" @click="btnUser()">
          <img class="wall_user_avatar_radius_image" :src="http.res.wechatInfo.headImgUrl">
        </div>
        <div class="wall_user_info_title">
          <div class="wall_user_info_nick" @click="btnUser()">{{http.res.wechatInfo.nickName}}</div>
          <div class="wall_order_time">{{new Date(parseInt(http.res.wall.createdAt)).toLocaleString()}}</div>
        </div>
      </div>

      <div class="wall_order">
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_order.png">
          <div class="wall_order_label">{{http.res.wall.tableGroupName}} {{http.res.wall.tableFullNumber}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_food.png">
          <div class="wall_order_label">{{http.res.wall.countFood}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_people.png">
          <div class="wall_order_label">{{http.res.wall.people}}</div>
        </div>
        <div class="wall_order_one">
          <img class="wall_order_icon" src="/img/m/wall/wall_time.png">
          <div class="wall_order_label">{{elapsedTime(http.res.wall.elapsedTime)}}</div>
        </div>
      </div>

      <div class="wall_message">
        <div class="wall_message_paper">{{http.res.wall.message}}</div>
      </div>

      <div class="wall_message_reply_more">
        <div class="wall_message_one">
          <img class="wall_message_icon" src="/img/m/wall/wall_message.png">
          <div class="wall_message_label">{{http.res.wall.countReply}}</div>
        </div>
        <!--<div class="wall_message_one">-->
        <!--<img class="wall_message_icon" src="/img/m/wall/wall_like.png">-->
        <!--<div class="wall_message_label">20</div>-->
        <!--</div>-->

        <div class="wall_message_order_menu" @click="btnOrder(http.res.wall)">
          <div class="wall_message_order_menu_icon"></div>
          <div class="wall_message_order_menu_label">查看菜谱</div>
        </div>

        <div class="blank_10"></div>

        <div class="box_divide"></div>

        <div class="wall">
          <div class="wall_reply_empty" v-if="!http.res.replies.elements || http.res.replies.elements.length === 0">暂无留言，快来留下您的评论吧〜</div>
          <div class="wall_user_info" v-else v-for="reply in http.res.replies.elements">
            <div class="wall_user_avatar_radius" @click="btnUser(reply.userId)">
              <img class="wall_user_avatar_radius_image" :src="getWechatHead(reply.userId)">
            </div>
            <div class="wall_user_info_title">
              <div class="wall_user_info_nick" @click="btnUser(reply.userId)">{{getWechatNick(reply.userId)}}</div>
              <div class="wall_order_time">{{new Date(parseInt(http.res.wall.createdAt)).toLocaleString()}}</div>
            </div>
            <div class="wall_user_reply_content">{{reply.message}}</div>
          </div>

          <div class="blank_30"></div>
        </div>
      </div>
    </div>

    <div class="box" v-if="ui.v_order_menu">
      <div class="modal_center box_radius">
        <div class="modal_header">
          <div class="modal_title">查看菜谱</div>

          <div class="modal_close_box" @click="btnCoverMask">
            <img class="modal_close" src="/img/common/close.png">
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

    <div class="blank_30"></div>

    <div class="wall_reply_footer">
      <div class="wall_reply_content">
        <input class="wall_reply_input" placeholder="快来留下您的评论吧~" v-model="ui.replyContent">
      </div>

      <div class="wall_reply_button" @click="btnReply">发送</div>
    </div>
  </div>
</template>

<script>
  import {httpWallApi} from '../../../../../api/http/ltorder/httpWallApi'
  import {timeApi} from '../../../../../api/local/timeApi'
  import {httpUserApi} from '../../../../../api/http/user/httpUserApi'
  import {stateApi} from '../../../../../api/local/stateApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpOrderApi} from '../../../../../api/http/ltorder/httpOrderApi'
  import {foodDetailApi} from '../../../../../api/local/foodDetail'
  import {stringApi} from '../../../../../api/local/stringApi'
  import {scrollApi} from '../../../../../api/local/scrollApi'

  export default {
    metaInfo: {
      title: '留言详情'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '留言详情',
          theme: 'white',
          imageHeight: 0
        },
        http: {
          res: {
            wall: {},
            replies: {},
            wechatInfo: {}
          }
        },
        ui: {
          v_cover_mask: false,
          v_order_menu: false,
          replyContent: '',
          wechatInfos: [],
          wechatInfoLoads: [],
          wallReplyies: []
        }
      }
    },
    created() {
      this.httpUserInfo()
      this.httpWall()
    },
    methods: {
      httpUserInfo() {
        httpUserApi.getInfo(stateApi.user.getId()).then(res => {
          if (res.userIdNotExists) {
            return
          }

          if (!res.wechatInfo) {
            res.wechatInfo = {}
          }

          this.http.res.wechatInfo = res.wechatInfo

          if (!Boolean(res.wechatInfo.nickName)) {
            this.http.res.wechatInfo.nickName = '匿名用户'
          }
        })
      },
      getWechatHead(userId) {
        for (let index in this.ui.wechatInfos) {
          let one = this.ui.wechatInfos[index]

          if (!one.wechatInfo) {
            one.wechatInfo = {}
          }

          if (one.userId === userId) {
            return one.wechatInfo.headImgUrl
          }
        }

        for (let index in this.ui.wechatInfoLoads) {
          let _userId = this.ui.wechatInfoLoads[index]

          if (_userId === userId) {
            return
          }
        }

        this.ui.wechatInfoLoads.push(userId)

        httpUserApi.getInfo(userId).then(res => {
          this.ui.wechatInfos.push({
            userId: userId,
            wechatInfo: res.wechatInfo
          })
        })

        return ''
      },
      getWechatNick(userId) {
        for (let index in this.ui.wechatInfos) {
          let one = this.ui.wechatInfos[index]

          if (one.userId === userId) {
            return one.wechatInfo.nickName ? one.wechatInfo.nickName : '匿名用户'
          }
        }

        for (let index in this.ui.wechatInfoLoads) {
          let _userId = this.ui.wechatInfoLoads[index]

          if (_userId === userId) {
            return
          }
        }

        this.ui.wechatInfoLoads.push(userId)

        httpUserApi.getInfo(userId).then(res => {
          this.ui.wechatInfos.push({
            userId: userId,
            wechatInfo: res.wechatInfo
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
      btnCoverMask() {
        this.ui.v_order_menu = false
        this.ui.v_cover_mask = false

        scrollApi.enable(true)
      },
      countFood(order) {
        return foodDetailApi.countFood(order)
      },
      httpWall() {
        httpWallApi.getOne(this.$route.params.shortId, this.$route.params.wallId).then(res => {
          this.http.res.wall = res
          this.httpReply()
        })
      },
      httpReply() {
        httpWallApi.getReplyAll(this.$route.params.shortId, this.$route.params.wallId, 0, 20).then(res => {
          this.http.res.replies = res
        })
      },
      btnUser(userId) {
        // if (!Boolean(userId) || userId === stateApi.user.getId()) {
        //   this.$router.push(`/m/${this.$route.params.shortId}/me/edit`)
        // } else {
        this.$router.push(`/m/${this.$route.params.shortId}/user/${userId}`)
        // }
      },
      btnOrder(wall) {
        httpOrderApi.getOrder(this.$route.params.shortId, wall.orderOneId).then(res => {
          this.http.res.order = res

          this.ui.v_order_menu = true
          this.ui.v_cover_mask = true

          scrollApi.enable(false)
        })
      },
      btnReply() {
        this.ui.replyContent = stringApi.trim(this.ui.replyContent)

        if (!Boolean(this.ui.replyContent)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '留言',
            content: '内容不能为空。'
          })

          return
        }

        httpWallApi.postReply(this.$route.params.shortId, this.$route.params.wallId, this.ui.replyContent).then(res => {
          if (res.wallIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '留言',
              content: '留言墙不存在。'
            })
            return
          }

          if (res.wallReplyId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '留言',
              content: '留言成功。'
            }).then(async (val) => {
              this.ui.replyContent = ''
            })
          }

          this.httpReply()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/m/wall';
  @import 'index';
</style>
