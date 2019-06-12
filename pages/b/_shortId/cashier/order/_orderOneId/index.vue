<template>
  <b-order-one roleType="cashier"></b-order-one>
</template>

<script>
  import BOrderOne from '../../../../../../components/b/BOrderOne'

  export default {
    middleware: 'auth',
    components: { BOrderOne }
  }
</script>

<style scoped lang="scss">
</style>
