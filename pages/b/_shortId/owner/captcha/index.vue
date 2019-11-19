<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <ul class="tip_ul">
          <li>在顾客扫码点餐前，需您自行购买摆放至顾客餐桌或贴至餐桌一角。</li>
          <li>您可淘宝或京东等搜索<span class="tip_highlight">亚克力二维码</span>或<span class="tip_highlight">扫码点餐桌贴</span>来获取您想要的风格定制。</li>
          <li>生成预览可能会显示错位，以下生成样式仅供您参考。</li>
        </ul>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-if="ui.vRenderType !== 'text'" @click="btnRender('text')">餐桌文本生成</div>
      <div class="button_big" v-if="ui.vRenderType !== 'captcha'" @click="btnRender('captcha')">餐桌贴生成</div>
    </div>

    <div class="captcha_text_box" v-if="ui.vRenderType === 'text'">
      <div class="captcha_title">请复制文本发给制作二维码的店铺</div>
      <div class="blank_20"></div>
      <label>
        <textarea class="captcha_text" v-model="ui.tableText" onclick="this.select()"></textarea>
      </label>
    </div>

    <div class="captcha" v-if="ui.vRenderType === 'captcha'">
      <div class="title">
        <div class="title_table">店铺二维码 (适用于外卖宣传需求)</div>
<!--        <div class="title_download" @click="btnDownloadShop()">下载</div>-->
      </div>

      <div class="captcha_one" :id="'shop_' + http.res.shop.id">
        <div class="captcha_part_cover"></div>
        <div class="captcha_part_label"></div>
        <div class="captcha_part_panel"></div>
        <div class="captcha_part_desk"></div>
        <div class="captcha_part_title">
          <div class="captcha_part_title_left"></div>
          <div class="captcha_part_title_label">{{http.res.shop.name}}</div>
          <div class="captcha_part_title_right"></div>
        </div>

        <canvas :id="http.res.shop.id" class="captcha_part_image"></canvas>

        <div class="captcha_part_copyright" v-if="ui.vCopyright">恋厅©提供技术支持</div>
      </div>
    </div>

    <div class="captcha" v-if="ui.vRenderType === 'captcha'" v-for="tableGroup in http.res.tableGroups.elements">
      <div v-for="table in tableGroup.tableOnes">
        <div class="title">
          <div class="title_table">{{tableGroup.name}} - {{table.tableGroup_Name}}{{table.fullNumber}}</div>
<!--          <div class="title_download" @click="btnDownload(table)">下载</div>-->
        </div>

        <div class="captcha_one" :id="'table_' + table.id">
          <div class="captcha_part_cover"></div>
          <div class="captcha_part_label"></div>
          <div class="captcha_part_panel"></div>
          <div class="captcha_part_desk">桌号 {{table.tableGroup_Name}}{{table.fullNumber}}</div>
          <div class="captcha_part_title">
            <div class="captcha_part_title_left"></div>
            <div class="captcha_part_title_label">{{http.res.shop.name}}</div>
            <div class="captcha_part_title_right"></div>
          </div>

          <canvas :id="table.id" class="captcha_part_image"></canvas>

          <div class="captcha_part_copyright" v-if="ui.vCopyright">恋厅©提供技术支持</div>
        </div>
      </div>
    </div>

    <div v-if="ui.vRenderType === 'captcha'" class="addition">
      <div class="addition_item">
        <div class="addition_item_label">显示恋厅品牌</div>
        <div class="addition_item_check">
          <div class="addition_item_check_on" v-if="ui.vCopyright" @click="btnCopyright(false)"></div>
          <div class="addition_item_check_off" v-else @click="btnCopyright(true)"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import QRCode from 'qrcode'
  import {downloadApi} from '../../../../../api/local/downloadApi'
  import {wechatApi} from '../../../../../api/local/wechatApi'
  import {highlightApi} from '../../../../../api/local/highlightApi'

  export default {
    metaInfo: {
      title: '二维码'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '二维码',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            shop: {},
            tableGroups: {
              elements: []
            }
          }
        },
        ui: {
          vRenderType: '',
          vCopyright: false,
          tableText: ''
        }
      }
    },
    mounted() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.res.shop = res

        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          res.elements.sort(function (a, b) {
            if (a.orderIndex !== b.orderIndex) {
              return a.orderIndex - b.orderIndex
            }

            return a.createdAt - b.createdAt
          })

          this.http.res.tableGroups = res

          if (this.$route.query.vCopyright) {
            this.ui.vCopyright = this.$route.query.vCopyright !== 'false'
            this.btnRender('captcha')
          }
        })
      })
    },
    methods: {
      renderTableText() {
        let divide = '------------------------------------------\n'

        this.ui.tableText = ''
        this.ui.tableText += divide
        this.ui.tableText += '店铺二维码 (适用于宣传店铺主页，集点餐、排队、预订等需求)'
        this.ui.tableText += '\n\n'
        this.ui.tableText += `${this.http.res.shop.name}`
        this.ui.tableText += '\n'
        this.ui.tableText += document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}`
        this.ui.tableText += '\n\n'

        this.ui.tableText += ''
        this.ui.tableText += divide
        this.ui.tableText += '点餐二维码 (适用于外卖宣传需求)'
        this.ui.tableText += '\n\n'
        this.ui.tableText += `${this.http.res.shop.name}`
        this.ui.tableText += '\n'
        this.ui.tableText += document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/food`
        this.ui.tableText += '\n\n'

        this.ui.tableText += ''
        this.ui.tableText += divide
        this.ui.tableText += '排队二维码 (适用于排队宣传需求)'
        this.ui.tableText += '\n\n'
        this.ui.tableText += `${this.http.res.shop.name}`
        this.ui.tableText += '\n'
        this.ui.tableText += document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/queue`
        this.ui.tableText += '\n\n'

        this.ui.tableText += ''
        this.ui.tableText += divide
        this.ui.tableText += '预订二维码 (适用于预订宣传需求)'
        this.ui.tableText += '\n\n'
        this.ui.tableText += `${this.http.res.shop.name}`
        this.ui.tableText += '\n'
        this.ui.tableText += document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/reserve`
        this.ui.tableText += '\n\n'

        this.ui.tableText += ''
        this.ui.tableText += divide
        this.ui.tableText += '餐桌二维码 (适用于餐桌堂食扫码点餐)'
        this.ui.tableText += '\n\n'

        for (let tableGroupIndex in this.http.res.tableGroups.elements) {
          let tableGroup = this.http.res.tableGroups.elements[tableGroupIndex]

          for (let tableIndex in tableGroup.tableOnes) {
            let tableOne = tableGroup.tableOnes[tableIndex]

            this.ui.tableText += `${this.http.res.shop.name}, ${tableOne.tableGroup_name}, ${tableOne.fullNumber}`
            this.ui.tableText += '\n'
            this.ui.tableText += document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/captcha/${tableOne.id}`
            this.ui.tableText += '\n\n'
          }
        }
      },
      renderCaptcha() {
        let canvasShop = document.getElementById(this.http.res.shop.id)
        if (canvasShop) {
          let uri = document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/food`
          QRCode.toCanvas(canvasShop, uri)
        }


        // if (process.browser) {
        //   let html2canvas = require('html2canvas')
        //   let shopId = document.getElementById('shop_' + this.http.res.shop.id)
        //
        //   html2canvas(shopId, {
        //     logging: false
        //   }).then(canvas => {
        //     let canvasIdText = 'shop_' + this.http.res.shop.id + '_canvas'
        //     canvas.setAttribute('id', canvasIdText)
        //     shopId.parentNode.appendChild(canvas)
        //     shopId.parentNode.removeChild(shopId)
        //   })
        // }

        for (let tableGroupIndex in this.http.res.tableGroups.elements) {
          let tableGroup = this.http.res.tableGroups.elements[tableGroupIndex]

          for (let tableIndex in tableGroup.tableOnes) {
            let tableOne = tableGroup.tableOnes[tableIndex]

            let canvasTable = document.getElementById(tableOne.id)
            if (canvasTable) {
              let uri = document.location.protocol + '//' + window.location.host + `/c/${this.http.res.shop.shortId}/captcha/${tableOne.id}`
              QRCode.toCanvas(canvasTable, uri)
            }

            // if (process.browser) {
            //   let html2canvas = require('html2canvas')
            //   let tableId = document.getElementById('table_' + tableOne.id)
            //
            //   html2canvas(tableId, {
            //     logging: false
            //   }).then(canvas => {
            //     let canvasIdText = 'table_' + tableOne.id + '_canvas'
            //
            //     canvas.setAttribute('id', canvasIdText)
            //     tableId.parentNode.appendChild(canvas)
            //     tableId.parentNode.removeChild(tableId)
            //   })
            // }
          }
        }
      },
      btnRender(type) {
        this.ui.vRenderType = type

        if (this.ui.vRenderType === 'text') {
          this.renderTableText()
        } else if (this.ui.vRenderType === 'captcha') {
          setTimeout(this.renderCaptcha, 1)
        }
      },
      btnCopyright(enable) {
        window.location.href = `/b/${this.$route.params.shortId}/owner/captcha?vCopyright=${enable}`
      },
      btnDownloadShop() {
        if (wechatApi.inWechat()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '微信限制',
            content: `请在右上角选择${highlightApi.highlight('在浏览器打开')}后再下载。`
          })

          return
        }

        let fileName = '恋厅_' + this.http.res.shop.name
        let shopId = document.getElementById('shop_' + this.http.res.shop.id + '_canvas')
        downloadApi.download(shopId, fileName)
      },
      btnDownload(table) {
        if (wechatApi.inWechat()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '微信限制',
            content: `请在右上角选择${highlightApi.highlight('在浏览器打开')}后再下载。`
          })

          return
        }

        let fileName = '恋厅_餐桌二维码_' + table.tableGroup_name + '_' + table.fullNumber
        let tableId = document.getElementById('table_' + table.id + '_canvas')
        downloadApi.download(tableId, fileName)
      },
      btnDownloadAll() {
        if (wechatApi.inWechat()) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '微信限制',
            content: `请在右上角选择${highlightApi.highlight('在浏览器打开')}后下载。`
          })

          return
        }

        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '下载二维码',
          content: '您确定要全部下载吗? '
        }).then(async (val) => {
          if (val !== 'Yes') {
            return
          }

          this.btnDownloadShop()

          for (let tableGroupIndex in this.http.res.tableGroups.elements) {
            let tableGroup = this.http.res.tableGroups.elements[tableGroupIndex]

            for (let tableIndex in tableGroup.tableOnes) {
              let tableOne = tableGroup.tableOnes[tableIndex]
              this.btnDownload(tableOne)
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
