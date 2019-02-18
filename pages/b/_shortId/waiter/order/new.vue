<template>
  <order-new :role-waiter="true"></order-new>
</template>

<script>
  import OrderNew from '../../../../../components/order/OrderNew'

  export default {
    middleware: 'auth',
    components: { OrderNew }
  }
</script>

<style scoped lang="scss">
</style>
