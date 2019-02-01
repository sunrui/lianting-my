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
      title: '厨师'
    },
    middleware: 'auth',
    components: {NavBar, NotifyDetail},
    data() {
      return {
        notifyOrders: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '厨师',
        home: `/b/${this.$route.params.shortId}/cook`
      })

      this.$store.commit('notify/update', 'cooker')
    },
    methods: {}
  }
</script>

<style scoped>

</style>
