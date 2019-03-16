<template>
  <div class="container">
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

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;

    user-select: none;
    background: #eef0f3;
    margin: 0;
    color: #333333;
  }

  .container {
    margin: 0;
    padding: 0;
  }

  * {
    touch-action: pan-y;
  }

  a, button, input {
    -webkit-tap-highlight-color: transparent;
    outline: none;
    box-shadow: none;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    font-size: px2rem(26);
  }

  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  input[type="number"]{-moz-appearance:textfield;}

</style>
