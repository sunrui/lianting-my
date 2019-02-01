<template>
  <section>
    <p>店铺正在初始化中</p>
    <p>认证您的身份信息</p>
    <p>确认您的店铺唯一标识</p>
    <p>生成店铺初始化数据</p>
    <p>店铺创建成功</p>
    <p>生成店铺二维码</p>

    <button @click="btnShopAdmin">进入管理店铺</button>
  </section>
</template>

<script>
  import {httpShopApi} from '../../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '店铺初始化'
    },
    middleware: 'auth',
    data() {
      return {
        shop: {}
      }
    },
    created() {
      console.log(this.$route.params.shortId)

      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        this.shop = res
      })
    },
    methods: {
      btnShopAdmin() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner`)
      }
    }
  }
</script>

<style scoped>

</style>
