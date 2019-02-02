<template>
  <section>
    <nav-bar></nav-bar>
    <hr>

    <notify-detail></notify-detail>

  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import NotifyDetail from '../../../../../components/NotifyDetail'

  export default {
    metaInfo: {
      title: '通知'
    },
    middleware: 'auth',
    components: { NavBar, NotifyDetail },
    data() {
      return {
        notifyOrders: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '通知',
        home: `/b/${this.$route.params.shortId}/cashier`
      })

      this.$store.commit('notify/update', 'cashier')
    },
    methods: {}
  }
</script>

<style scoped>

</style>
