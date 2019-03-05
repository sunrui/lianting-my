<template>
  <order-add :role-waiter="false"></order-add>
</template>

<script>
  import OrderAdd from '../../../../../components/order/OrderAdd'

  export default {
    middleware: 'auth',
    components: { OrderAdd }
  }
</script>

<style scoped lang="scss">
</style>
