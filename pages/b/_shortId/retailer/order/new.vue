<template>
  <order-new role-type="retailer"></order-new>
</template>

<script>
  import OrderNew from '../../../../../components/order/OrderNew'

  export default {
    middleware: 'auth',
    components: { OrderNew }
  }
</script>

<style lang="scss">
</style>
