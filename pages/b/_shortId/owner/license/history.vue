<template>
  <section>
    <nav-bar></nav-bar>

    <div v-if="ui.loading">
      <p>loading...</p>
    </div>
    <div v-else>
      <div v-bind:key="shopLicense.id" v-for="shopLicense in shopLicenseRes.elements">
        <hr>
        <p>shopType {{shopLicense.shopType}}</p>
        <p>licenseType {{shopLicense.licenseType}}</p>
        <p>name {{shopLicense.name}}</p>
        <p>days {{shopLicense.days}}</p>
        <p>price {{shopLicense.price}}</p>
        <p>year {{shopLicense.year}}</p>
        <p>payMethod {{shopLicense.payMethod}}</p>
        <p>beforeExpiredAt {{new Date(parseInt(shopLicense.beforeExpiredAt)).toLocaleString()}}</p>
        <p>afterExpiredAt {{new Date(parseInt(shopLicense.afterExpiredAt)).toLocaleString()}}</p>
      </div>
      <div v-if="shopLicenseRes.elements === null || shopLicenseRes.elements.length === 0">
        <p>没有续费记录</p>
      </div>
    </div>
  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpShopLicenseApi } from '../../../../../api/http/shop/httpShopLicenseApi'

  export default {
    metaInfo: {
      title: '续费记录'
    },
    middleware: 'auth',
    components: { NavBar },
    data() {
      return {
        shopLicenseRes: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '续费记录',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      httpShopLicenseApi.getAll(this.$route.params.shortId).then(res => {
        this.shopLicenseRes = res
      })
    }
  }
</script>

<style scoped>

</style>
