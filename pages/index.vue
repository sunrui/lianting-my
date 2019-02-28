<template>
  <div>
    <div class="blank_50"></div>
    <ul>
      <li v-if="!authed">
        <router-link to="login">登录</router-link>
      </li>
      <li v-if="authed">
        <router-link to="logout">登出</router-link>
      </li>
    </ul>

    <p>后台</p>
    <ul>
      <li>
        <router-link to="shop/role">工作台</router-link>
      </li>
      <li>
        <router-link to="b">我的店铺</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import {stateApi} from '../api/local/stateApi'

  export default {
    metaInfo: {
      title: '测试主页'
    },
    data() {
      return {}
    },
    components: {},
    computed: {
      authed() {
        let userId = stateApi.user.getId()
        return Boolean(userId)
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  @import '~assets/common';
</style>
