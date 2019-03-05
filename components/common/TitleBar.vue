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

    <div v-if="theme !== 'white'">
      <div class="title_bar_bg" v-bind:class="{
      title_bar_bg_height_220: imageHeight === 220,
      title_bar_bg_height_300: imageHeight === 300,
      title_bar_bg_height_330: imageHeight === 330,
      title_bar_bg_height_460: imageHeight === 460,
      title_bar_bg_height_900: imageHeight === 900
      }" v-if="!ui.inWechat"></div>
      <div class="title_bar_bg" v-bind:class="{
      title_bar_bg_height_220_88: imageHeight === 220,
      title_bar_bg_height_300_88: imageHeight === 300,
      title_bar_bg_height_330_88: imageHeight === 330,
      title_bar_bg_height_460_88: imageHeight === 460,
      title_bar_bg_height_900_88: imageHeight === 900
    }" v-else></div>
    </div>
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
          backUri: this.backUri,
          inWechat: false
        }
      }
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
      popStateHandle(e) {
        window.history.pushState('forward', null, null)
        window.history.forward()

        this.btnBack()
      },
      setBackUri(backUri) {
        this.ui.backUri = backUri
      },
      btnBack() {
        if (Boolean(this.ui.backUri)) {
          this.$router.push(this.ui.backUri)
        } else {
          this.$router.back()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'TitleBar';
</style>
