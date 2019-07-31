<template>
  <order-success role-type="waiter"></order-success>
</template>

<script>
  import OrderSuccess from '../../../../../../components/order/OrderSuccess'

  export default {
    middleware: 'auth',
    components: { OrderSuccess }
  }
</script>

<style lang="scss">
</style>
