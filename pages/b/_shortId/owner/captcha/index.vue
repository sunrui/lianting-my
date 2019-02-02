<template>
  <section>
    <nav-bar></nav-bar>

    <div v-if="ui.loading">
      <p>loading 的小圈圈</p>
    </div>
    <div v-else>
      <p>餐厅信息</p>
      <p>名称 {{shop.name}}</p>
      <button @click="btnShopUser">{{ 'http://localhost:3000/m/' + shop.shortId}}</button>
      <hr>

      <p>餐桌信息</p>
      <div v-bind:key="tableGroup.id" v-for="tableGroup in tableGroups.elements">
        <p>{{tableGroup.name}} ({{ tableGroup.minPeople }}-{{ tableGroup.maxPeople }} 人)</p>
        <p v-if="tableGroup.privateRoom">包间</p>

        <div v-bind:key="table.id" v-for="table in tableGroup.tableOnes">
          <p>{{table.tableGroup_Name}} {{table.fullNumber}}</p>
          <button @click="btnShopTable(table)">{{ getShopTableUri(table) }}</button>
          <hr>
        </div>
        <hr>
      </div>

      <div v-if="!tableGroups.elements || tableGroups.elements.length === 0">
        <p>暂无餐桌</p>
      </div>
    </div>
  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpTableApi } from '../../../../../api/http/ltorder/httpTableApi'
  import { httpShopApi } from '../../../../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '二维码'
    },
    middleware: 'auth',
    components: { NavBar },
    data() {
      return {
        shop: {},
        tableGroups: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: true,
        title: '二维码',
        home: `/b/${this.$route.params.shortId}/owner`
      })

      httpShopApi.getOne(this.$route.params.shortId).then(res => {
        console.log(res)
        this.shop = res

        httpTableApi.getGroupAll(this.$route.params.shortId).then(res => {
          this.tableGroups = res
        })
      })
    },
    methods: {
      btnShopUser() {
        this.$router.push('/m/' + this.shop.shortId)
      },
      btnShopTable(table) {
        this.$router.push(`/m/${this.shop.shortId}/captcha/${table.id}`)
      },
      getShopTableUri(table) {
        return document.location.protocol + '//' + window.location.host + `/m/${this.shop.shortId}/captcha/${table.id}`
      }
    }
  }
</script>

<style scoped>

</style>
