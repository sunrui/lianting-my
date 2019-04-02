<template>
  <loading v-if="ui.loading"></loading>
</template>

<script>
  import Loading from "./Loading"

  export default {
    components: {Loading},
    data() {
      return {
        ui: {
          loading: false
        }
      }
    },
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = false
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
