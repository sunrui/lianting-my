<template>
  <div class="container" v-show="false" id="nuxt_div">
    <nuxt v-lazy-container="{ selector: 'img' }"/>
    <loading v-show="false" id="nuxt_loading" v-lazy-container="{ selector: 'img' }"></loading>
  </div>
</template>

<script>
import Loading from '../components/common/Loading'
import {remApi} from '@/api/local/remApi'

export default {
  name: 'default',
  components: {Loading},
  mounted() {
    remApi.init()
  }
}
</script>

<style scoped lang="scss">
html, body {
  font-size: 26px;
  margin: 0;
  padding: 0;
}

.container {
  font-size: 26px;
  margin: 0;
  padding: 0;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  font-size: 26px;
  margin: 0;
  padding: 0;
}
</style>
