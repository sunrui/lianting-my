<template>
  <b-order-receipt roleType="cooker"></b-order-receipt>
</template>

<script>
  import BOrderReceipt from '../../../../../components/b/BOrderReceipt'

  export default {
    middleware: 'auth',
    components: {BOrderReceipt}
  }
</script>

<style scoped lang="scss">
</style>
