<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="box">
      <div class="list_title box_radius_header">
        <div class="shop_name">{{http.res.shop.name}} ({{http.res.shop.shortId}})</div>

        <div class="shop_license">
          <div class="shop_title_license">
            <div class="shop_title_license_king"></div>
            <div class="shop_title_license_label">
              {{
              http.res.shop.licenseType === 'Free' ? '基础会员' :
              http.res.shop.licenseType === 'Lite' ? '标准会员' :
              http.res.shop.licenseType === 'Normal' ? '高级会员' :
              http.res.shop.licenseType === 'Senior' ? '旗舰会员' : http.res.shop.licenseType
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="shop_detail box_radius_footer">
        <div class="shop_detail_one">
          <div class="shop_detail_left">店铺类型：{{
            http.res.shop.licenseType === 'Free' ? '基础会员' :
            http.res.shop.licenseType === 'Lite' ? '标准会员' :
            http.res.shop.licenseType === 'Normal' ? '高级会员' :
            http.res.shop.licenseType === 'Senior' ? '旗舰会员' : http.res.shop.licenseType
            }}
          </div>
          <div class="shop_detail_expired_at">{{getExpiredContent()}}</div>
        </div>
        <div class="shop_detail_one">
          <div class="shop_detail_left">剩余短信数：{{this.http.res.smsShop.leftCount}}</div>
          <div class="shop_detail_sms" @click="btnSmsCharge">充值</div>
          <div class="shop_license_history" @click="btnChargeHistory">续费记录</div>
        </div>

        <div class="blank_10"></div>
      </div>
    </div>

    <div class="blank_50"></div>

    <div class="shop_license_one" v-for="license in http.res.shopLicensePlans.elements">
      <div class="shop_license_plan box_radius">
        <div class="blank_30"></div>

        <div class="shop_license_type">
          <img class="shop_license_icon" :src="
          license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free.png' :
          license.plan.licenseType === 'Lite' ? '/img/b/license/b_license_normal.png' :
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior.png' : '/img/b/license/b_license_free.png'
          " alt="">
          <div class="shop_license_label" v-bind:class="{
          shop_license_label_free: license.plan.licenseType === 'Free',
          shop_license_label_normal: license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal',
          shop_license_label_senior: license.plan.licenseType === 'Senior'
          }">{{license.plan.name}}
          </div>
        </div>

        <div class="blank_20"></div>
        <div class="shop_license_price" v-bind:class="{
          shop_license_label_free: license.plan.licenseType === 'Free',
          shop_license_label_normal: license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal',
          shop_license_label_senior: license.plan.licenseType === 'Senior',
          shop_license_price_free: license.plan.licenseType === 'Free',
          }">{{'￥' + license.plan.pricePerYear + '/永久使用'}}
        </div>

        <div class="blank_10"></div>

        <div class="box_divide"></div>

        <div class="shop_feature">
          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">在线支付渠道<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">无限订单<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">无限订单无任何抽成<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">不收服务器、带宽等费用<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">50 条外卖配送短信<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">超出短信 0.1 元/条<span class="shop_feature_one_label_star">{{ license.plan.licenseType === 'Free' ? '免费使用' : '专享'}}</span></div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxFoods}} 个上架餐食</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxTables}} 个餐桌</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxQueue}} 个排队用户</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxReserve}} 个预订人数/天</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxWaiter}} 个服务员</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxCooker}} 个厨师</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxCashier}} 个收银</div>
          </div>

          <div class="box_divide"></div>

          <div class="shop_feature_one">
            <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          (license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal') ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
            <div class="shop_feature_one_label">{{license.limit.maxAdmin}} 个店长</div>
          </div>

          <div v-if="license.plan.licenseType === 'Normal' || license.plan.licenseType === 'Senior'">
            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">{{license.limit.maxCoupon}} 个营销活动<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">餐食热门搜索<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">迎宾台播报展屏<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">订单收益财报<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">专属云计算服务器集群<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">交易账单永久存储<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
            license.plan.licenseType === 'Free' ? '/img/b/license/b_license_free_check.png' :
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">店铺数据多重备份<span class="shop_feature_one_label_star addition_item_tag_color_1">专享</span></div>
            </div>

            <div class="box_divide"></div>

            <div class="shop_feature_one">
              <img class="shop_feature_one_icon" :src="
          license.plan.licenseType === 'Normal' ? '/img/b/license/b_license_normal_check.png' :
          license.plan.licenseType === 'Senior' ? '/img/b/license/b_license_senior_check.png' : '/img/b/license/b_license_free_check.png'
          " alt="">
              <div class="shop_feature_one_label">专业技术人员贴心服务<span class="shop_feature_one_label_star">专享</span></div>
            </div>
          </div>
        </div>

        <div class="blank_30"></div>

        <div class="shop_license_button" v-bind:class="{
          shop_license_button_free: license.plan.licenseType === 'Free',
          shop_license_button_normal: license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal',
          shop_license_button_senior: license.plan.licenseType === 'Senior'
          }" v-if="license.plan.licenseType === 'Free'">免费使用
        </div>
        <div class="shop_license_button" v-bind:class="{
          shop_license_button_free: license.plan.licenseType === 'Free',
          shop_license_button_normal: license.plan.licenseType === 'Lite' || license.plan.licenseType === 'Normal',
          shop_license_button_senior: license.plan.licenseType === 'Senior'
          }" v-else @click="btnYearSelect(license.plan)">立即续费
        </div>
      </div>

      <div class="blank_50"></div>
    </div>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vSmsPrice">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">选择套餐</div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.smsPrice === 100}"
             @click="btnChooseSmsPrice(100)">100 元
        </div>
        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.smsPrice === 200}"
             @click="btnChooseSmsPrice(200)">200 元
        </div>
        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.smsPrice === 500}"
             @click="btnChooseSmsPrice(500)">500 元
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnSmsChargeConfirm">立即充值</div>
        </div>
      </div>
    </transition>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vChargeYear">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">选择套餐</div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.year === 1}"
             @click="btnChooseYear(1)">续费 1 年 (永久授权)
          <div class="charge_year_tip">限时特惠</div>
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.year === 2}"
             @click="btnChooseYear(2)">续费 2 年
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.year === 3}"
             @click="btnChooseYear(3)">续费 3 年
        </div>

        <div class="modal_menu" v-bind:class="{modal_menu_select: ui.year === 5}"
             @click="btnChooseYear(5)">续费 5 年
        </div>

        <div class="modal_button_box">
          <div class="button_big" @click="btnChargeConfirm">立即续费</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import {httpLicenseApi} from '../../../../../api/http/lt/httpLicenseApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {scrollApi} from '../../../../../api/local/scrollApi'
  import {userApi} from '../../../../../api/local/userApi'
  import {wechatApi} from '../../../../../api/local/wechatApi'
  import {httpSmsAdminApi} from '../../../../../api/http/lt/httpSmsAdminApi'

  export default {
    metaInfo: {
      title: '续费'
    },
    middleware: ['auth'],
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '续费',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            shop: {},
            shopLicensePlans: {},
            smsShop: {},
            licenseExpiredAt: new Date().getTime()
          }
        },
        ui: {
          vCoverMask: false,
          vChargeYear: false,
          vSmsPrice: false,
          licensePlan: null,
          year: 1,
          smsPrice: 100
        }
      }
    },
    created() {
      this.httpShop()
      this.httpShopLicenseExpiredAt()
      this.httpLicensePlan()
      this.httpTakeOutSmsShop()
    },
    methods: {
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpShopLicenseExpiredAt() {
        httpShopApi.getLicenseExpiredAt(this.$route.params.shortId).then(res => {
          this.http.res.licenseExpiredAt = res
        })
      },
      httpLicensePlan() {
        httpLicenseApi.getPlanAll(this.http.res.shop.type, 0, 99).then(res => {
          this.http.res.shopLicensePlans = res

          this.http.res.shopLicensePlans.elements.sort(function (a, b) {
            let r = a.plan.pricePerYear - b.plan.pricePerYear
            if (r !== 0) {
              return r
            } else {
              return a.plan.licenseType === 'Free' ? -1 : 1
            }
          })
        })
      },
      httpTakeOutSmsShop() {
        httpSmsAdminApi.getSms(this.$route.params.shortId).then(res => {
          this.http.res.smsShop = res
        })
      },
      btnCoverMask() {
        this.ui.vCoverMask = false
        this.ui.vChargeYear = false
        this.ui.vSmsPrice = false

        scrollApi.enable(true)
      },
      btnChargeHistory() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/license/history`)
      },
      btnYearSelect(licensePlan) {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vChargeYear = true
        this.ui.licensePlan = licensePlan
      },
      btnChooseYear(year) {
        this.ui.year = year
      },
      prepareWechatPay(jsPay) {
        let pThis = this

        function onBridgeReady() {
          WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                'appId': jsPay.appId,     //公众号名称，由商户传入
                'timeStamp': jsPay.timeStamp,         //时间戳，自1970年以来的秒数
                'nonceStr': jsPay.nonceStr, //随机串
                'package': jsPay.package,
                'signType': jsPay.signType,   //微信签名方式：
                'paySign': jsPay.paySign //微信签名
              },
              function (res) {
                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '续费成功',
                    content: '续费已成功，支付结果可能存在延迟，请稍候刷新等待服务器返回。'
                  }).then(async (val) => {
                    pThis.httpShop()
                    pThis.httpLicensePlan()
                    pThis.httpTakeOutSmsShop()
                  })
                } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
                  pThis.httpShop()
                  pThis.httpLicensePlan()
                  pThis.httpTakeOutSmsShop()
                } else if (res.err_msg) {
                  pThis.$msgBox.doModal({
                    type: 'yes',
                    title: '续费错误',
                    content: res.err_msg
                  }).then(async (val) => {
                    pThis.httpShop()
                    pThis.httpLicensePlan()
                    pThis.httpTakeOutSmsShop()
                  })
                }
              }
          )
        }

        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        } else {
          onBridgeReady()
        }
      },
      getExpiredContent() {
        // if (this.http.res.shop.licenseType === 'Free') {
        return '服务于：' + new Date(parseInt(this.http.res.shop.createdAt)).toLocaleDateString()
        // } else {
        //   return '过期时间：' + new Date(parseInt(this.http.res.licenseExpiredAt)).toLocaleDateString()
        // }
      },
      btnChargeConfirm() {
        scrollApi.enable(true)

        let wechatOpenId = userApi.getUserWechatOpenId()
        if (!Boolean(wechatOpenId) || !wechatApi.inWechat()) {
          this.ui.vCoverMask = false
          this.ui.vChargeYear = false
          scrollApi.enable(true)

          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '请在微信中使用。'
          })

          return
        }

        httpLicenseApi.postOrder(this.$route.params.shortId, this.ui.licensePlan.id, this.ui.year, 'WECHAT_JSAPI').then(res => {
          this.ui.vCoverMask = false
          this.ui.vChargeYear = false
          scrollApi.enable(true)

          if (res.shortIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即续费',
              content: '店铺不存在。'
            })

            return
          }

          if (res.shopLicensePlanIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即续费',
              content: '续费授权不存在。'
            })

            return
          }

          if (res.licenseTypeNotMatch) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即续费',
              content: '续费类型不区配，如您需升级套餐请联系我们。'
            })

            return
          }

          if (res.pay) {
            if (res.pay.wechat) {
              this.prepareWechatPay(res.pay.wechat.jsPay)
            }

            if (res.pay.wechatOpenIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '请先获得微信授权。'
              })
              return
            }

            if (res.pay.payConfigWechatNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '商家尚未设置微信支付参数。'
              })
              return
            }

            if (res.pay.payWayNotSupport) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '暂未支持此支付方式。'
              })
            }
          }
        })
      },
      btnChooseSmsPrice(smsPrice) {
        this.ui.smsPrice = smsPrice
      },
      btnSmsCharge() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.ui.vSmsPrice = true
        this.ui.smsPrice = 100
      },
      btnSmsChargeConfirm() {
        scrollApi.enable(true)

        let wechatOpenId = userApi.getUserWechatOpenId()
        if (!Boolean(wechatOpenId) || !wechatApi.inWechat()) {
          this.ui.vCoverMask = false
          this.ui.vSmsPrice = false
          scrollApi.enable(true)

          this.$msgBox.doModal({
            type: 'yes',
            title: '立即支付',
            content: '请在微信中使用。'
          })

          return
        }

        httpSmsAdminApi.postPay(this.$route.params.shortId, this.ui.smsPrice, 'WECHAT_JSAPI').then(res => {
          this.ui.vCoverMask = false
          this.ui.vSmsPrice = false
          scrollApi.enable(true)

          if (res.shortIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '立即续费',
              content: '店铺不存在。'
            })

            return
          }

          if (res.pay) {
            if (res.pay.wechat) {
              this.prepareWechatPay(res.pay.wechat.jsPay)
            }

            if (res.pay.wechatOpenIdNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '请先获得微信授权。'
              })
              return
            }

            if (res.pay.payConfigWechatNotExists) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '商家尚未设置微信支付参数。'
              })
              return
            }

            if (res.pay.payWayNotSupport) {
              this.$msgBox.doModal({
                type: 'yes',
                title: '立即续费',
                content: '暂未支持此支付方式。'
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/b/b_shop';
  @import 'index';
</style>
