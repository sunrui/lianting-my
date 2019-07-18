<template>
  <b-radio roleType="waiter"></b-radio>
</template>

<script>

  import BRadio from '../../../../../components/b/BRadio'

  export default {
    metaInfo: {
      title: '播报'
    },
    middleware: 'auth',
    components: { BRadio }
  }
</script>

<style scoped>

</style>
