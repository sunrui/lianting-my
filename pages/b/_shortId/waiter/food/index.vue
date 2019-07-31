<template>
  <food role-type="waiter"></food>
</template>

<script>
  import Food from '../../../../../components/food/Food'

  export default {
    middleware: 'auth',
    components: { Food }
  }
</script>

<style lang="scss">
</style>
