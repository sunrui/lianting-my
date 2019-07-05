<template>
  <search role-type="retailer"></search>
</template>

<script>
  import Search from '../../../../../components/food/Search'

  export default {
    middleware: 'auth',
    components: { Search }
  }
</script>

<style scoped lang="scss">
</style>
