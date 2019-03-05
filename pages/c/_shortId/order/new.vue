<template>
  <order-new :role-waiter="false"></order-new>
</template>

<script>
  import OrderNew from '../../../../components/order/OrderNew'

  export default {
    middleware: 'auth',
    components: { OrderNew }
  }
</script>

<style scoped lang="scss">
</style>
