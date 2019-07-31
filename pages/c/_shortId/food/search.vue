<template>
  <search role-type="c"></search>
</template>

<script>
  import Search from '../../../../components/food/Search'

  export default {
    middleware: 'auth',
    components: { Search }
  }
</script>

<style lang="scss">
</style>
