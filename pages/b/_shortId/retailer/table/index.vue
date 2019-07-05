<template>
  <b-table roleType="retailer"></b-table>
</template>

<script>
  import BTable from '../../../../../components/b/BTable'

  export default {
    middleware: 'auth',
    components: { BTable }
  }
</script>

<style scoped lang="scss">
</style>
