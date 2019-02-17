<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <li>"扫码点餐桌贴"需您自行购买后贴至餐桌一角或摆设至餐位上。</li>
        <li>您可使用淘宝或京东等搜索“扫码点餐桌贴"来获取您想要的风格。</li>
        <li>每桌大概费用在 5-20 元不等，更多风格可联系卖家定制。</li>
        <li>以下样式仅供您参考。</li>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" v-if="!ui.v_render" @click="btnRender">在线生成</div>
      <div class="button_big" v-else @click="btnDownloadAll">全部下载</div>
    </div>

    <div v-if="ui.v_render">
      <div class="blank_30"></div>
      <div class="box_divide"></div>
      <div class="blank_50"></div>
    </div>

    <div v-if="ui.v_render" v-for="tableGroup in http.res.tableGroups.elements">
      <div v-for="table in tableGroup.tableOnes">
        <div class="title">
          <div class="title_table">{{tableGroup.name}} - {{table.tableGroup_Name}}{{table.fullNumber}}</div>
          <div class="title_download" @click="btnDownload(table)">下载</div>
        </div>

        <div class="captcha" :id="'capture_' + table.id">
          <div class="captcha_part_cover"></div>
          <div class="captcha_part_label"></div>
          <div class="captcha_part_panel"></div>
          <div class="captcha_part_desk">桌号: {{table.tableGroup_Name}}{{table.fullNumber}}</div>
          <div class="captcha_part_title">
            <div class="captcha_part_title_left"></div>
            <div class="captcha_part_title_label">{{http.res.shop.name}}</div>
            <div class="captcha_part_title_right"></div>
          </div>

          <canvas :id="table.id" class="captcha_part_image"></canvas>

          <div class="captcha_part_copyright" v-if="ui.v_copyright">恋厅©提供技术支持</div>
        </div>
      </div>
    </div>

    <div v-if="ui.v_render" class="addition">
      <div class="addition_item">
        <div class="addition_item_label">显示恋厅标识</div>
        <div class="addition_item_check">
          <div class="addition_item_check_on" v-if="ui.v_copyright" @click="btnCopyright(false)"></div>
          <div class="addition_item_check_off" v-else @click="btnCopyright(true)"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { httpTableApi } from '../../../../../api/http/lt/httpTableApi'
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import QRCode from 'qrcode'
  import html2canvas from 'html2canvas'
  import { downloadApi } from '../../../../../api/local/downloadApi'

  export default {
    metaInfo: {
      title: '二维码'
    },
    middleware: 'auth',
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: true,
          title: '二维码',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 0
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
          v_render: false,
          v_copyright: true
        }
      }
    },
    created() {
      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.http.res.shop = res

        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          this.http.res.tableGroups = res
        })
      })
    },
    methods: {
      renderCaptcha() {
        for (let tableGroupIndex in this.http.res.tableGroups.elements) {
          let tableGroup = this.http.res.tableGroups.elements[tableGroupIndex]

          for (let tableIndex in tableGroup.tableOnes) {
            let tableOne = tableGroup.tableOnes[tableIndex]

            let canvas = document.getElementById(tableOne.id)
            if (canvas) {
              let uri = document.location.protocol + '//' + window.location.host + `/m/${this.http.res.shop.shortId}/captcha/${tableOne.id}`
              QRCode.toCanvas(canvas, uri)
            }
          }
        }
      },
      btnRender() {
        if (this.http.res.tableGroups.elements.length === 0) {
          this.$msgBox.doModal({
            type: 'yes',
            title: '二维码',
            content: '暂无餐桌，如需生成请先添加餐桌。'
          })

          return
        }

        this.ui.v_render = true

        setTimeout(this.renderCaptcha, 0)
      },
      btnCopyright(enable) {
        this.ui.v_copyright = enable
      },
      btnDownload(table) {
        let id = 'capture_' + table.id

        html2canvas(document.getElementById(id)).then(canvas => {
          let fileName = table.tableGroup_name + '_' + table.fullNumber
          downloadApi.download(canvas, fileName)
        })
      },
      btnDownloadAll() {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '下载二维码',
          content: '如受手机所限无法下载时，请在浏览器打开后尝试。您确定要全部下载吗? '
        }).then(async (val) => {
          if (val !== 'Yes') {
            return
          }

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
