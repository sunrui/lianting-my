<template>
  <b-order :date="ui.date" role="owner"></b-order>
</template>

<script>
  import BOrder from '../../../../../components/b/BOrder'

  export default {
    middleware: 'auth',
    components: { BOrder },
    data() {
      return {
        ui: {
          date: this.$route.query.date
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
