<template>
  <error-catch :error="error"></error-catch>
</template>

<script>
  import ErrorCatch from '../components/common/ErrorCatch'

  export default {
    props: ['error'],
    components: {ErrorCatch}
  }
</script>

<style scoped lang="scss">
</style>
