<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="shopLicense in http.res.shopLicense.elements">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date(parseInt(shopLicense.createdAt)))}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="license_label box_radius_footer">
        <div class="license_label_one">
          <div class="license_label_one_name">类型</div>
          <div class="license_label_one_value">{{
            shopLicense.licenseType === 'Free' ? '基础会员' :
            shopLicense.licenseType === 'Lite' ? '标准会员' :
            shopLicense.licenseType === 'Normal' ? '高级会员' :
            shopLicense.licenseType === 'Senior' ? '旗舰会员' : shopLicense.licenseType
            }}
          </div>
        </div>
        <div class="license_label_one">
          <div class="license_label_one_name">续费记录</div>
          <div class="license_label_one_value">{{new Date(parseInt(shopLicense.beforeExpiredAt)).toLocaleDateString()}} - {{new
            Date(parseInt(shopLicense.afterExpiredAt)).toLocaleDateString()}}
          </div>
        </div>
        <div v-if="shopLicense.shopLicensePay">
          <div class="box_divide"></div>

          <div class="license_label_one">
            <div class="license_label_one_name">支付订单号</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.paymentId}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费内容</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.planName}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">价格</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.pricePerYear}} 元/年</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费天数</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.year * 365}} 天</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">支付方式</div>
            <div class="license_label_one_value">{{
              shopLicense.payMethod === 'Wechat' ? '微信支付' :
              shopLicense.payMethod === 'AliPay' ? '支付宝支付' :
              shopLicense.payMethod === 'Bank' ? '银行转账' :
              shopLicense.payMethod === 'OffLine' ? '线下结算' : shopLicense.payMethod
              }}
            </div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">备注</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.remark}}</div>
          </div>
        </div>
        <div v-if="shopLicense.shopLicenseUpgrade">
          <div class="box_divide"></div>

          <div class="license_label_one">
            <div class="license_label_one_name">第三方订单号</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.marketOrderId}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费渠道</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.licenseChannel}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费用户</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.marketUserName}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费天数</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.upgradeDate}} 天</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">备注</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.remark}}</div>
          </div>
        </div>
        <div v-if="shopLicense.shopLicenseDowngrade">
          <div class="license_label_one">
            <div class="license_label_one_name">降级订单号</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseDowngrade.downgradeId}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">降级天数</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseDowngrade.downgradeDate}} 天</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">备注</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseDowngrade.remark}}</div>
          </div>
        </div>
        <div class="blank_10"></div>
      </div>
    </div>

    <div class="box" v-for="history in http.res.smsHistoryPay.elements">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{dateFormat(new Date(parseInt(history.createdAt)))}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="license_label box_radius_footer">
        <div class="license_label_one">
          <div class="license_label_one_name">支付订单号</div>
          <div class="license_label_one_value">{{history.paymentId}}</div>
        </div>
        <div class="license_label_one">
          <div class="license_label_one_name">支付金额</div>
          <div class="license_label_one_value">{{history.price}} 元</div>
        </div>
        <div class="license_label_one">
          <div class="license_label_one_name">续费短信</div>
          <div class="license_label_one_value">{{history.count}} 条</div>
        </div>

        <div class="license_label_one">
          <div class="license_label_one_name">续费前短信</div>
          <div class="license_label_one_value">{{history.fromLeftCount}} 条</div>
        </div>
        <div class="license_label_one">
          <div class="license_label_one_name">续费后短信</div>
          <div class="license_label_one_value">{{history.toLeftCount}} 条</div>
        </div>
        <div class="blank_10"></div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpLicenseApi} from '../../../../../../api/http/lt/httpLicenseApi'
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpSmsAdminApi} from '../../../../../../api/http/lt/httpSmsAdminApi'
  import {timeApi} from '../../../../../../api/local/timeApi'

  export default {
    metaInfo: {
      title: '续费记录'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '续费记录',
          backUri: `/b/${this.$route.params.shortId}/owner/license`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            shopLicense: {
              elements: []
            },
            smsHistoryPay: {
              elements: []
            }
          }
        },
        ui: {
          loading: true
        }
      }
    },
    mounted() {
      httpLicenseApi.getAll(this.$route.params.shortId).then(res => {
        this.http.res.shopLicense = res

        httpSmsAdminApi.getHistoryPay(this.$route.params.shortId).then(res => {
          this.http.res.smsHistoryPay = res
          this.ui.loading = false

          if (this.http.res.shopLicense.elements.length === 0 && res.currentPageSize === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/owner/license/history/empty`)
          }
        })
      })
    },
    methods: {
      dateFormat(date) {
        return timeApi.dateFormat(date)
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
