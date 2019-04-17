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
      image_height_460: imageHeight === 460,
      image_height_900: imageHeight === 900
      }" :style="{'backgroundImage':'url('+ui.image+')'}" v-if="ui.vTitleBar">
      </div>
      <div class="image_box" v-bind:class="{
      image_height_220_no_title_bar: imageHeight === 220,
      image_height_300_no_title_bar: imageHeight === 300,
      image_height_330_no_title_bar: imageHeight === 330,
      image_height_460_no_title_bar: imageHeight === 460,
      image_height_900_no_title_bar: imageHeight === 900
    }" :style="{'backgroundImage':'url('+ui.image+')'}" v-else>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpInfoApi} from '../../api/http/lt/httpInfoApi'

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
        default: null
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
          backUri: this.backUri,
          vTitleBar: true
        }
      }
    },
    created() {
      this.httpInfo()
    },
    mounted() {
      window.addEventListener('popstate', this.popStateHandle)
      window.history.pushState('forward', null, null)
      window.history.forward()
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.popStateHandle)
    },
    methods: {
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
      setTitle() {
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
      setBackUri(backUri) {
        this.ui.backUri = backUri
      },
      setTheme(theme) {
        this.ui.theme = theme
      },
      setImage(image) {
        if (Boolean(image)) {
          this.ui.image = image
        }
      },
      popStateHandle(e) {
        window.history.pushState('forward', null, null)
        window.history.forward()

        this.setTitle()
        this.btnBack()
      },
      btnBack() {
        if (this.canBack && Boolean(this.ui.backUri)) {
          this.$router.push(this.ui.backUri)
        } else {
          if (WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.call('closeWindow');
          } else {
            setTimeout(function () {
              if (WeixinJSBridge !== 'undefined') {
                WeixinJSBridge.call('closeWindow');
              }
            }, 500)
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'TitleBar';
</style>
