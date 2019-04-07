<template>
  <div v-show="!ui.loading">
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="shopLicense in http.res.shopLicenseRes.elements">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{new Date(parseInt(shopLicense.createdAt)).toLocaleString()}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="license_label box_radius_footer">
        <div class="license_label_one">
          <div class="license_label_one_name">类型</div>
          <div class="license_label_one_value">{{
            shopLicense.licenseType === 'Free' ? '免费会员' :
            shopLicense.licenseType === 'Lite' ? '专享会员' :
            shopLicense.licenseType === 'Normal' ? '标准会员' :
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
        <div class="box_divide"></div>
        <div v-if="shopLicense.shopLicensePay">
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
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.pricePerYear}}元/年</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费天数</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.year * 365}}天</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">支付方式</div>
            <div class="license_label_one_value">{{
              shopLicense.payMethod === 'Wechat' ? '微信支付' :
              shopLicense.payMethod === 'AliPay' ? '支付宝支付' :
              shopLicense.payMethod === 'Bank' ? '银行转账' :
              shopLicense.payMethod === 'OffLine' ? '线下支付' : shopLicense.payMethod
              }}
            </div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">备注</div>
            <div class="license_label_one_value">{{shopLicense.shopLicensePay.remark}}</div>
          </div>
        </div>
        <div v-if="shopLicense.shopLicenseUpgrade">
          <div class="license_label_one">
            <div class="license_label_one_name">第三方订单号</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.marketOrderId}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费渠道</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.licenseChannel === 'Taobao' ? '淘宝' : shopLicense.shopLicensePay.licenseChannel}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费用户</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.marketUserName}}</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">续费天数</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseUpgrade.upgradeDate}}天</div>
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
            <div class="license_label_one_value">{{shopLicense.shopLicenseDowngrade.downgradeDate}}天</div>
          </div>
          <div class="license_label_one">
            <div class="license_label_one_name">备注</div>
            <div class="license_label_one_value">{{shopLicense.shopLicenseDowngrade.remark}}</div>
          </div>
        </div>
        <div class="blank_10"></div>
      </div>
    </div>
    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpLicenseApi} from '../../../../../../api/http/lt/httpLicenseApi';
  import TitleBar from '../../../../../../components/common/TitleBar';

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
            shopLicenseRes: {
              elements: []
            }
          }
        },
        ui: {
          loading: true
        }
      };
    },
    created() {
      httpLicenseApi.getAll(this.$route.params.shortId).then(res => {
        if (res.elements.length === 0) {
          this.$router.push(`/b/${this.$route.params.shortId}/owner/license/history/empty`);
        }

        this.http.res.shopLicenseRes = res;
        this.ui.loading = false
      });
    }
  };
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
