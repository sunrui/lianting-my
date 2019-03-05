<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box" v-for="shopLicense in http.res.shopLicenseRes.elements">
      <div class="list_title box_radius_header">
        <div class="list_time_icon"></div>
        <div class="list_time_label">{{new Date(parseInt(shopLicense.createdAt)).toLocaleString()}}</div>
      </div>

      <div class="box_divide_radius">
        <div class="box_divide_radius_line"></div>
      </div>

      <div class="license_label">
        <div class="license_label_one">类型: {{
          shopLicense.licenseType === 'Free' ? '免费会员' :
          shopLicense.licenseType === 'Normal' ? '标准会员' :
          shopLicense.licenseType === 'Senior' ? '旗舰会员' : shopLicense.licenseType
          }}
        </div>
        <div class="license_label_one">价格: {{ shopLicense.price }}元/年</div>
        <div class="license_label_one">续费记录: {{new Date(parseInt(shopLicense.beforeExpiredAt)).toLocaleDateString()}} - {{new
          Date(parseInt(shopLicense.afterExpiredAt)).toLocaleDateString()}}
        </div>
        <div class="license_label_one">续费年数: {{shopLicense.year}}年</div>
        <div class="license_label_one">支付方式: {{
          shopLicense.payMethod === 'Wechat' ? '微信支付' :
          shopLicense.payMethod === 'AliPay' ? '支付宝支付' :
          shopLicense.payMethod === 'Bank' ? '银行转账' :
          shopLicense.payMethod === 'OffLine' ? '线下支付' : shopLicense.payMethod
          }}
        </div>
        <div class="license_label_one" v-if="shopLicense.paymentId">支付订单号: {{shopLicense.paymentId}}</div>
        <div class="license_label_one" v-if="shopLicense.remark">备注: {{shopLicense.remark}}</div>
        <div class="blank_10"></div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import {httpShopLicenseApi} from '../../../../../../api/http/shop/httpShopLicenseApi';
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
        ui: {}
      };
    },
    created() {
      httpShopLicenseApi.getAll(this.$route.params.shortId).then(res => {
        if (res.elements.length === 0) {
          this.$router.push(`/b/${this.$route.params.shortId}/owner/license/history/empty`);
        }

        this.http.res.shopLicenseRes = res;
      });
    }
  };
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
