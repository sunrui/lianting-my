<template>
  <b-order roleType="cashier"></b-order>
</template>

<script>
  import BOrder from '../../../../../components/b/BOrder'

  export default {
    middleware: 'auth',
    components: { BOrder }
  }
</script>

<style lang="scss">
</style>
