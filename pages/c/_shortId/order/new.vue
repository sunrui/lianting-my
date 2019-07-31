<template>
  <order-new role-type="c"></order-new>
</template>

<script>
  import OrderNew from '../../../../components/order/OrderNew'

  export default {
    middleware: 'auth',
    components: { OrderNew }
  }
</script>

<style lang="scss">
</style>
