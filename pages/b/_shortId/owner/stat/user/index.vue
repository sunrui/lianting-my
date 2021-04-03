<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme"
               :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="user">
        <div class="user_header"></div>
        <div class="user_body box_radius_footer">
          <div class="blank_40"></div>

          <div class="user_body_title">
            <div class="user_body_title_one">顾客</div>
            <div class="user_body_title_one">消费</div>
            <div class="user_body_title_one">笔数</div>
            <div class="user_body_title_one">最近光顾</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="http.res.statUser.elements.length > 0">
            <div v-for="statUser in http.res.statUser.elements">
              <div class="user_body_content">
                <a v-if="getPhone(statUser.userId)" class="user_body_content_one user_body_content_one_phone"
                   :href="getTelPhone(statUser)">{{ getPhone(statUser.userId) }}</a>
                <div v-else class="user_body_content_one" @click="btnUser(statUser)">
                  {{ getWechatNick(statUser.userId) }}
                </div>
                <div class="user_body_content_one user_body_content_price" @click="btnUser(statUser)">
                  {{ statUser.chargePrice }}
                </div>
                <div class="user_body_content_one" @click="btnUser(statUser)">{{ statUser.orderTimes }}</div>
                <div class="user_body_content_one" @click="btnUser(statUser)">{{ getDate(statUser.lastVisited) }}</div>
              </div>
              <div class="box_divide"
                   v-if="statUser !== http.res.statUser.elements[http.res.statUser.elements.length - 1]"></div>
            </div>
            <div class="blank_10"></div>
          </div>
          <div class="user_empty" v-else>没有顾客记录。</div>
        </div>
      </div>
    </div>

    <div class="blank_25"></div>
  </div>
</template>

<script>
import TitleBar from '../../../../../../components/common/TitleBar'
import {httpStatAdminApi} from '../../../../../../api/http/lt/httpStatAdminApi'
import {timeApi} from '../../../../../../api/local/timeApi'
import {httpShopApi} from '../../../../../../api/http/shop/httpShopApi'
import {httpUserApi} from '../../../../../../api/http/user/httpUserApi'
import {loadingApi} from "../../../../../../api/local/loadingApi";

export default {
  metaInfo: {
    title: '顾客统计'
  },
  middleware: 'auth',
  components: {TitleBar},
  data() {
    return {
      title: {
        canBack: true,
        title: '顾客统计',
        backUri: `/b/${this.$route.params.shortId}/owner/stat`,
        theme: 'image',
        imageHeight: 300
      },
      http: {
        res: {
          statUser: {
            elements: []
          }
        }
      },
      ui: {
        infos: [],
        infoLoads: [],
        limit: {
          licenseType: true,
          licenseExpiredAt: true,
        }
      }
    }
  },
  mounted() {
    this.httpShop()
    this.httpShopLicenseExpiredAt()
    this.httpStatUser()
  },
  destroyed() {
    loadingApi.enable = true
  },
  methods: {
    getDate(date) {
      return timeApi.dateFormat(new Date(parseInt(date)), 'yyyy/MM/dd')
    },
    httpShop() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.ui.limit.licenseType = (res.licenseType !== 'Lite' && res.licenseType !== 'Normal' && res.licenseType !== 'Senior')
      })
    },
    httpShopLicenseExpiredAt() {
      httpShopApi.getLicenseExpiredAt(this.$route.params.shortId).then(res => {
        this.ui.limit.licenseExpiredAt = res.licenseExpiredAt < new Date().getTime()
      })
    },
    httpStatUser() {
      loadingApi.enable = false
      httpStatAdminApi.getUser(this.$route.params.shortId, 0, 200).then(res => {
        this.http.res.statUser = res
      })
    },
    getWechatNick(userId) {
      for (let index in this.ui.infos) {
        let one = this.ui.infos[index]

        if (!one.userInfo) {
          one.userInfo = {}
        }

        if (one.userId === userId) {
          let date = new Date(one.user.createdAt)
          let createdDate = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
          return one.userInfo.nickName ? one.userInfo.nickName : createdDate
        }
      }

      for (let index in this.ui.infoLoads) {
        let _userId = this.ui.infoLoads[index]

        if (_userId === userId) {
          return
        }
      }

      this.ui.infoLoads.push(userId)
      this.httpGetInfo(userId)
      return '加载中'
    },
    getPhone(userId) {
      for (let index in this.ui.infos) {
        let one = this.ui.infos[index]

        if (!one.user) {
          one.user = {}
        }

        if (one.userId === userId) {
          return one.user.phone ? one.user.phone : ''
        }
      }

      for (let index in this.ui.infoLoads) {
        let _userId = this.ui.infoLoads[index]

        if (_userId === userId) {
          return
        }
      }

      this.ui.infoLoads.push(userId)
      this.httpGetInfo(userId)

      return ''
    },
    getTelPhone(statUser) {
      let phone = this.getPhone(statUser.userId)
      if (Boolean(phone)) {
        return 'tel:' + phone
      } else {
        return ''
      }
    },
    httpGetInfo(userId) {
      httpUserApi.getInfo(userId).then(res => {
        if (!Boolean(res.info)) {
          res.info = {}
        }

        if (!Boolean(res.info.nickName)) {
          res.info.nickName = res.info.id
        }

        if (!Boolean(res.info.headImgUrl)) {
          res.info.headImgUrl = '/img/default/default_user_avatar.png'
        }

        this.ui.infos.push({
          userId: userId,
          user: res.user,
          userInfo: res.info
        })
      })
    },
    btnUser(statUser) {
      // if (this.ui.limit.licenseType || this.ui.limit.licenseExpiredAt) {
      //   this.$router.push(`/b/${this.$route.params.shortId}/owner/limit`)
      //   return
      // }

      this.$router.push({
        path: `/b/${this.$route.params.shortId}/owner/order`,
        query: {
          userId: statUser.userId
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/common';
@import "index";
</style>
