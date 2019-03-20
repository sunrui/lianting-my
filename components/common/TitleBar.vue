<template>
  <div>
    <div v-if="!ui.inWechat">
      <div class="title_bar image_white" v-if="theme === 'white'">
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

    <div v-if="theme !== 'white' && imageHeight > 0">
      <div class="image_box" v-bind:class="{
      image_height_220: imageHeight === 220,
      image_height_300: imageHeight === 300,
      image_height_330: imageHeight === 330,
      image_height_460: imageHeight === 460,
      image_height_900: imageHeight === 900
      }" v-if="!ui.inWechat">
        <img class="image" :src="ui.image" alt="">
      </div>
      <div class="image_box" v-bind:class="{
      image_height_220_no_title_bar: imageHeight === 220,
      image_height_300_no_title_bar: imageHeight === 300,
      image_height_330_no_title_bar: imageHeight === 330,
      image_height_460_no_title_bar: imageHeight === 460,
      image_height_900_no_title_bar: imageHeight === 900
    }" v-else>
        <img class="image" :src="ui.image" alt="">
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
          backUri: this.backUri,
          inWechat: false
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

      let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
      this.ui.inWechat = userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
    },
    beforeDestroy() {
      window.removeEventListener('popstate', this.popStateHandle)
    },
    methods: {
      httpInfo() {
        if (this.imageHeight === 0 || !Boolean(this.$route.params.shortId)) {
          return
        }

        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.setImage(res.image)
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
      setImage(image) {
        if (Boolean(image)) {
          this.ui.image = image
        }
      },
      popStateHandle(e) {
        window.history.pushState('forward', null, null)
        window.history.forward()

        this.btnBack()
        this.setTitle()
      },
      setBackUri(backUri) {
        this.ui.backUri = backUri
      },
      btnBack() {
        if (this.canBack && Boolean(this.ui.backUri)) {
          this.$router.push(this.ui.backUri)
        } else {
          if (typeof WeixinJSBridge != 'undefined') {
            WeixinJSBridge.call('closeWindow')
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
