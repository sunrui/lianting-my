<template>
  <div class="empty">
    <img class="empty_image" src="/img/no/no_queue_user.png" alt="">
    <div class="empty_label">为了更好的服务，恋厅正在维护升级中。</div>
    <div class="empty_label_tip">当前时间：{{ui.time}}</div>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: '恋厅维护升级中'
    },
    data() {
      return {
        ui: {
          interval: null,
          time: new Date().toLocaleTimeString()
        }
      }
    },
    mounted() {
      this.ui.interval = setInterval(this.refreshTime, 1000)
    },
    beforeDestroy() {
      if (this.ui.interval) {
        clearInterval(this.ui.interval)
        this.ui.interval = null
      }
    },
    methods: {
      refreshTime() {
        this.ui.time = new Date().toLocaleTimeString()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
