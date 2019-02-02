<template>
  <div>
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

    <div class="title_bar_bg" v-bind:class="{
      title_bar_bg_height_220: imageHeight === 220,
      title_bar_bg_height_300: imageHeight === 300,
      title_bar_bg_height_330: imageHeight === 330
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
    methods: {
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
  @import '~assets/common.scss';
</style>
