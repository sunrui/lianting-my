<template>
  <div>
    <transition name="fade">
      <div class="cover_mask_11" @click="btnCancel"></div>
    </transition>

    <div class="modal_center modal_center_box">
      <div class="modal_close_box" @click="btnCancel">
        <img class="modal_close" src="/img/common/close.png">
      </div>

      <div class="modal_title">{{title}}</div>

      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode'

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
      let canvas = document.getElementById('canvas')
      QRCode.toCanvas(canvas, this.text)

      console.log(this.text)
    },
    methods: {
      btnCancel() {
        this.$emit('closeCaptcha')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';

  #canvas {
    width: 100% !important;
    height: auto !important;
  }

</style>
