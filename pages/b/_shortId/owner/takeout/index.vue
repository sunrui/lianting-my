<template>
  <section>
    <nav-bar></nav-bar>
    <button @click="btnPutTakeOutConfig">提交</button>
  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpTakeoutAdminApi } from '../../../../../api/http/ltorder/httpTakeOutAdminApi'

  export default {
    metaInfo: {
      title: '外卖'
    },
    middleware: 'auth',
    components: { NavBar },
    data() {
      return {
        takeout: {
          enable0: true,
          hourBegin0: 5,
          hourEnd0: 6,
          enable1: false,
          hourBegin1: 8,
          hourEnd1: 9,
          enable2: true,
          hourBegin2: 11,
          hourEnd2: 12,
          freeCostInKm: 3,
          extendCost: 1,
          extendKm: 5,
          maxKm: 10
        }
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '外卖',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      this.loadTakeOutConfig()
    },
    methods: {
      loadTakeOutConfig() {
        httpTakeoutAdminApi.getConfig(this.$route.params.shortId).then(res => {
        })
      },
      btnPutTakeOutConfig() {
        httpTakeoutAdminApi.putConfig(this.$route.params.shortId, this.takeout).then(res => {
          alert('修改成功')
          this.loadTakeOutConfig()
        })
      }
    }
  }
</script>

<style scoped>

</style>
