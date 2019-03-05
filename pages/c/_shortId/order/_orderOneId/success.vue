<template>
  <order-success :role-waiter="false"></order-success>
</template>

<script>
  import OrderSuccess from '../../../../../components/order/OrderSuccess'

  export default {
    middleware: 'auth',
    components: { OrderSuccess }
  }
</script>

<style scoped lang="scss">
</style>
