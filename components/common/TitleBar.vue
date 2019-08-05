<template>
  <div>
    <div v-if="ui.vTitleBar">
      <div class="title_bar image_white" v-if="ui.theme === 'white'">
        <div class="title_bar_back" v-if="canBack" @click="btnBack">
          <div class="title_bar_back title_bar_back_black"></div>
        </div>
        <div class="title_bar_title title_bar_title_black">{{title}}</div>
        <div class="image_white"></div>
      </div>
      <div class="title_bar" v-else>
        <div class="title_bar_back" v-if="canBack" @click="btnBack">
          <div class="title_bar_back"></div>
        </div>
        <div class="title_bar_title">{{title}}</div>
      </div>
    </div>

    <div v-if="ui.theme !== 'white' && imageHeight > 0">
      <div class="image_box" v-bind:class="{
      image_height_220: imageHeight === 220,
      image_height_300: imageHeight === 300,
      image_height_330: imageHeight === 330,
      image_height_460: imageHeight === 460
      }" :style="{'backgroundImage':'url('+ui.image+getXOssProcess()+')'}" v-if="ui.vTitleBar">
      </div>
      <div class="image_box" v-bind:class="{
      image_height_220_no_title_bar: imageHeight === 220,
      image_height_300_no_title_bar: imageHeight === 300,
      image_height_330_no_title_bar: imageHeight === 330,
      image_height_460_no_title_bar: imageHeight === 460
    }" :style="{'backgroundImage':'url('+ui.image+getXOssProcess()+')'}" v-else>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpInfoApi} from '../../api/http/lt/httpInfoApi'
  import {wechatApi} from '../../api/local/wechatApi'
  import {imageApi} from '../../api/local/imageApi'

  export default {
    props: {
      canBack: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '恋厅'
      },
      theme: {
        type: String,
        default: 'image'
      },
      backUri: {
        type: String,
        default: null
      },
      image: {
        type: String,
        default: '/img/common/title_bar_bg.png'
      },
      imageHeight: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        http: {
          res: {
            info: {}
          }
        },
        ui: {
          image: this.image,
          theme: this.theme,
          vTitleBar: true
        }
      }
    },
    mounted() {
      window.history.pushState('forward', null, null)
      window.history.forward()
      window.addEventListener('popstate', this.popStateHandle)

      this.httpInfo()
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.popStateHandle)
    },
    methods: {
      getXOssProcess() {
        return imageApi.getXOssProcess()
      },
      httpInfo() {
        if (this.imageHeight === 0 || !Boolean(this.$route.params.shortId)) {
          this.setImage('/img/common/title_bar_bg.png')
          return
        }

        httpInfoApi.get(this.$route.params.shortId).then(res => {
          if (Boolean(res.image)) {
            this.setImage(res.image)
          } else {
            this.setImage('/img/common/title_bar_bg.png')
          }
        })
      },
      setAppleTitle() {
        document.title = this.title

        if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
          let i = document.createElement('iframe')
          i.src = '/favicon.ico'
          i.type = 'image/x-icon'
          i.style.display = 'none'
          i.onload = function () {
            setTimeout(function () {
              i.remove()
            }, 10)
          }
          document.body.appendChild(i)
        }
      },
      setTheme(theme) {
        this.ui.theme = theme
      },
      setImage(image) {
        if (Boolean(image)) {
          this.ui.image = image
        }
      },
      statePush() {
        window.history.pushState('forward', null, null)
        window.history.forward()
      },
      popStateHandle(e) {
        this.setAppleTitle()
        this.statePush()
        this.btnBack()
      },
      btnBack() {
        if (this.canBack && Boolean(this.backUri)) {
          this.$router.push(this.backUri)
        } else {
          wechatApi.closeWindow()
          window.history.back()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'TitleBar';
</style>
