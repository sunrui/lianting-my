<template>
  <b-order roleType="waiter"></b-order>
</template>

<script>
  import BOrder from '../../../../../components/b/BOrder'

  export default {
    middleware: 'auth',
    components: { BOrder }
  }
</script>

<style scoped lang="scss">
</style>
