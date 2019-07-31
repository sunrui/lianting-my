<template>
  <search role-type="waiter"></search>
</template>

<script>
  import Search from '../../../../../components/food/Search'

  export default {
    middleware: 'auth',
    components: { Search }
  }
</script>

<style lang="scss">
</style>
