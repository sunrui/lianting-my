<template>
  <div>
    <loading v-show="false" id="http_loading"></loading>
    <nuxt/>
  </div>
</template>

<script>
  import Loading from '../components/common/Loading'

  export default {
    name: 'default',
    components: {Loading}
  }
</script>

<style lang="scss">
  *,
  *:before,
  *:after {
    font-size: px2rem(26);
  }
</style>
