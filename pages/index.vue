<template>
  <div>
    <ul>
      <li v-if="!authed">
        <router-link to="login">登录入口</router-link>
      </li>
      <li v-if="!authed">
        <router-link to="login/phone">手机登录</router-link>
      </li>
      <li v-if="authed">
        <router-link to="logout">登出</router-link>
      </li>
    </ul>

    <p>后台</p>
    <ul>
      <li>
        <router-link to="shop/role">管理后台</router-link>
      </li>
      <li>
        <router-link to="b">我的店铺</router-link>
      </li>
    </ul>

    <router-link to="debug">debug</router-link>

  </div>
</template>

<script>
  import { stateApi } from "../api/local/stateApi"
  import NavBar from "../components/NavBar"
  import { loadingApi } from "../api/local/loadingApi"

  export default {
    metaInfo: {
      title: "测试主页"
    },
    data() {
      return {}
    },
    components: { NavBar },
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
