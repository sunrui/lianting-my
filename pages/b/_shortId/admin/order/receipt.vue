<template>
  <b-order-receipt roleType="admin"></b-order-receipt>
</template>

<script>
  import BOrderReceipt from '../../../../../components/b/BOrderReceipt'

  export default {
    middleware: 'auth',
    components: {BOrderReceipt}
  }
</script>

<style lang="scss">
</style>
