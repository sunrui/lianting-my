<template>
  <div>
    <transition name="fade">
      <div class="cover_mask_11" @click="btnCancel"></div>
    </transition>

    <div class="modal_center">
      <div class="modal_close_box" @click="btnCancel">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">{{title}}</div>

      <canvas id="captcha_canvas"></canvas>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import {logApi} from '../../api/local/logApi'

  export default {
    props: {
      logo: {
        type: String,
        default: '/img/b/nav/owner/b_nav_owner_food.png'
      },
      title: String,
      text: String
    },
    data() {
      return {
        ui: {
          bg: ''
        }
      }
    },
    mounted() {
      let canvas = document.getElementById('captcha_canvas')
      QRCode.toCanvas(canvas, this.text)
      logApi.log(this.text)
    },
    methods: {
      btnCancel() {
        this.$emit('closeCaptcha')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';

  #captcha_canvas {
    border-top: solid 1px rgba(230, 230, 230, 0.5);
    width: 100% !important;
    height: auto !important;
  }

</style>
