<template>
  <div v-if="ui.showTip">
    <div class="empty">
      <img class="empty_image" src="/img/no/no_coupon.png" alt="">
      <div class="empty_label">请选择<span class="empty_label_tip_link">在浏览器中打开</span>后使用支付宝。</div>
      <div class="empty_label_tip">微信内使用支付宝解决方案</div>
    </div>

    <div class="weixin-tip">
      <div class="weixin-tip-content">请在这儿选择</div>
    </div>
  </div>
</template>

<script>
  import {wechatApi} from '../../api/local/wechatApi'

  export default {
    data() {
      return {
        ui: {
          alipayForm: null,
          showTip: false,
        }
      }
    },
    created() {
      this.ui.alipayForm = this.$route.query.alipayForm
    },
    mounted() {
      if (!wechatApi.inWechat()) {
        if (this.ui.alipayForm) {
          const div = document.createElement('div')
          div.innerHTML = decodeURIComponent(this.alipayForm)
          document.body.appendChild(div)
          document.forms[0].submit()
        } else {
          this.ui.showTip = true
        }
      } else {
        this.ui.showTip = true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';

  .weixin-tip {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    top: 15px;
    right: 15px;
    width: 265px;
    padding: 90px 0 0;
    text-align: left;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAACICAMAAABQgAwUAAAAMFBMVEUAAADY2NjY2NjY2NjY2NjY2NjY2NjY2NjX19fY2NjY2NjY2NjY2NjY2NjY2NjY2Njr/TvvAAAAD3RSTlMAxy89c9CdTRyG7lvcD7FzqbJAAAACFklEQVR42uWYy4rkMBAErZdlPdzx/3+7LAw0tH0Y2orDsnnyKQlSVaWytoc6xrEpigFoinUAIBnWABAE5woW9o6GPbGwI1jYGSzsgoV9goU9wMLe0bA7FnYCC7uBhV2wsE+wsAdY2AENGyzsBBZ2Q8MuWNgH94pLbgELO6Bhg4VdwcJuaNgTCzuChZ3Bwg5o2GBhV7CwdzTsjoUdwcLOYGEXLOwTLOwBFvaOht2xsBNY2I1f6lhaenvhrfpkAblab+k9b/OD0iuX2F9/x8D+7ZL2pmpbuj+6o3Vg//oWmPU9p65VkXL6+oIJ8S738nwj62Pb1lvHACH+fBs7sG59U3yrVD3rce3GVcp8qGkPAGTprQUYy6xfaE8i82b6S7/pfZnzdYQIHeOXdfYKpHoFcmrvWlM8RW+CDO8JMWoNM/+FeyB4UfMpL48g5qG1Iqc29YI3mqq2knXvEJu2onJoQy9ok4mkQZf/GjqitUvQyqN6SU8NOvOhHq25xNCWj6LFQdLiyKuaZWpxBC2OrFVHxdryElbQsVtBx6KN0qAd4a71yo610uxa2b0s5xg052I5p26d4MCqusZFwzrAnqQhSogSMnkNcr+GUS3kEKWS62NJFlNCToWLZpWMe14RReGqdjz2PfNECbkGbrQ/Nj5q5y7j8/HRTW5UhvHfA7Mdzitji8rfWsgX3gVZ91eO22odKed6LLf9A/sRnc74RV7lAAAAAElFTkSuQmCC) no-repeat right top;
    background-size: 45px 68px;
    margin-right: 20px;

    .weixin-tip-content {
      text-align: right;
      font-size: 28px;
      color: #666666;
    }
  }
</style>