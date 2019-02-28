<template>
  <div>
    <div v-if="!ui.inWechat">
      <div class="title_bar title_bar_bg_white" v-if="theme === 'white'">
        <div class="title_bar_back" v-if="canBack" @click="btnBack">
          <div class="title_bar_back title_bar_back_black"></div>
        </div>
        <div class="title_bar_title title_bar_title_black">{{title}}</div>
        <div class="title_bar_bg_white"></div>
      </div>
      <div class="title_bar" v-else>
        <div class="title_bar_back" v-if="canBack" @click="btnBack">
          <div class="title_bar_back"></div>
        </div>
        <div class="title_bar_title">{{title}}</div>
      </div>
    </div>

    <div class="title_bar_bg" v-bind:class="{
      title_bar_bg_height_220: imageHeight === 220,
      title_bar_bg_height_300: imageHeight === 300,
      title_bar_bg_height_330: imageHeight === 330,
      title_bar_bg_height_460: imageHeight === 460,
      title_bar_bg_height_900: imageHeight === 900,
    }" v-if="theme !== 'white'"></div>
  </div>
</template>

<script>
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
      imageHeight: {
        type: Number,
        default: 300
      }
    },
    data() {
      return {
        ui: {
          inWechat: false
        }
      }
    },
    mounted() {
      this.initHistoryBack()

      let userAgent = navigator.userAgent.toLowerCase() || window.navigator.userAgent.toLowerCase()
      this.ui.inWechat = userAgent.match(/MicroMessenger/i) || userAgent.match(/webdebugger/i)
    },
    methods: {
      initHistoryBack() {
        if (!Boolean(this.backUri)) {
          window.history.pushState('forward', null, null)
          window.history.forward(1)
          return
        }

        window.history.backUri = this.backUri
        window.history.pThis = this

        if (window.history && window.history.pushState) {
          window.addEventListener('popstate', function (e) {
            window.history.pushState('forward', null, null)
            window.history.forward(1)

            if (window.history.pThis) {
              window.history.pThis.$router.push(window.history.backUri)
            } else {
              window.location = window.history.backUri
            }
          })
        }

        window.history.pushState('forward', null, null)
        window.history.forward(1)
      },
      btnBack() {
        if (Boolean(this.backUri)) {
          this.$router.push(this.backUri)
        } else {
          this.$router.back(-1)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'TitleBar';
</style>
