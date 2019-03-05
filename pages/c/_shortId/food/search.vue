<template>
  <search :role-waiter="false"></search>
</template>

<script>
  import Search from '../../../../components/food/Search'

  export default {
    middleware: 'auth',
    components: { Search }
  }
</script>

<style scoped lang="scss">
</style>
