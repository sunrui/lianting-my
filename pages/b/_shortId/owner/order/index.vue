<template>
  <b-order :date="ui.date" roleType="owner"></b-order>
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

<style lang="scss">
</style>
