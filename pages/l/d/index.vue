<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">魔法串</div>
          <label>
            <input class="addition_item_input" placeholder="请输入魔法串" minlength="1" maxlength="32"
                   v-model="http.req.downgrade.magicId">
          </label>
        </div>
        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">店铺标识</div>
          <label>
            <input class="addition_item_input" placeholder="请输入店铺标识" minlength="2" maxlength="32"
                   onkeyup="value=value.replace(/[^\w.\/]/ig,'')"
                   v-model="http.req.downgrade.shortId">
          </label>
        </div>
        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">授权类型</div>
          <div class="addition_item_tag">
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_2"
                 v-if="http.req.downgrade.licenseType === 'Lite'"
                 @click="btnChooseLicenseType('Normal')">专享会员
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1"
                 v-if="http.req.downgrade.licenseType === 'Normal'"
                 @click="btnChooseLicenseType('Senior')">普通会员
            </div>
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_3"
                 v-if="http.req.downgrade.licenseType === 'Senior'"
                 @click="btnChooseLicenseType('Lite')">旗舰会员
            </div>
          </div>
        </div>

        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">降级天数</div>
          <label>
            <input type="number" class="addition_item_input" placeholder="请输入降级天数"
                   oninput="value=value.replace(/[^0-9]/g,''); if (value === '0') value = '1'
                            if (value.length > 3) value = value.slice(0, 3)"
                   v-model="http.req.downgrade.downgradeDate">
          </label>
        </div>
        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">降级订单号</div>
          <label>
            <input class="addition_item_input" placeholder="请输入降级订单号" minlength="1" maxlength="64"
                   v-model="http.req.downgrade.downgradeId">
          </label>
        </div>
        <div class="box_divide"></div>

        <div class="addition_item">
          <div class="addition_item_label">备注</div>
          <label>
            <input class="addition_item_input" placeholder="请输入备注" minlength="0" maxlength="256"
                   v-model="http.req.downgrade.remark">
          </label>
        </div>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="httpDowngrade">授权降级</div>
    </div>
  </div>
</template>

<script>
  import {httpLicenseApi} from "../../../api/http/lt/httpLicenseApi"
  import TitleBar from "../../../components/common/TitleBar"
  import {highlightApi} from "../../../api/local/highlightApi"

  export default {
    metaInfo: {
      title: '授权降级'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          backUri: null,
          title: '授权降级',
          theme: 'image',
          imageHeight: 300
        },
        http: {
          req: {
            downgrade: {
              magicId: '',
              shortId: '',
              licenseType: 'Lite',
              downgradeDate: '',
              downgradeId: new Date().getTime(),
              remark: '授权降级'
            }
          }
        },
        ui: {
          vCoverMask: false,
          vChargeYear: false,
          licensePlan: null,
          year: 1
        }
      }
    },
    methods: {
      btnChooseLicenseType(licenseType) {
        this.http.req.downgrade.licenseType = licenseType
      },
      httpDowngrade() {
        if (!Boolean(this.http.req.downgrade.magicId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '授权降级',
            content: '请输入魔法串。'
          })
          return
        }

        if (!Boolean(this.http.req.downgrade.shortId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '授权降级',
            content: '请输入店铺标识。'
          })
          return
        }

        if (!Boolean(this.http.req.downgrade.licenseType)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '授权降级',
            content: '请输入授权类型。'
          })
          return
        }

        if (!Boolean(this.http.req.downgrade.downgradeDate)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '授权降级',
            content: '请输入升级天数。'
          })
          return
        }

        if (!Boolean(this.http.req.downgrade.downgradeId)) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '授权降级',
            content: '请输入降级订单号。'
          })
          return
        }

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '授权降级',
          content: `您确认要降级授权吗？<br><br>第三方订单号: ${highlightApi.highlight(this.http.req.downgrade.downgradeId)}`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpLicenseApi.postDowngrade(this.$route.params.shortId, this.http.req.downgrade).then(res => {
              if (res.shopIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '店铺不存在。'
                })
              } else if (res.downgradeIdExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '降级订单号已存在。'
                })
              } else if (res.licenseTypeNotMatch) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '授权类型不匹配。'
                })
              } else if (res.magicIdNotMatch) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '魔法串不正确。'
                })
              } else if (res.forbidden) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '没有权限。'
                })
              } else if (res.success) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '授权降级',
                  content: '降级成功。'
                })
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>