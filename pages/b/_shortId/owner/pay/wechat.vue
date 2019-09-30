<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>开通微信支付请查阅<a class="tip_link" rel="nofollow" href="https://kf.qq.com/kf_search.html?search_key=%E5%BE%AE%E4%BF%A1%E8%AE%A4%E8%AF%81%E9%9C%80%E8%A6%81%E6%94%AF%E4%BB%98%E7%9A%84%E8%B4%B9%E7%94%A8%EF%BC%9F&code=A2497">微信官网文档</a>，绑定恋厅下载<a class="tip_link" href="https://lt.city/doc/pay_wechat.docx">恋厅微信开通文档.docx</a>。
          <li>您的交易没有任何订单抽成，所有交易将直接与微信通讯并实时打款至您的收款账户。</li>
        </ul>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">公众号 appId</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入公众号 appId" maxlength="64" v-model="http.req.config.subAppId">
          </label>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">商户号 mch_id</div>
          <label>
            <input type="text" class="addition_item_input"
                   placeholder="请输入商户号 mch_id" maxlength="64" v-model="http.req.config.subMchId">
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
      title: '微信支付'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '微信支付',
          backUri: `/b/${this.$route.params.shortId}/owner/pay`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            config: {
              subAppId: null,
              subMchId: null,
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
        httpConfigAdminApi.getPayConfigWechat(this.$route.params.shortId).then(res => {
          this.http.req.config = res
        })
      },
      btnSupportCredit(enable) {
        this.http.req.config.supportCredit = enable
      },
      btnUpdate() {
        if (!Boolean(this.http.req.config.subAppId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '微信支付',
              content: '请输入公众号 appId。'
            })

            return
        }

        if (!Boolean(this.http.req.config.subMchId)) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '微信支付',
              content: '请输入商户号 mch_id。'
            })

            return
        }

        httpConfigAdminApi.putPayConfigWechat(this.$route.params.shortId, this.http.req.config).then(res => {
          this.$msgBox.doModal({
            type: 'yes',
            title: '微信支付',
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
