<template>
  <div>
    <div v-if="ui.fullScreen" id="tv_full_screen" class="tv_full_screen">
      <div class="tv_full_screen_header">
        <div class="tv_shop_icon"></div>
        <div class="tv_shop_title">北京新白鹿餐厅 (长河路店)</div>
        <div class="tv_shop_state">
          <div class="tv_shop_state_icon_open"></div>
          <div class="tv_shop_state_label">营业中</div>
        </div>
      </div>
      <div class="tv_full_screen_radio">
        <div class="tv_full_screen_radio_icon"></div>
        <div class="tv_full_screen_radio_label">请<span class="tv_full_screen_radio_label_number">A4</span>号顾客前往迎宾台就餐。</div>
      </div>
      <div class="tv_full_screen_footer">
        <div class="tv_full_screen_captcha_box">
          <div class="tv_full_screen_captcha"></div>
          <div class="tv_full_screen_captcha_label">扫码可排队点餐</div>
        </div>
        <div class="tv_full_screen_time_box">
          <div class="tv_full_screen_time_box_left">
            <div class="tv_full_screen_time_time">15:24</div>
          </div>
          <div class="tv_full_screen_time_box_right">
            <div class="tv_full_screen_time_week">星期五</div>
            <div class="tv_full_screen_time_date">2016/4/4</div>
          </div>
        </div>
        <div class="tv_full_screen_footer_table"></div>
      </div>
    </div>
    <div v-else class="tv_prompt">
      <div class="tv_promt_demo"></div>
      <div class="tv_prompt_label">由于受到浏览器限制，请<span class="tv_prompt_button" @click="btnFullScreen">手动全屏</span>。</div>
    </div>
  </div>

</template>

<script>
  import {screenApi} from "../../../api/local/screenApi"

  export default {
    metaInfo: {
      title: '展屏'
    },
    data() {
      return {
        ui: {
          fullScreen: true
        }
      }
    },
    mounted() {
      document.addEventListener("fullscreenchange", this.onFullScreenChange)
      document.addEventListener("mozfullscreenchange", this.onFullScreenChange)
      document.addEventListener("webkitfullscreenchange", this.onFullScreenChange)
      document.addEventListener("msfullscreenchange", this.onFullScreenChange)
    },
    methods: {
      onFullScreenChange(e) {
        if (!screenApi.isFullScreen()) {
          this.ui.fullScreen = false
        }
      },
      btnFullScreen() {
        let element = window.document.getElementById('tv_full_screen')
        screenApi.enterFullScreen(element)

        this.ui.fullScreen = true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "tv";
</style>