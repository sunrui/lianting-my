<template>
  <b-order-one roleType="owner"></b-order-one>
</template>

<script>
  import BOrderOne from '../../../../../../components/b/BOrderOne'

  export default {
    middleware: 'auth',
    components: { BOrderOne }
  }
</script>

<style lang="scss">
</style>
