<template>
  <section>
    <button @click="btnCheckToggle">{{ ui.enable? '(已开启)' : '(已关闭)'}}</button>
    <button @click="btnNotify">最新消息</button>
  </section>
</template>

<script>
  import {httpNotifyAdminApi} from '../api/http/ltorder/httpNotifyAdminApi'

  export default {
    middleware: 'auth',
    data() {
      return {
        types: null,
        shortId: null,
        ui: {
          interval: null,
          audio: null,
          enable: false,
          tick: 10 * 1000
        }
      }
    },
    computed: {
      role: function() {
        return this.$store.state.notify.role
      }
    },
    created() {
      switch (this.role) {
        case 'waiter': {
          this.types = 'New, FoodAdd, FoodCooked, FoodReturn, Paid'
          break
        }
        case 'cooker': {
          this.types = 'New, FoodAdd, FoodCooked, FoodReturn'
          break
        }
        case 'cashier': {
          this.types = 'Paid'
          break
        }
      }

      this.shortId = this.$route.params.shortId
    },
    mounted() {
      this.ui.audio = document.createElement('audio')
      this.ui.audio.autoplay = false
      // this.ui.audio.src = "http://zjlt.sc.chinaz.com/Files/DownLoad/sound1/201506/6005.wav";
      this.ui.audio.style.display = 'none'

      this.btnCheckToggle()
    },
    methods: {
      _notifyOrderCheck() {
        if (this.ui.interval !== null) {
          clearInterval(this.ui.interval)
          this.ui.interval = null
        }

        httpNotifyAdminApi.getNotifyOrder(this.shortId, true, this.types, 0, 1).then(res => {
          if (res.totalSize > 0 && this.ui.audio.paused) {
            if (this.ui.enable) {
              this.ui.audio.play()
              if (this.ui.interval === null) {
                this.ui.interval = setInterval(this._notifyOrderCheck, this.ui.tick)
              }
            }
          }
        })
      },
      btnCheckToggle() {
        this.ui.enable = !this.ui.enable

        if (this.ui.enable) {
          if (this.ui.interval === null) {
            this.ui.interval = setInterval(this._notifyOrderCheck, this.ui.tick)
          }
        }
      },
      btnNotify() {
        this.$router.push(`/b/${this.shortId}/${this.role}/notify`)
      }
    }
  }
</script>

<style scoped>

</style>
