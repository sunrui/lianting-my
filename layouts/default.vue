<template>
  <div>
    <loading v-show="false" id="http_loading"></loading>
    <div class="home" onclick="window.location.href='/'"></div>
    <nuxt/>
  </div>
</template>

<script>
  import Loading from '../components/common/Loading'

  export default {
    name: 'default',
    components: { Loading }
  }
</script>

<style lang="scss">
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

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    font-size: px2rem(26);
  }

  .home {
    border: 1px;
    width: px2rem(30);
    height: px2rem(30);
    border-radius: 30px;
    background: orangered;
    position: fixed;
    right: px2rem(30);
    top: px2rem(100);
    z-index: 99;
  }
</style>
