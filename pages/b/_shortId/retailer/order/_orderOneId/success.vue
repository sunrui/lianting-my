<template>
  <order-success roleType="retailer"></order-success>
</template>

<script>
  import OrderSuccess from '../../../../../../components/order/OrderSuccess'

  export default {
    middleware: 'auth',
    components: { OrderSuccess }
  }
</script>

<style scoped lang="scss">
</style>
