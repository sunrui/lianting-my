<template>
  <b-table roleType="cashier"></b-table>
</template>

<script>
  import BTable from '../../../../../components/b/BTable'

  export default {
    middleware: 'auth',
    components: { BTable }
  }
</script>

<style lang="scss">
</style>
