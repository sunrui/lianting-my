<template>
  <div>
    <transition name="fade">
      <div :class="{ cover_mask_11: ui.vCoverMask}" @click="btnCancel"></div>
    </transition>

    <div class="modal_center" v-if="ui.vCoverMask">
      <div class="modal_close_box" @click="btnCancel">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">{{title}}</div>
      <div class="modal_content" v-html="content"></div>

      <div class="modal_button_box">
        <div class="button_small" @click="btnConfirm">确认</div>
        <div class="button_small button_gray" v-if="type === 'yesOrNo'" @click="btnCancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {scrollApi} from '../../api/local/scrollApi'

  export default {
    props: {
      title: String,
      content: String,
      type: 'Yes'
    },
    data() {
      return {
        ui: {
          vCoverMask: true
        },
        resolve: '',
        promise: ''
      }
    },
    methods: {
      btnConfirm() {
        this.ui.vCoverMask = false
        this.resolve('Yes')
        this.remove()
      },
      btnCancel() {
        this.ui.vCoverMask = false
        this.resolve('No')
        this.remove()
      },
      doModal() {
        this.ui.vCoverMask = true
        scrollApi.enable(false)

        this.promise = new Promise((resolve, reject) => {
          this.resolve = resolve
        })
        return this.promise
      },
      remove() {
        scrollApi.enable(true)

        setTimeout(() => {
          this.destroy()
        }, 100)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
