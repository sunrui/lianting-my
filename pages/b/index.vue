<template>
</template>

<script>
  import { httpShopApi } from "../../api/http/shop/httpShopApi"

  export default {
    metaInfo: {
      title: "我的店铺"
    },
    middleware: "auth",
    created() {
      httpShopApi.getCount().then(res => {
        if (res > 0) {
          this.$router.push("/shop")
        } else {
          this.$router.push("/shop/create")
        }
      })
    }
  }
</script>

<style scoped>
</style>
