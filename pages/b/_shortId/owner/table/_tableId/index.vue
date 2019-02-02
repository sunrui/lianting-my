<template>
  <section>
    <table-detail></table-detail>
  </section>
</template>

<script>
  import TableDetail from '../../../../../../components/TableDetail'

  export default {
    metaInfo: {
      title: '餐桌详情'
    },
    middleware: 'auth',
    components: { TableDetail },
    data() {
      return {
        table: {},
        ui: {}
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
