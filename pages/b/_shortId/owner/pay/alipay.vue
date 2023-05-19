<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>开通支付宝支付请查阅<a class="tip_link" rel="nofollow" href="https://render.alipay.com/p/f/fd-iztoosq3/index.html">支付宝官网文档</a>，绑定恋厅请下载<a class="tip_link" href="https://lianting.store/doc/pay_alipay.docx">恋厅支付宝开通文档.docx</a></li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition">
        <div class="addition_item">
          <div class="addition_item_label">partnerId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 partnerId" maxlength="64" v-model="http.req.config.partnerId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">appAuthToken</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入 appAuthToken" maxlength="64" v-model="http.req.config.appAuthToken">
          </label>
        </div>

<!--        <div class="box_divide"></div>-->

<!--        <div class="addition_item">-->
<!--          <div class="addition_item_label">支持信用卡</div>-->
<!--          <div class="addition_item_check">-->
<!--            <div class="addition_item_check_on" v-if="http.req.config.supportCredit" @click="btnSupportCredit(false)"></div>-->
<!--            <div class="addition_item_check_off" v-else @click="btnSupportCredit(true)"></div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnUpdate">更新</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import {httpConfigAdminApi} from '../../../../../api/http/lt/httpConfigAdminApi'

  export default {
    metaInfo: {
      title: '支付宝支付'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '支付宝支付',
          backUri: `/b/${this.$route.params.shortId}/owner/pay`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              partnerId: null,
              appAuthToken: null,
              supportCredit: false
            }
          }
        }
      }
    },
    mounted() {
      this.httpConfig()
    },
    methods: {
      httpConfig() {
        httpConfigAdminApi.getPayConfigAlipay(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (!Boolean(this.http.req.config.partnerId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '请输入 partnerId。'
          })

          return
        }

        if (!Boolean(this.http.req.config.appAuthToken)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '请输入 appAuthToken。'
          })

          return
        }

        httpConfigAdminApi.putPayConfigAlipay(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '支付宝支付',
            content: '已更新。'
          }).then(async (val) => {
            this.$router.push(this.title.backUri)
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
