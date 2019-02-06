<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box"></div>


    <div class="button_box">
      <div class="button_big" @click="renderCaptcha">渲染</div>
    </div>

    <div v-for="tableGroup in http.res.tableGroups.elements">
      <div class="blank_50"></div>

      <div class="captcha" v-for="table in tableGroup.tableOnes">
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

        <!--<div class="captcha_part_copyright">恋厅©提供技术支持</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import { httpTableApi } from '../../../../../api/http/lt/httpTableApi'
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'
  import TitleBar from '../../../../../components/common/TitleBar'
  import QRCode from 'qrcode'

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
            tableGroups: {}
          }
        },
        ui: {}
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
            QRCode.toCanvas(canvas, this.getShopTableUri(tableOne))
          }
        }
      },
      btnShopUser() {
        this.$router.push('/m/' + this.shop.shortId)
      },
      btnShopTable(table) {
        this.$router.push(`/m/${this.shop.shortId}/captcha/${table.id}`)
      },
      getShopTableUri(table) {
        return document.location.protocol + '//' + window.location.host + `/m/${this.http.res.shop.shortId}/captcha/${table.id}`
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'index';
</style>
