<template>
</template>

<script>
  import { httpUserApi } from '../../api/http/user/httpUserApi'
  import { stateApi } from '../../api/local/stateApi'

  export default {
    metaInfo: {
      title: '用户退出'
    },
    created() {
      httpUserApi.postLogout().then(res => {
        stateApi.clear()
        this.$router.push('/')
      })
    }
  }
</script>
