<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>餐具费：以就餐人数为单位，按人数 x 餐具费收取。</li>
        </ul>
      </div>

      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">餐具费</div>
          <currency-input class="addition_item_input" right="true" placeholder="请输入餐具费"
                          v-model="http.req.config.perTablewarePrice"></currency-input>
        </div>
      </div>
    </div>

    <div class="box" v-if="!http.req.config.orderFinishAuto">
      <div class="tip">
        <ul class="tip_ul">
          <li>饭前买单：下单时只是会引导顾客立即支付，但依旧会将未支付的餐厅订单显示到后台。如您已连接打印机，您可将打印机只同设置成仅支付时打印，这样在顾客未支付时，后厨打印机将不会打印。</li>
        </ul>
      </div>

      <div v-if="http.req.config.prepayment && !http.req.config.openWechat && !http.req.config.openAlipay">
        <div class="tip">
          <ul class="tip_ul">
            <li>开通预支付前请确保已开通至少一种微信支付或支付宝支付。</li>
          </ul>
        </div>
      </div>

      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">饭前买单</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.prepayment" @click="btnPrepayment(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnPrepayment(true)"></div>
          </div>
        </div>
      </div>

      <div class="tip">
        <ul class="tip_ul">
          <li>手动管理上菜：这是是相对比较复杂的上菜流程，如使用手动管理上菜，每一个餐食将会出现"已下单"、"开始做"、"已做好"、"已上菜"四个流程。
            顾客下单时默认为"已下单"状态，需"厨师"角色将菜进度设置成"开始做"，由此同时开始计时，当厨师将菜进度设置成"已做好"时，"服务员"这个角色将会
            同步收到一条"厨师邀请您上菜"的通知，服务员将菜设置成"已上菜"，此时整个上菜的流程即为结束。
          </li>
          <li>自动管理上菜：一般情况下您只需要一个"点餐员"角色配合使用即可，用户下单时将会同时追加到当前餐桌，您可以辅助用户，下单，换桌，退菜，结账等操作。</li>
          <li>
            注意：无论哪种模式，餐桌订单都将会以加菜的方式累积到当前餐桌中，直到用户在线支付完整订单或"点餐员"手工结算"订单，此餐桌才会结束。如您需要更简单的流程，可以使用"纯打印机模式"。
          </li>
        </ul>
      </div>

      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">自动管理上菜</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.foodFinishAuto" @click="btnFoodFinishAuto(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnFoodFinishAuto(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>订单自动完成：开启该模式后，顾客每扫码下单时，后厨打印机将会自动打印当前订单，同时当前餐桌不会累积任何订单，恋厅仅充当特别简约的扫码下单到后厨打印服务。</li>
          <li>注意：该模式将忽略任何的订单状态，所以线上的订单收益数据报告可能会和您线下的有差异，请您以线下的具体订单情况为准。
            您需要在打印机中仅开启"下单时打印"和"支付时打印"的任意一项，否则将会同步打印两份订单。
          </li>
          <li>补充：该模式推荐不使用手机管理订单的商户使用，但是您同样可以使用手机为餐桌代点餐，而无需线下记账。
          </li>
        </ul>
      </div>

      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">订单自动完成 (纯打印机模式)</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.orderFinishAuto" @click="btnOrderFinishAuto(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnOrderFinishAuto(true)"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">微信支付</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.openWechat" @click="btnOpenWechat(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnOpenWechat(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item" @click="btnPayWechat">
          <div class="addition_item_label">参数配置</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">支付宝支付</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on" v-if="http.req.config.openAlipay" @click="btnOpenAlipay(false)"></div>
            <div class="addition_item_check_off" v-else @click="btnOpenAlipay(true)"></div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item" @click="btnPayAlipay">
          <div class="addition_item_label">参数配置</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import {httpOrderAdminApi} from '../../../../../api/http/lt/httpOrderAdminApi'
  import CurrencyInput from '../../../../../components/common/CurrencyInput'
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpConfigAdminApi} from '../../../../../api/http/lt/httpConfigAdminApi'

  export default {
    metaInfo: {
      title: '结算'
    },
    middleware: 'auth',
    components: {TitleBar, CurrencyInput},
    data() {
      return {
        title: {
          canBack: true,
          title: '结算',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              perTablewarePrice: 0,
              prepayment: false,
              openWechat: false,
              openAlipay: false,
              foodFinishAuto: true,
              orderFinishAuto: false
            }
          },
          res: {
            configWechat: {},
            configAlipay: {}
          }
        }
      }
    },
    mounted() {
      this.httpConfig()
      this.httpConfigWechat()
      this.httpConfigAlipay()
    },
    methods: {
      getWechatPayUrl() {
        return 'http://kf.qq.com/faq/180910jimEvQ180910Zj6jQV.html'
      },
      httpConfig() {
        httpOrderApi.getConfig(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      httpConfigWechat() {
        httpConfigAdminApi.getPayConfigWechat(this.$route.params.shortId).then(res => {
          this.http.res.configWechat = res
        })
      },
      httpConfigAlipay() {
        httpConfigAdminApi.getPayConfigAlipay(this.$route.params.shortId).then(res => {
          this.http.res.configAlipay = res
        })
      },
      btnPrepayment(enable) {
        this.http.req.config.prepayment = enable
      },
      btnFoodFinishAuto(enable) {
        this.http.req.config.foodFinishAuto = enable
      },
      btnOrderFinishAuto(enable) {
        this.http.req.config.orderFinishAuto = enable
      },
      btnOpenWechat(enable) {
        if (enable && !Boolean(this.http.res.configWechat.subAppId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '尚未配置微信支付参数，无法启用。'
          })

          return
        }

        this.http.req.config.openWechat = enable
      },
      btnOpenAlipay(enable) {
        if (enable && !Boolean(this.http.res.configAlipay.partnerId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '尚未配置支付宝支付参数，无法启用。'
          })

          return
        }

        this.http.req.config.openAlipay = enable
        this.btnUpdate()
      },
      btnUpdate() {
        if (Boolean(this.http.req.config.prepayment) &&
            !Boolean(this.http.req.config.openWechat) &&
            !Boolean(this.http.req.config.openAlipay)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '开通预支付前请确保已开通至少一种在线支付。'
          })

          return
        }

        httpOrderAdminApi.putConfig(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      },
      btnPayWechat() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/pay/wechat`)
      },
      btnPayAlipay() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/pay/alipay`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
