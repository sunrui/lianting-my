<template>
</template>

<script>
  import {httpUserApi} from '../../api/http/user/httpUserApi'
  import {userApi} from '../../api/local/userApi'
  import {cartApi} from '../../api/local/cartApi'
  import {storeApi} from '../../api/local/storeApi'
  import {cookieApi} from "../../api/local/cookieApi"

  export default {
    metaInfo: {
      title: '退出登录'
    },
    created() {
      httpUserApi.postLogout().then(res => {
        userApi.clearAll()
        cartApi.clearAll()
        storeApi.clearAll()
        cookieApi.clearAll()

        this.$router.push('/')
      })
    }
  }
</script>
