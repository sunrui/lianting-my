<template>
  <loading v-if="ui.loading"></loading>
</template>

<script>
  import Loading from "./Loading"

  export default {
    components: {Loading},
    data: () => ({
      ui: {
        loading: false
      }
    }),
    methods: {
      start() {
        this.ui.loading = true
      },
      finish() {
        this.ui.loading = false
      }
    }
  }
</script>

<style lang="scss">
</style>
