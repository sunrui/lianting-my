<template>
  <div>
    <loading v-show="false" id="http_loading"></loading>
    <transition class="fade">
      <nuxt/>
    </transition>
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
  @import '~assets/common.scss';

  *,
  *:before,
  *:after {
    font-size: px2rem(26);
  }

</style>
