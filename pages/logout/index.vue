<template>
</template>

<script>
  import {httpUserApi} from '../../api/http/user/httpUserApi'
  import {stateApi} from '../../api/local/stateApi'
  import {cartApi} from '../../api/local/cartApi'

  export default {
    metaInfo: {
      title: '退出登录'
    },
    created() {
      httpUserApi.postLogout().then(res => {
        stateApi.clear()
        cartApi.clear()
        this.clearCookie()

        this.$router.push('/')
      })
    },
    methods: {
      clearCookie() {
        let keys = document.cookie.match(/[^ =;]+(?==)/g)
        if (keys) {
          for (let i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
      }
    }
  }
</script>
